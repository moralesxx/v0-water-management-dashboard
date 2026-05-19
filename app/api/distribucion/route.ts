// app/api/distribucion/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getUsuarioActual } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Rol, EstadoTurno } from "@prisma/client"
import { z } from "zod"

const crearTurnoSchema = z.object({
  sectorNombre: z.string().min(1), // Recibimos el nombre (Norte, Centro, etc.)
  dia: z.string().min(1),          // "Lunes", "Martes", etc.
  horaInicio: z.string().min(1),   // "08:00"
  duracionMin: z.number().min(1),  // Minutos de apertura de válvula
})

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

    // 1. Buscar el ID real del sector en la base de datos por su nombre
    const sector = await prisma.sector.findFirst({
      where: { nombre: { equals: sectorNombre, mode: "insensitive" } }
    })

    if (!sector) {
      return NextResponse.json({ error: `El sector '${sectorNombre}' no está registrado en el sistema` }, { status: 404 })
    }

    // 2. Crear el turno en Supabase con tu modelo real
    const nuevoTurno = await prisma.turnoDistribucion.create({
      data: {
        dia,
        horaInicio,
        duracionMin,
        estado: EstadoTurno.PROGRAMADO, // Usando tu Enum nativo
        sectorId: sector.id,
      },
      include: {
        sector: true // Traemos el objeto sector de vuelta
      }
    })

    return NextResponse.json({ data: nuevoTurno }, { status: 201 })

  } catch (error) {
    console.error("[POST /api/distribucion]", error)
    return NextResponse.json({ error: "Error interno en el servidor al almacenar turno" }, { status: 500 })
  }
}