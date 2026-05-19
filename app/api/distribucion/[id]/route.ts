// app/api/distribucion/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getUsuarioActual } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Rol, EstadoTurno } from "@prisma/client"

// 🟢 1. EDITAR / ACTUALIZAR TURNO
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado || usuarioLogueado.rol === Rol.FAMILIA) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // 🟢 SOLUCIÓN: Desenvolvemos la Promesa de los params usando await
    const params = await context.params
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: "Falta el ID del turno" }, { status: 400 })
    }

    const body = await req.json()
    const { horaInicio, duracionMin, estado } = body

    const datosAActualizar: any = {}
    if (horaInicio) datosAActualizar.horaInicio = horaInicio
    if (duracionMin) datosAActualizar.duracionMin = parseInt(duracionMin)
    if (estado) datosAActualizar.estado = estado as EstadoTurno

    const turnoActualizado = await prisma.turnoDistribucion.update({
      where: { id: id },
      data: datosAActualizar
    })

    return NextResponse.json({ data: turnoActualizado }, { status: 200 })
  } catch (error) {
    console.error("[PUT /api/distribucion/[id]]", error)
    return NextResponse.json({ error: "Error al actualizar el turno" }, { status: 500 })
  }
}

// 🟢 2. CANCELAR / ELIMINAR TURNO
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado || usuarioLogueado.rol === Rol.FAMILIA) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // 🟢 SOLUCIÓN: Desenvolvemos la Promesa de los params usando await
    const params = await context.params
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del turno" }, { status: 400 })
    }

    await prisma.turnoDistribucion.delete({
      where: { id: id }
    })

    return NextResponse.json({ mensaje: "Turno eliminado con éxito" }, { status: 200 })
  } catch (error) {
    console.error("[DELETE /api/distribucion/[id]]", error)
    return NextResponse.json({ error: "Error al eliminar el turno" }, { status: 500 })
  }
}