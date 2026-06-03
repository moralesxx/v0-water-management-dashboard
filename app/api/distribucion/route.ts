// app/api/distribucion/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getUsuarioActual } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Rol, EstadoTurno } from "@prisma/client"
import { z } from "zod"

const crearTurnoSchema = z.object({
  sectorNombre: z.string().min(1),
  dia: z.string().min(1),
  horaInicio: z.string().min(1),
  duracionMin: z.number().min(1),
})

// ─── GET /api/distribucion ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dia = searchParams.get("dia") ?? undefined

    const turnos = await prisma.turnoDistribucion.findMany({
      where: dia ? { dia } : undefined,
      orderBy: { horaInicio: "asc" },
      include: {
        sector: { select: { id: true, nombre: true } },
        confirmadoPor: { select: { id: true, nombre: true } },
      },
    })

    return NextResponse.json({ data: turnos })
  } catch (error) {
    console.error("[GET /api/distribucion]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// ─── POST /api/distribucion ───────────────────────────────────────────────────
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
    const parsed = crearTurnoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 422 })
    }

    const { sectorNombre, dia, horaInicio, duracionMin } = parsed.data

    const sector = await prisma.sector.findFirst({
      where: { nombre: { equals: sectorNombre, mode: "insensitive" } },
    })

    if (!sector) {
      return NextResponse.json(
        { error: `El sector '${sectorNombre}' no está registrado en el sistema` },
        { status: 404 }
      )
    }

    const nuevoTurno = await prisma.turnoDistribucion.create({
      data: {
        dia,
        horaInicio,
        duracionMin,
        estado: EstadoTurno.PROGRAMADO,
        sectorId: sector.id,
      },
      include: { sector: true },
    })

    return NextResponse.json({ data: nuevoTurno }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/distribucion]", error)
    return NextResponse.json({ error: "Error interno en el servidor al almacenar turno" }, { status: 500 })
  }
}