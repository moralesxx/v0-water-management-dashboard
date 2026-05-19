// app/api/familias/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getUsuarioActual } from "@/lib/auth" // <-- CAMBIO: Importamos tu función personalizada
import { prisma } from "@/lib/prisma"
import { EstadoServicio, Rol } from "@prisma/client"
import { z } from "zod"

// ─── Validación ───────────────────────────────────────────────────────────────
const crearFamiliaSchema = z.object({
  nombreRepresentante: z.string().min(3, "Nombre muy corto").max(100),
  direccion: z.string().min(5, "Dirección muy corta").max(200),
  telefono: z.string().optional(),
  sectorId: z.string().cuid("Sector inválido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
})

// ─── GET /api/familias ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    // CAMBIO: Validamos la sesión usando tu cookie 'auth_token' mediante jose
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { rol } = usuarioLogueado
    if (rol === Rol.FAMILIA) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // ── Query params ──
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.trim() ?? ""
    const sectorId = searchParams.get("sectorId") ?? undefined
    const estado = searchParams.get("estado") as EstadoServicio | null
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50")))
    const skip = (page - 1) * limit

    // ── Where clause ──
    const where = {
      ...(search && {
        OR: [
          { nombreRepresentante: { contains: search, mode: "insensitive" as const } },
          { codigoFamilia: { contains: search, mode: "insensitive" as const } },
          { sector: { nombre: { contains: search, mode: "insensitive" as const } } },
          { direccion: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(sectorId && { sectorId }),
      ...(estado && { estadoServicio: estado }),
    }

    // ── Queries en paralelo ──
    const [familias, total, stats] = await Promise.all([
      prisma.familia.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          sector: { select: { id: true, nombre: true } },
          usuario: { select: { id: true, email: true, activo: true } },
          pagos: {
            orderBy: [{ anioPeriodo: "desc" }, { mesPeriodo: "desc" }],
            take: 1,
            select: {
              estadoPago: true,
              mesPeriodo: true,
              anioPeriodo: true,
              monto: true,
            },
          },
        },
      }),
      prisma.familia.count({ where }),
      prisma.familia.groupBy({
        by: ["estadoServicio"],
        _count: { _all: true },
      }),
    ])

    // ── Formatear stats ──
    const totalFamilias = stats.reduce((acc, s) => acc + s._count._all, 0)
    const statsMap = Object.fromEntries(
      stats.map((s) => [s.estadoServicio, s._count._all])
    )

    return NextResponse.json({
      data: familias,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalFamilias,
        activos: statsMap[EstadoServicio.ACTIVO] ?? 0,
        suspendidos: statsMap[EstadoServicio.SUSPENDIDO] ?? 0,
      },
    })
  } catch (error) {
    console.error("[GET /api/familias]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// ─── POST /api/familias ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // CAMBIO: Validamos la sesión usando tu cookie 'auth_token' mediante jose
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { rol, id: adminId } = usuarioLogueado
    if (rol !== Rol.ADMIN) {
      return NextResponse.json({ error: "Solo el administrador puede registrar familias" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = crearFamiliaSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const { nombreRepresentante, direccion, telefono, sectorId, email, password } = parsed.data

    // ── Verificar sector existe ──
    const sector = await prisma.sector.findUnique({ where: { id: sectorId } })
    if (!sector || !sector.activo) {
      return NextResponse.json({ error: "Sector no encontrado o inactivo" }, { status: 404 })
    }

    // ── Verificar email único ──
    const emailExiste = await prisma.usuario.findUnique({ where: { email } })
    if (emailExiste) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    // ── Generar código correlativo ──
    const ultimaFamilia = await prisma.familia.findFirst({
      orderBy: { createdAt: "desc" },
      select: { codigoFamilia: true },
    })
    const siguiente = ultimaFamilia
      ? parseInt(ultimaFamilia.codigoFamilia.replace("FAM-", ""), 10) + 1
      : 1
    const codigoFamilia = `FAM-${String(siguiente).padStart(3, "0")}`

    // ── Hash de contraseña ──
    const bcrypt = await import("bcryptjs")
    const passwordHash = await bcrypt.hash(password, 10)

    // ── Transacción: usuario + familia + auditoría ──
    const familia = await prisma.$transaction(async (tx) => {
      const nuevoUsuario = await tx.usuario.create({
        data: {
          nombre: nombreRepresentante,
          email,
          passwordHash,
          rol: Rol.FAMILIA,
        },
      })

      const nuevaFamilia = await tx.familia.create({
        data: {
          codigoFamilia,
          nombreRepresentante,
          direccion,
          telefono,
          estadoServicio: EstadoServicio.ACTIVO,
          usuarioId: nuevoUsuario.id,
          sectorId,
        },
        include: {
          sector: { select: { id: true, nombre: true } },
          usuario: { select: { id: true, email: true } },
        },
      })

      await tx.bitacoraAuditoria.create({
        data: {
          accion: "CREAR_FAMILIA",
          entidad: "Familia",
          entidadId: nuevaFamilia.id,
          detalles: { codigoFamilia, nombreRepresentante, sectorId },
          usuarioId: adminId,
        },
      })

      return nuevaFamilia
    })

    return NextResponse.json({ data: familia }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/familias]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}