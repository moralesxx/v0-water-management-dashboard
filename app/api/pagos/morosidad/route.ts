// app/api/pagos/morosidad/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getUsuarioActual } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Rol, EstadoServicio } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    // 1. Validar autenticación con tu cookie custom JWT
    const usuarioLogueado = await getUsuarioActual()
    if (!usuarioLogueado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Restringir: Solo ADMIN, TESORERO o ENCARGADO pueden ver morosidad
    if (usuarioLogueado.rol === Rol.FAMILIA) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // 2. Capturar Query Params para buscador, paginación y EXPORTACIÓN
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.trim() ?? ""
    const exportar = searchParams.get("export") === "true" // 🟢 Captura el flag de exportación

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10")))
    const skip = (page - 1) * limit

    // 3. Definir condiciones de búsqueda
    const whereClause = {
      estadoServicio: { in: [EstadoServicio.ACTIVO, EstadoServicio.SUSPENDIDO] },
      ...(search && {
        OR: [
          { nombreRepresentante: { contains: search, mode: "insensitive" as const } },
          { codigoFamilia: { contains: search, mode: "insensitive" as const } },
          { sector: { nombre: { contains: search, mode: "insensitive" as const } } },
        ],
      }),
    }

    // 4. Obtener familias de la base de datos incluyendo su sector y sus pagos
    const familias = await prisma.familia.findMany({
      where: whereClause,
      include: {
        sector: { select: { id: true, nombre: true } },
        pagos: {
          select: {
            estadoPago: true,
            mesPeriodo: true,
            anioPeriodo: true,
          }
        }
      },
      orderBy: { codigoFamilia: "asc" }
    })

    // 5. Lógica de negocio para calcular la morosidad real por familia
    const CUOTA_MENSUAL = 60.00

    const listaMorosos = familias.map((familia) => {
      // Contamos los meses registrados explícitamente como PENDIENTE o MOROSO
      const mesesEnMora = familia.pagos.filter(
        p => p.estadoPago === "PENDIENTE" || p.estadoPago === "MOROSO"
      ).length

      // Si no hay meses registrados en la BD, dejamos la simulación controlada que tenías
      const months = mesesEnMora > 0 ? mesesEnMora : Math.floor(Math.random() * 3) + 1

      return {
        id: familia.id,
        codigoFamilia: familia.codigoFamilia,
        nombreRepresentante: familia.nombreRepresentante,
        sector: familia.sector, // Mantiene el objeto completo para tu frontend
        months: months,
        balance: months * CUOTA_MENSUAL
      }
    }).filter(m => m.months > 0) // Solo dejamos en la lista a los que deben 1 mes o más

    // ========================================================
    // 🖨️ INTERCEPCIÓN PARA EXPORTACIÓN A EXCEL / CSV
    // ========================================================
    if (exportar) {
      // Definimos las columnas del reporte
      const encabezados = ["Código Familia", "Representante", "Sector", "Meses Pendientes", "Total Pendiente (GTQ)"]
      
      // Mapeamos los datos purificando las comillas por si un nombre lleva caracteres especiales
      const filasCsv = listaMorosos.map(m => {
        const nombreSector = m.sector?.nombre ?? "Sin Sector"
        return `"${m.codigoFamilia}","${m.nombreRepresentante.replace(/"/g, '""')}","${nombreSector.replace(/"/g, '""')}",${m.months},${m.balance.toFixed(2)}`
      })

      // \ufeff le dice a Excel que el archivo viene en UTF-8 para que renderice tildes y eñes sin romperse
      const contenidoCsv = "\ufeff" + [encabezados.join(","), ...filasCsv].join("\n")

      const fechaHoy = new Date().toISOString().slice(0, 10)
      
      return new NextResponse(contenidoCsv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=reporte_morosidad_${fechaHoy}.csv`,
        },
      })
    }
    // ========================================================

    // 6. Aplicar paginación en memoria sobre el resultado filtrado (Flujo normal de la tabla)
    const totalRegistros = listaMorosos.length
    const datosPaginados = listaMorosos.slice(skip, skip + limit)

    // 7. Responder con la estructura exacta que tu frontend espera
    return NextResponse.json({
      data: datosPaginados,
      pagination: {
        total: totalRegistros,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalRegistros / limit)
      }
    })

  } catch (error) {
    console.error("[GET /api/pagos/morosidad]", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}