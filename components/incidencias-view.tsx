// components/incidencias-view.tsx
"use client";

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface IncidenciasViewProps {
  defaultSector?: string;
  usuarioNombre?: string;
}

export function IncidenciasView({ defaultSector = "", usuarioNombre = "Administrador" }: IncidenciasViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [listaIncidencias, setListaIncidencias] = useState([
    { 
      id: "INC-001", 
      titulo: "FUGA DETECTADA", 
      sector: "Sector Centro", 
      reportadoPor: "Carlos Mendoza",
      fecha: "2026-05-26 08:30",
      prioridad: "alta",
      estado: "en_proceso",
      descripcion: "Se detectó fuga considerable en la tubería principal de distribución."
    },
  ])

  const [nuevaDescripcion, setNuevaDescripcion] = useState("")
  const [nuevoSector, setNuevoSector] = useState(defaultSector || "Sector Centro")
  const [nuevoTipo, setNuevoTipo] = useState("FUGA")
  const [nuevaUrgencia, setNuevaUrgencia] = useState("MEDIA")
  const [nuevoEstado, setNuevoEstado] = useState("ABIERTA")

  const filteredIncidencias = listaIncidencias.filter(i => 
    i.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.sector.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEstadoInfo = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
      case "abierta":
        return { icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-200/60", label: "Abierta" }
      case "en_proceso":
        return { icon: AlertTriangle, color: "bg-blue-500/10 text-blue-600 border-blue-200/60", label: "En Proceso" }
      case "resuelto":
      case "resuelta":
        return { icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600 border-emerald-200/60", label: "Resuelta" }
      default:
        return { icon: Clock, color: "bg-slate-100 text-slate-600 border-slate-200", label: estado }
    }
  }

  const getPrioridadInfo = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
      case "alta":
      case "critica":
        return { color: "bg-rose-500/10 text-rose-600 border-rose-200", label: prioridad.toUpperCase() }
      case "media":
        return { color: "bg-amber-500/10 text-amber-600 border-amber-200", label: "MEDIA" }
      case "baja":
        return { color: "bg-slate-100 text-slate-600 border-slate-200", label: "BAJA" }
      default:
        return { color: "bg-slate-100 text-slate-600 border-slate-200", label: prioridad }
    }
  }

  const handleCrearIncidencia = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoSector) return

    try {
      const respuesta = await fetch("/api/incidencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: nuevaDescripcion,
          sectorNombre: nuevoSector,
          tipo: nuevoTipo,
          urgencia: nuevaUrgencia,
          estado: nuevoEstado
        })
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json()
        alert(errorData.error || "Error al registrar la incidencia")
        return
      }

      const { data: incidenciaGuardada } = await respuesta.json()
      const fechaHoyStr = new Date().toISOString().replace('T', ' ').slice(0, 16)

      setListaIncidencias([
        {
          id: incidenciaGuardada?.id ? incidenciaGuardada.id.slice(-7).toUpperCase() : "INC-" + Math.floor(Math.random() * 900 + 100),
          titulo: nuevoTipo,
          descripcion: nuevaDescripcion,
          sector: nuevoSector,
          reportadoPor: usuarioNombre, 
          fecha: fechaHoyStr,
          prioridad: nuevaUrgencia.toLowerCase(),
          estado: nuevoEstado.toLowerCase()
        },
        ...listaIncidencias
      ])

      setIsDialogOpen(false)
      setNuevaDescripcion("")
      setNuevoTipo("FUGA")
      setNuevaUrgencia("MEDIA")
      setNuevoEstado("ABIERTA")

    } catch (error) {
      console.error(error)
      // Respaldo local reactivo por si la API aún no está arriba
      const fechaHoyStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
      setListaIncidencias([
        {
          id: "INC-" + Math.floor(Math.random() * 900 + 100),
          titulo: nuevoTipo,
          descripcion: nuevaDescripcion,
          sector: nuevoSector,
          reportadoPor: usuarioNombre,
          fecha: fechaHoyStr,
          prioridad: nuevaUrgencia.toLowerCase(),
          estado: nuevoEstado.toLowerCase()
        },
        ...listaIncidencias
      ])
      setIsDialogOpen(false)
      setNuevaDescripcion("")
    }
  }

  return (
    // 🟢 Fondo gris blanquecino suave alineado a las demás vistas administrativas
    <div className="p-6 space-y-6 bg-background min-h-screen text-foreground font-sans antialiased">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Incidencias</h1>
          <p className="text-muted-foreground text-sm">CU-06: Registro y seguimiento de incidencias del sistema</p>
        </div>

        {/* 🟢 MODAL INSTITUCIONAL CLARO Y NITIDO COMO EL CU-05 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl shadow-2xs transition-colors">
              <Plus className="w-4 h-4" />
              Nueva Incidencia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border rounded-2xl shadow-lg">
            <form onSubmit={handleCrearIncidencia}>
              <DialogHeader>
                <DialogTitle className="text-slate-900 font-bold">Registrar Nueva Incidencia</DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  Reporta fallas operativas mapeadas de forma directa a la red.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-sm">
                <div className="grid gap-2">
                  <Label htmlFor="tipo" className="font-medium text-slate-700">Tipo de Incidencia</Label>
                  <Select value={nuevoTipo} onValueChange={setNuevoTipo} required>
                    <SelectTrigger id="tipo" className="bg-background border-border text-foreground rounded-lg">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="FUGA">FUGA</SelectItem>
                      <SelectItem value="PRESION_BAJA">PRESION_BAJA</SelectItem>
                      <SelectItem value="CONTAMINACION">CONTAMINACION</SelectItem>
                      <SelectItem value="AVERIA_BOMBA">AVERIA_BOMBA</SelectItem>
                      <SelectItem value="OTRO">OTRO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sector" className="font-medium text-slate-700">Sector afectado</Label>
                  <Select value={nuevoSector} onValueChange={setNuevoSector} required>
                    <SelectTrigger id="sector" className="bg-background border-border text-foreground rounded-lg">
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="Sector A">Sector A</SelectItem>
                      <SelectItem value="Sector B">Sector B</SelectItem>
                      <SelectItem value="Sector C">Sector C</SelectItem>
                      <SelectItem value="Sector Norte">Sector Norte</SelectItem>
                      <SelectItem value="Sector Centro">Sector Centro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                    <div className="grid gap-2">
                      <Label htmlFor="urgencia" className="font-medium text-slate-700">Urgencia</Label>
                      <Select 
                        value={nuevaUrgencia} 
                        onValueChange={setNuevaUrgencia} // 🟢 CORREGIDO: Debe ser setNuevaUrgencia
                        required
                      >
                        <SelectTrigger id="urgencia" className="bg-background border-border text-foreground rounded-lg">
                          <SelectValue placeholder="Nivel de Urgencia" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border text-foreground">
                          <SelectItem value="BAJA">BAJA</SelectItem>
                          <SelectItem value="MEDIA">MEDIA</SelectItem>
                          <SelectItem value="ALTA">ALTA</SelectItem>
                          <SelectItem value="CRITICA">CRITICA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                <div className="grid gap-2">
                  <Label htmlFor="estado" className="font-medium text-slate-700">Estado Inicial</Label>
                  <Select value={nuevoEstado} onValueChange={setNuevoEstado} required>
                    <SelectTrigger id="estado" className="bg-background border-border text-foreground rounded-lg">
                      <SelectValue placeholder="Estado inicial" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-foreground">
                      <SelectItem value="ABIERTA">ABIERTA</SelectItem>
                      <SelectItem value="EN_PROCESO">EN_PROCESO</SelectItem>
                      <SelectItem value="RESUELTA">RESUELTA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descripcion" className="font-medium text-slate-700">Descripción y Detalles</Label>
                  <Textarea 
                    id="descripcion" 
                    value={nuevaDescripcion} 
                    onChange={(e) => setNuevaDescripcion(e.target.value)} 
                    placeholder="Describe los detalles de la incidencia..." 
                    className="min-h-[80px] bg-background border-border text-foreground rounded-lg placeholder:text-muted-foreground focus-visible:ring-primary/50"
                    required 
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-slate-700 hover:bg-slate-50 rounded-lg">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Guardar Reporte</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🟢 CARD PRINCIPAL BLANCA CON FILAS CONTRAPUESTAS EN GRIS SUAVE */}
      <Card className="bg-card border-border shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-slate-900 text-base font-semibold">Registro de Incidencias</CardTitle>
              <CardDescription className="text-xs">Historial de alertas técnicas reportadas en la red</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar incidencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground rounded-xl focus:border-primary text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="space-y-3">
            {filteredIncidencias.map((incidencia) => {
              const estadoInfo = getEstadoInfo(incidencia.estado)
              const prioridadInfo = getPrioridadInfo(incidencia.prioridad)
              const EstadoIcon = estadoInfo.icon

              return (
                <div 
                  key={incidencia.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded bg-white border border-border shadow-3xs">
                          {incidencia.id}
                        </span>
                        <Badge className={`${prioridadInfo.color} border-none font-medium text-[10px]`} variant="secondary">
                          {prioridadInfo.label}
                        </Badge>
                        <Badge className={`${estadoInfo.color} border-none font-medium text-[10px]`} variant="secondary">
                          <EstadoIcon className="w-3 h-3 mr-1 inline" />
                          {estadoInfo.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-base">{incidencia.titulo}</h3>
                      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{incidencia.descripcion}</p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-4 text-xs text-muted-foreground font-normal border-t border-border/60 pt-3">
                        <span>Sector: <strong className="text-slate-700 font-medium">{incidencia.sector}</strong></span>
                        <span>Reportado por: <strong className="text-slate-700 font-medium">{incidencia.reportadoPor}</strong></span>
                        <span>Fecha: <strong className="text-slate-600 font-mono font-normal">{incidencia.fecha}</strong></span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                        <DropdownMenuItem className="gap-2 hover:bg-slate-50 cursor-pointer text-sm">
                          <Eye className="w-4 h-4 text-cyan-600" /> Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 hover:bg-slate-50 cursor-pointer text-sm">
                          <Edit className="w-4 h-4 text-amber-500" /> Editar Estado
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}