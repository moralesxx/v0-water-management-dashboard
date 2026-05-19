// app/api/pagos/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getUsuarioActual } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Rol } from "@prisma/client" 
import { z } from "zod"

const registrarPagoSchema = z.object({
  familiaId: z.string().cuid("ID de familia inválido"),
  cantidadMeses: z.number().min(1, "Debe pagar al menos 1 mes"),
  monto: z.number().positive("El monto debe ser mayor a 0"),
  metodoPago: z.enum(["EFECTIVO", "TRANSFERENCIA", "DEPOSITO"]),
})

export async function POST(req: NextRequest) {
  try {
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (usuarioLogueado.rol === Rol.FAMILIA || usuarioLogueado.rol === Rol.ENCARGADO) {
      return NextResponse.json({ error: "Acceso denegado. Rol insuficiente." }, { status: 403 })
    }

    const body = await req.json()
    const parsed = registrarPagoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 422 })
    }

    const { familiaId, cantidadMeses, monto, metodoPago } = parsed.data

    const familia = await prisma.familia.findUnique({
      where: { id: familiaId },
    })
    if (!familia) {
      return NextResponse.json({ error: "La familia no existe" }, { status: 404 })
    }

    // Normalizamos el string para que coincida con el Enum de Supabase
    const miTipoPago = metodoPago.toUpperCase();

    const resultado = await prisma.$transaction(async (tx) => {
      
      const pagosPendientes = await tx.pago.findMany({
        where: {
          familiaId: familiaId,
          estadoPago: { in: ["PENDIENTE", "MOROSO"] }
        },
        orderBy: [{ anioPeriodo: "asc" }, { mesPeriodo: "asc" }],
        take: cantidadMeses
      })

      if (pagosPendientes.length > 0) {
        const idsAActualizar = pagosPendientes.map(p => p.id)
        
        await tx.pago.updateMany({
          where: { id: { in: idsAActualizar } },
          data: {
            estadoPago: "PAGADO",
            tipoPago: miTipoPago as any, 
            registradoPorId: usuarioLogueado.id
          }
        })
      } else {
        const fechaActual = new Date()
        const mes = fechaActual.getMonth() + 1
        const anio = fechaActual.getFullYear()

        // Creamos un ID string plano único para la Primary Key de tu tabla pagos
        const nuevoId = `pago_${familiaId}_${mes}_${anio}`

        // 🔥 BYPASS RADICAL: SQL Nativo directo a PostgreSQL
        // Convertimos el string al tipo Enum real ("TipoPago" y "EstadoPago") usando cast de Postgres (::)
        await tx.$executeRaw`
          INSERT INTO public.pagos (
            id, "mesPeriodo", "anioPeriodo", monto, "tipoPago", "estadoPago", "familiaId", "registradoPorId"
          ) VALUES (
            ${nuevoId}, ${mes}, ${anio}, ${monto}, ${miTipoPago}::"TipoPago", 'PAGADO'::"EstadoPago", ${familiaId}, ${usuarioLogueado.id}
          )
          ON CONFLICT ("familiaId", "mesPeriodo", "anioPeriodo") 
          DO UPDATE SET 
            monto = ${monto},
            "tipoPago" = ${miTipoPago}::"TipoPago",
            "estadoPago" = 'PAGADO'::"EstadoPago",
            "registradoPorId" = ${usuarioLogueado.id};
        `
      }

      await tx.bitacoraAuditoria.create({
        data: {
          accion: "REGISTRAR_PAGO",
          entidad: "Pago",
          entidadId: familiaId,
          detalles: { cantidadMeses, montoTotal: monto, metodoPago, codigoFamilia: familia.codigoFamilia },
          usuarioId: usuarioLogueado.id,
        },
      })

      return { registrado: true }
    })

    return NextResponse.json({ data: resultado }, { status: 201 })

  } catch (error) {
    console.error("[POST /api/pagos]", error)
    return NextResponse.json({ error: "Error interno en el servidor" }, { status: 500 })
  }
}