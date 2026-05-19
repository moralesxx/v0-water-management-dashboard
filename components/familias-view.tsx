"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  Power,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

// IMPORTAMOS TUS 3 MODALES
import { NuevaFamiliaModal } from "./nueva-familia-modal"
import { DetallesFamiliaModal } from "./detalles-familia-modal"
import { EditarFamiliaModal } from "./editar-familia-modal"

export function FamiliasView() {
  // ESTADOS PARA DATOS REALES Y CONTROL DE CARGA
  const [familias, setFamilias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // ESTADOS DE FILTRADO Y PAGINACIÓN (Conectados al Backend)
  const [buscar, setBuscar] = useState("")
  const [pagina, setPagina] = useState(1)
  const [paginacionInfo, setPaginacionInfo] = useState({
    total: 0,
    totalPages: 1,
    limit: 50
  })

  // ESTADO DE ESTADÍSTICAS REALES
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    suspendidos: 0,
    pendientes: 0
  })
  
  // ESTADOS DE CONTROL PARA LOS MODALES
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false)
  const [familiaDetalleId, setFamiliaDetalleId] = useState<string | null>(null)
  const [familiaAEditar, setFamiliaAEditar] = useState<any | null>(null)

  // FUNCIÓN CONECTADA A TU API EN /api/familias
  const fetchFamilias = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        search: buscar,
        page: pagina.toString(),
        limit: "10" // Puedes cambiar el límite a tu gusto
      })

      const res = await fetch(`/api/familias?${queryParams.toString()}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? "Error al obtener familias")

      setFamilias(data.data ?? [])
      
      // Seteamos la paginación que devuelve tu API
      if (data.pagination) {
        setPaginacionInfo(data.pagination)
      }

      // Seteamos las estadísticas agregadas calculadas por Prisma
      if (data.stats) {
        setStats({
          total: data.stats.total ?? 0,
          activos: data.stats.activos ?? 0,
          suspendidos: data.stats.suspendidos ?? 0,
          // El residuo lo catalogamos preventivamente como pendientes
          pendientes: Math.max(0, data.stats.total - (data.stats.activos + data.stats.suspendidos))
        })
      }
    } catch (err: any) {
      toast.error(err.message ?? "No se pudieron sincronizar los datos de familias")
    } finally {
      setLoading(false)
    }
  }

  // Efecto que reacciona cada vez que cambia la página o el buscador (con Debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFamilias()
    }, 350) // Da un respiro al backend mientras escribes

    return () => clearTimeout(delayDebounceFn)
  }, [buscar, pagina])

  const getServicioInfo = (estadoServicio: string) => {
    switch (estadoServicio) {
      case "ACTIVO":
        return { icon: CheckCircle, color: "bg-success text-success-foreground", label: "Activo" }
      case "SUSPENDIDO":
        return { icon: XCircle, color: "bg-destructive text-destructive-foreground", label: "Suspendido" }
      case "PENDIENTE":
        return { icon: AlertCircle, color: "bg-warning text-warning-foreground", label: "Pendiente" }
      default:
        return { icon: AlertCircle, color: "bg-muted text-muted-foreground", label: estadoServicio ?? "Desconocido" }
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Familias y Servicio</h1>
          <p className="text-muted-foreground">CU-02: Gestión de familias beneficiarias y estado del servicio</p>
        </div>
        <Button className="gap-2" onClick={() => setModalCrearAbierto(true)}>
          <Plus className="w-4 h-4" />
          Nueva Familia
        </Button>
      </div>

      {/* Grid de Reportes Rápidos con los Stats de tu base de datos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Familias</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.activos}</p>
              <p className="text-sm text-muted-foreground">Servicio Activo</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.suspendidos}</p>
              <p className="text-sm text-muted-foreground">Suspendidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pendientes}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Familias</CardTitle>
              <CardDescription>Familias registradas en el sistema de agua</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar familia..."
                value={buscar}
                onChange={(e) => {
                  setBuscar(e.target.value)
                  setPagina(1) // Volver a la página 1 cuando se realiza una búsqueda
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Consultando registros reales en la Base de Datos...</p>
            </div>
          ) : familias.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic">
              No se encontraron familias registradas en el sistema.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Código</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Representante</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sector</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Dirección</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Último Pago</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Servicio</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familias.map((familia) => {
                      const servicioInfo = getServicioInfo(familia.estadoServicio)
                      const ServicioIcon = servicioInfo.icon
                      
                      // Extraer el último pago inyectado por tu consulta findMany
                      const ultimoPago = familia.pagos?.[0]

                      return (
                        <tr key={familia.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4 font-mono text-sm text-foreground">{familia.codigoFamilia}</td>
                          <td className="py-3 px-4 font-medium text-foreground">{familia.nombreRepresentante}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{familia.sector?.nombre ?? "Sin sector"}</Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">{familia.direccion}</td>
                          <td className="py-3 px-4 text-sm">
                            {ultimoPago ? (
                              <span className="font-medium text-foreground">
                                Q{ultimoPago.monto.toFixed(2)} ({ultimoPago.estadoPago})
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic text-xs">Sin registros</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`gap-1 ${servicioInfo.color}`}>
                              <ServicioIcon className="w-3 h-3" />
                              {servicioInfo.label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="gap-2" 
                                  onClick={() => setFamiliaDetalleId(familia.id)}
                                >
                                  <Eye className="w-4 h-4" /> Ver Detalles
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem 
                                  className="gap-2"
                                  onClick={() => setFamiliaAEditar({
                                    id: familia.id,
                                    nombreRepresentante: familia.nombreRepresentante,
                                    direccion: familia.direccion,
                                    telefono: familia.telefono,
                                    sectorId: familia.sectorId,
                                    sector: familia.sector
                                  })}
                                >
                                  <Edit className="w-4 h-4" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2">
                                  <Power className="w-4 h-4" /> 
                                  {familia.estadoServicio === "ACTIVO" ? "Suspender Servicio" : "Activar Servicio"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* BARRA DE PAGINACIÓN COMPATIBLE CON EL BACKEND */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Página <span className="font-medium">{paginacionInfo.page}</span> de{" "}
                  <span className="font-medium">{paginacionInfo.totalPages}</span> ({paginacionInfo.total} registros en total)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagina(p => Math.min(paginacionInfo.totalPages, p + 1))}
                    disabled={pagina === paginacionInfo.totalPages}
                  >
                    Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========================================== */}
      {/* ZONA DE MODALES REALES SINCRONIZADOS       */}
      {/* ========================================== */}

      {/* 1. Crear */}
      <NuevaFamiliaModal 
        open={modalCrearAbierto}
        onOpenChange={setModalCrearAbierto}
        onSuccess={fetchFamilias} // <-- Refresca la tabla al crear correctamente
      />

      {/* 2. Detalles */}
      <DetallesFamiliaModal 
        familiaId={familiaDetalleId}
        open={familiaDetalleId !== null}
        onOpenChange={(open) => { if (!open) setFamiliaDetalleId(null) }}
      />

      {/* 3. Editar */}
      <EditarFamiliaModal 
        familia={familiaAEditar}
        open={familiaAEditar !== null}
        onOpenChange={(open) => { if (!open) setFamiliaAEditar(null) }}
        onSuccess={fetchFamilias} // <-- Refresca la tabla al editar correctamente
      />
    </div>
  )
}