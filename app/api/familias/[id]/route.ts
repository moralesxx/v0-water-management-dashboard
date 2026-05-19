// app/api/familias/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ─── GET /api/familias/[id] ──────────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: { id: string } } // O Promise<{ id: string }> dependiendo de tu linter
) {
  try {
    // CORRECCIÓN: Desempaquetar params con await obligatoriamente
    const { id } = await params

    const familia = await prisma.familia.findUnique({
      where: { id },
      include: {
        usuario: true,
        sector: true,
        pagos: {
          orderBy: { anioPeriodo: "desc" },
        },
      },
    })

    if (!familia) {
      return NextResponse.json({ error: "Familia no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ data: familia })
  } catch (error) {
    console.error("[GET /api/familias/[id]]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// ─── PATCH /api/familias/[id] ────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // CORRECCIÓN: Desempaquetar params con await para evitar el Error 500
    const { id } = await params
    const body = await request.json()

    const familiaActualizada = await prisma.familia.update({
      where: { id },
      data: {
        nombreRepresentante: body.nombreRepresentante,
        direccion: body.direccion,
        telefono: body.telefono,
        sectorId: body.sectorId,
      },
    })

    return NextResponse.json({ data: familiaActualizada })
  } catch (error) {
    console.error("[PATCH /api/familias/[id]]", error)
    return NextResponse.json({ error: "Error al actualizar la familia" }, { status: 500 })
  }
}