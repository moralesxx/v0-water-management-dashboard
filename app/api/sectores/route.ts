// app/api/sectores/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // Ajusta la ruta a tu cliente de Prisma si es diferente

export async function GET() {
  try {
    // Buscamos todos los sectores en la base de datos
    const sectores = await prisma.sector.findMany({
      orderBy: {
        nombre: "asc", // Los ordenamos alfabéticamente
      },
    })

    // Devolvemos los datos en el formato que espera tu modal (data: [...])
    return NextResponse.json({ data: sectores })
  } catch (error) {
    console.error("Error al obtener sectores:", error)
    return NextResponse.json(
      { error: "Error interno al cargar los sectores" },
      { status: 500 }
    )
  }
}