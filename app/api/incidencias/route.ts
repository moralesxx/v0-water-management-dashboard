// app/api/incidencias/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getUsuarioActual } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Rol, TipoIncidencia, UrgenciaIncidencia, EstadoIncidencia } from "@prisma/client"
import { z } from "zod"

const crearIncidenciaSchema = z.object({
  descripcion: z.string().min(5),
  sectorNombre: z.string().min(1),
  tipo: z.string().min(1),
  urgencia: z.string().min(1),
  estado: z.string().min(1),
})

// ─── GET /api/incidencias ─────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.trim() ?? ""
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")))
    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { descripcion: { contains: search, mode: "insensitive" as const } },
            { sector: { nombre: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}

    const [incidencias, total] = await Promise.all([
      prisma.incidencia.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          sector: { select: { id: true, nombre: true } },
          reportadaPor: { select: { id: true, nombre: true } },
        },
      }),
      prisma.incidencia.count({ where }),
    ])

    return NextResponse.json({
      data: incidencias,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[GET /api/incidencias]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// ─── POST /api/incidencias ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (usuarioLogueado.rol === Rol.FAMILIA) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = crearIncidenciaSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos de formulario inválidos" }, { status: 422 })
    }

    const { descripcion, sectorNombre, tipo, urgencia, estado } = parsed.data

    const sector = await prisma.sector.findFirst({
      where: { nombre: { equals: sectorNombre, mode: "insensitive" } },
    })

    if (!sector) {
      return NextResponse.json({ error: `El sector '${sectorNombre}' no existe` }, { status: 404 })
    }

    const nuevaIncidencia = await prisma.incidencia.create({
      data: {
        descripcion,
        tipo: tipo.toUpperCase() as TipoIncidencia,
        urgencia: urgencia.toUpperCase() as UrgenciaIncidencia,
        estado: estado.toUpperCase() as EstadoIncidencia,
        sectorId: sector.id,
        reportadaPorId: usuarioLogueado.id,
      },
    })

    await prisma.bitacoraAuditoria.create({
      data: {
        accion: "REGISTRAR_INCIDENCIA",
        entidad: "Incidencia",
        entidadId: nuevaIncidencia.id,
        detalles: { sectorNombre, urgencia, tipo } as any,
        usuarioId: usuarioLogueado.id,
      },
    })

    return NextResponse.json({ data: nuevaIncidencia }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/incidencias]", error)
    return NextResponse.json({ error: "Error interno al guardar la incidencia" }, { status: 500 })
  }
}