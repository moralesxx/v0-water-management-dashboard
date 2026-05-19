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

    // 1. Buscar el sector correspondiente por su nombre real
    const sector = await prisma.sector.findFirst({
      where: { nombre: { equals: sectorNombre, mode: "insensitive" } }
    })

    if (!sector) {
      return NextResponse.json({ error: `El sector '${sectorNombre}' no existe` }, { status: 404 })
    }

    // 2. Crear la incidencia mapeando exactamente a las columnas de tu BD
    const nuevaIncidencia = await prisma.incidencia.create({
      data: {
        descripcion: descripcion,
        tipo: tipo.toUpperCase() as TipoIncidencia,
        urgencia: urgencia.toUpperCase() as UrgenciaIncidencia,
        estado: estado.toUpperCase() as EstadoIncidencia,
        sectorId: sector.id,
        reportadaPorId: usuarioLogueado.id,
      }
    })

    // 3. Registrar en bitácora
    await prisma.bitacoraAuditoria.create({
      data: {
        accion: "REGISTRAR_INCIDENCIA",
        entidad: "Incidencia",
        entidadId: nuevaIncidencia.id,
        detalles: { sectorNombre, urgencia, tipo },
        usuarioId: usuarioLogueado.id,
      },
    })

    return NextResponse.json({ data: nuevaIncidencia }, { status: 201 })

  } catch (error) {
    console.error("[POST /api/incidencias]", error)
    return NextResponse.json({ error: "Error interno al guardar la incidencia" }, { status: 500 })
  }
}