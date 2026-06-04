"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  CreditCard, Search, Download, Loader2,
  ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Users
} from "lucide-react"
import { toast } from "sonner"
import { RegistrarPagoModal } from "@/components/registrar-pago-modal"

type FiltroEstado = "TODOS" | "MOROSO" | "AL_DIA"

export function PaymentsView() {
  const [familias, setFamilias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [buscar, setBuscar] = useState("")
  const [pagina, setPagina] = useState(1)
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("TODOS")
  const [paginacionInfo, setPaginacionInfo] = useState({ total: 0, totalPages: 1, limit: 10 })
  const [resumen, setResumen] = useState({ totalFamilias: 0, morosas: 0, alDia: 0, deudaTotal: 0 })
  const [familiaAPagar, setFamiliaAPagar] = useState<any | null>(null)

  const fetchFamilias = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        search: buscar,
        page: pagina.toString(),
        limit: "10",
        estado: filtroEstado,
      })
      const res = await fetch(`/api/familias/pagos?${queryParams.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al obtener familias")
      setFamilias(data.data ?? [])
      if (data.pagination) setPaginacionInfo(data.pagination)
      if (data.resumen) setResumen(data.resumen)
    } catch (err: any) {
      toast.error(err.message ?? "No se pudo sincronizar la lista de pagos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => fetchFamilias(), 350)
    return () => clearTimeout(delay)
  }, [buscar, pagina, filtroEstado])

  const handleExportar = () => {
    const querySearch = buscar ? `&search=${encodeURIComponent(buscar)}` : ""
    window.location.href = `/api/pagos/morosidad?export=true${querySearch}`
  }

  const filtros: { label: string; value: FiltroEstado; color: string }[] = [
    { label: "Todas", value: "TODOS", color: "default" },
    { label: "Al día", value: "AL_DIA", color: "success" },
    { label: "En mora", value: "MOROSO", color: "destructive" },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Pagos y Morosidad</h1>
        <p className="text-muted-foreground mt-1">Gestión de pagos y control de familias (CU-05)</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resumen.totalFamilias}</p>
              <p className="text-sm text-muted-foreground">Total Familias</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resumen.alDia}</p>
              <p className="text-sm text-muted-foreground">Al Día</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resumen.morosas}</p>
              <p className="text-sm text-muted-foreground">En Mora · Q{resumen.deudaTotal.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <CreditCard className="w-5 h-5 text-primary" />
              Registro de Familias
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Filtros de estado */}
              <div className="flex gap-1">
                {filtros.map(f => (
                  <Button
                    key={f.value}
                    size="sm"
                    variant={filtroEstado === f.value ? "default" : "outline"}
                    className="h-8 text-xs"
                    onClick={() => { setFiltroEstado(f.value); setPagina(1) }}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
              <div className="relative w-48 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar familia..."
                  value={buscar}
                  onChange={(e) => { setBuscar(e.target.value); setPagina(1) }}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleExportar}>
                <Download className="w-3.5 h-3.5" /> Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Cargando familias...</p>
            </div>
          ) : familias.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic text-sm">
              No se encontraron familias con los filtros seleccionados.
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Último Pago</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Saldo</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familias.map((row) => (
                      <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm">{row.codigoFamilia}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium">{row.nombreRepresentante}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">{row.sector?.nombre ?? "—"}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          {row.esMoroso ? (
                            <Badge variant="outline" className={`text-xs ${row.mesesEnMora >= 3 ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-amber-500/10 text-amber-600 border-amber-200"}`}>
                              {row.mesesEnMora} {row.mesesEnMora === 1 ? "mes" : "meses"} en mora
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-200">
                              Al día
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {row.ultimoPago ?? "Sin pagos"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`text-sm font-semibold ${row.esMoroso ? "text-destructive" : "text-emerald-600"}`}>
                            {row.esMoroso ? `Q${row.balance.toFixed(2)}` : "Q0.00"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            size="sm"
                            variant={row.esMoroso ? "default" : "outline"}
                            className="text-xs"
                            onClick={() => setFamiliaAPagar({
                              id: row.id,
                              codigoFamilia: row.codigoFamilia,
                              nombreRepresentante: row.nombreRepresentante,
                              balance: row.balance,
                              months: row.mesesEnMora || 1,
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

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Página <span className="font-medium">{pagina}</span> de{" "}
                  <span className="font-medium">{paginacionInfo.totalPages}</span> ({paginacionInfo.total} familias)
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPagina(p => Math.min(paginacionInfo.totalPages, p + 1))} disabled={pagina === paginacionInfo.totalPages}>
                    Siguiente <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <RegistrarPagoModal
        familia={familiaAPagar}
        open={familiaAPagar !== null}
        onOpenChange={(open) => { if (!open) setFamiliaAPagar(null) }}
        onSuccess={fetchFamilias}
      />
    </div>
  )
}