"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  CreditCard, 
  Search,
  Filter,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"

// IMPORTAMOS EL MODAL DE REGISTRO
import { RegistrarPagoModal } from "@/components/registrar-pago-modal"

export function PaymentsView() {
  // ESTADOS DE CONTROL DE DATOS REALES
  const [morosos, setMorosos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [buscar, setBuscar] = useState("")
  const [pagina, setPagina] = useState(1)
  const [paginacionInfo, setPaginacionInfo] = useState({
    total: 0,
    totalPages: 1,
    limit: 10
  })
  // Asume que "search" es la variable o estado donde guardas el texto del buscador de la tabla
const handleExportar = () => {
  const querySearch = buscar ? `&search=${encodeURIComponent(search)}` : "";
  
  // Redirige nativamente al navegador para iniciar la descarga del archivo CSV
  window.location.href = `/api/pagos/morosidad?export=true${querySearch}`;
};

  // ESTADO PARA LA SELECCIÓN DEL MODAL DE COBRO
  const [familiaAPagar, setFamiliaAPagar] = useState<any | null>(null)

  // OBTENER MOROSOS DESDE LA BD REAL
  const fetchMorosos = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        search: buscar,
        page: pagina.toString(),
        limit: "10"
      })

      // Apuntamos al endpoint que calcula los saldos pendientes
      const res = await fetch(`/api/pagos/morosidad?${queryParams.toString()}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? "Error al obtener morosidad")

      setMorosos(data.data ?? [])
      if (data.pagination) {
        setPaginacionInfo(data.pagination)
      }
    } catch (err: any) {
      toast.error(err.message ?? "No se pudo sincronizar la lista de pagos")
    } finally {
      setLoading(false)
    }
  }

  // Hook de escucha para búsqueda y paginación
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMorosos()
    }, 350)

    return () => clearTimeout(delayDebounceFn)
  }, [buscar, pagina])

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Pagos y Morosidad</h1>
        <p className="text-muted-foreground mt-1">
          Gestión de pagos y control de familias en mora (CU-05)
        </p>
      </header>

      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
              <CreditCard className="w-5 h-5 text-primary" />
              Familias con Saldo Pendiente
            </CardTitle>
            
            {/* Barra de Herramientas Operacionales */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar moroso..."
                  value={buscar}
                  onChange={(e) => {
                    setBuscar(e.target.value)
                    setPagina(1)
                  }}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Filter className="w-3.5 h-3.5" />
                Filtrar
              </Button>
              <Button 
  variant="outline" 
  size="sm" 
  className="h-8 gap-1.5 text-xs"
  onClick={handleExportar} // 🟢 Conexión con la descarga
>
  <Download className="w-3.5 h-3.5" />
  Exportar
</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Buscando cuentas pendientes...</p>
            </div>
          ) : morosos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic text-sm">
              🎉 ¡Excelente! No hay familias con saldos pendientes de pago.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Código</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nombre del Representante</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sector</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Meses en Mora</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Saldo Pendiente</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {morosos.map((row) => (
                      <tr 
                        key={row.id}
                        className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-foreground">{row.codigoFamilia ?? row.code}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-foreground">{row.nombreRepresentante ?? row.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {row.sector?.nombre ?? row.sector}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline" 
                            className={
                              row.months >= 3 
                                ? "bg-destructive/10 text-destructive border-destructive/20" 
                                : row.months >= 2 
                                  ? "bg-warning/10 text-warning-foreground border-warning/20"
                                  : "bg-muted text-muted-foreground"
                            }
                          >
                            {row.months} {row.months === 1 ? 'mes' : 'meses'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-semibold text-foreground">
                            Q{(row.balance ?? 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button 
                            size="sm" 
                            className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => setFamiliaAPagar({
                              id: row.id,
                              codigoFamilia: row.codigoFamilia ?? row.code,
                              nombreRepresentante: row.nombreRepresentante ?? row.name,
                              balance: row.balance,
                              months: row.months
                            })}
                          >
                            Registrar Pago
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Navegación por páginas */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Página <span className="font-medium">{paginacionInfo.page}</span> de{" "}
                  <span className="font-medium">{paginacionInfo.totalPages}</span> ({paginacionInfo.total} familias acumuladas)
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

      {/* INYECCIÓN DEL MODAL OPERACIONAL */}
      <RegistrarPagoModal 
        familia={familiaAPagar}
        open={familiaAPagar !== null}
        onOpenChange={(open) => { if (!open) setFamiliaAPagar(null) }}
        onSuccess={fetchMorosos} // Re-consulta la BD para remover o actualizar la fila cobrada
      />
    </div>
  )
}