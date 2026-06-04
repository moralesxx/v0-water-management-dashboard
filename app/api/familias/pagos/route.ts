// app/api/familias/pagos/route.ts
// Devuelve TODAS las familias con su estado de pago actual
import { NextRequest, NextResponse } from "next/server"
import { getUsuarioActual } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Rol } from "@prisma/client"

const CUOTA_MENSUAL = 60.00

export async function GET(req: NextRequest) {
  try {
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    if (usuarioLogueado.rol === Rol.FAMILIA) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.trim() ?? ""
    const filtroEstado = searchParams.get("estado") ?? "TODOS" // TODOS | AL_DIA | MOROSO
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10")))
    const skip = (page - 1) * limit

    const whereClause = {
      ...(search && {
        OR: [
          { nombreRepresentante: { contains: search, mode: "insensitive" as const } },
          { codigoFamilia: { contains: search, mode: "insensitive" as const } },
          { sector: { nombre: { contains: search, mode: "insensitive" as const } } },
        ],
      }),
    }

    const familias = await prisma.familia.findMany({
      where: whereClause,
      include: {
        sector: { select: { id: true, nombre: true } },
        pagos: {
          select: {
            estadoPago: true,
            mesPeriodo: true,
            anioPeriodo: true,
            monto: true,
          },
          orderBy: [{ anioPeriodo: "desc" }, { mesPeriodo: "desc" }]
        }
      },
      orderBy: { codigoFamilia: "asc" }
    })

    // Calcular estado real de cada familia
    const familiasProcesadas = familias.map((familia) => {
      const mesesEnMora = familia.pagos.filter(
        p => p.estadoPago === "PENDIENTE" || p.estadoPago === "MOROSO"
      ).length

      const ultimoPago = familia.pagos.find(p => p.estadoPago === "PAGADO")

      return {
        id: familia.id,
        codigoFamilia: familia.codigoFamilia,
        nombreRepresentante: familia.nombreRepresentante,
        sector: familia.sector,
        estadoServicio: familia.estadoServicio,
        mesesEnMora,
        balance: mesesEnMora * CUOTA_MENSUAL,
        esMoroso: mesesEnMora > 0,
        ultimoPago: ultimoPago
          ? `${ultimoPago.mesPeriodo}/${ultimoPago.anioPeriodo}`
          : null,
      }
    })

    // Filtrar por estado si se pidió
    const familiasFiltradas = familiasProcesadas.filter(f => {
      if (filtroEstado === "MOROSO") return f.esMoroso
      if (filtroEstado === "AL_DIA") return !f.esMoroso
      return true // TODOS
    })

    const total = familiasFiltradas.length
    const datosPaginados = familiasFiltradas.slice(skip, skip + limit)

    return NextResponse.json({
      data: datosPaginados,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      resumen: {
        totalFamilias: familiasProcesadas.length,
        morosas: familiasProcesadas.filter(f => f.esMoroso).length,
        alDia: familiasProcesadas.filter(f => !f.esMoroso).length,
        deudaTotal: familiasProcesadas.reduce((acc, f) => acc + f.balance, 0),
      }
    })

  } catch (error) {
    console.error("[GET /api/familias/pagos]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}