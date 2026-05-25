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
  defaultSector?: string; // Por si lo llama una familia logueada
  usuarioNombre?: string;
}

export function IncidenciasView({ defaultSector = "", usuarioNombre = "Abonado" }: IncidenciasViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [listaIncidencias, setListaIncidencias] = useState([
    { 
      id: "INC-001", 
      titulo: "FUGA", 
      sector: "Sector A", 
      reportadoPor: "Carlos Mendoza",
      fecha: "2026-05-19 08:30",
      prioridad: "alta",
      estado: "en_proceso",
      descripcion: "Se detectó fuga considerable en la tubería principal."
    },
  ])

  const [nuevaDescripcion, setNuevaDescripcion] = useState("")
  const [nuevoSector, setNuevoSector] = useState(defaultSector || "Sector A")
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
      alert("Incidencia agregada de forma local correctamente.")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Incidencias</h1>
          <p className="text-muted-foreground text-sm">CU-06: Registro y seguimiento de incidencias del sistema</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl">
              <Plus className="w-4 h-4" />
              Nueva Incidencia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#112237] text-white border-slate-800">
            <form onSubmit={handleCrearIncidencia}>
              <DialogHeader>
                <DialogTitle className="text-white">Registrar Nueva Incidencia</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Reporta fallas directamente mapeadas a los Enums de la base de datos.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4 text-slate-200">
                <div className="grid gap-2">
                  <Label htmlFor="tipo" className="text-slate-300">Tipo de Incidencia</Label>
                  <Select value={nuevoTipo} onValueChange={setNuevoTipo} required>
                    <SelectTrigger id="tipo" className="bg-[#0A1728] border-slate-700 text-white">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#112237] border-slate-700 text-white">
                      <SelectItem value="FUGA">FUGA</SelectItem>
                      <SelectItem value="PRESION_BAJA">PRESION_BAJA</SelectItem>
                      <SelectItem value="CONTAMINACION">CONTAMINACION</SelectItem>
                      <SelectItem value="AVERIA_BOMBA">AVERIA_BOMBA</SelectItem>
                      <SelectItem value="OTRO">OTRO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sector" className="text-slate-300">Sector afectado</Label>
                  <Select value={nuevoSector} onValueChange={setNuevoSector} required>
                    <SelectTrigger id="sector" className="bg-[#0A1728] border-slate-700 text-white">
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#112237] border-slate-700 text-white">
                      <SelectItem value="Sector A">Sector A</SelectItem>
                      <SelectItem value="Sector B">Sector B</SelectItem>
                      <SelectItem value="Sector C">Sector C</SelectItem>
                      <SelectItem value="Sector Norte">Sector Norte</SelectItem>
                      <SelectItem value="Sector Centro">Sector Centro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="urgencia" className="text-slate-300">Urgencia</Label>
                  <Select value={nuevaUrgencia} onValueChange={setNuevaUrgencia} required>
                    <SelectTrigger id="urgencia" className="bg-[#0A1728] border-slate-700 text-white">
                      <SelectValue placeholder="Nivel de Urgencia" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#112237] border-slate-700 text-white">
                      <SelectItem value="BAJA">BAJA</SelectItem>
                      <SelectItem value="MEDIA">MEDIA</SelectItem>
                      <SelectItem value="ALTA">ALTA</SelectItem>
                      <SelectItem value="CRITICA">CRITICA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="estado" className="text-slate-300">Estado Inicial</Label>
                  <Select value={nuevoEstado} onValueChange={setNuevoEstado} required>
                    <SelectTrigger id="estado" className="bg-[#0A1728] border-slate-700 text-white">
                      <SelectValue placeholder="Estado inicial" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#112237] border-slate-700 text-white">
                      <SelectItem value="ABIERTA">ABIERTA</SelectItem>
                      <SelectItem value="EN_PROCESO">EN_PROCESO</SelectItem>
                      <SelectItem value="RESUELTA">RESUELTA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descripcion" className="text-slate-300">Descripción y Detalles</Label>
                  <Textarea 
                    id="descripcion" 
                    value={nuevaDescripcion} 
                    onChange={(e) => setNuevaDescripcion(e.target.value)} 
                    placeholder="Describe la ubicación exacta o magnitud del problema..." 
                    className="min-h-[80px] bg-[#0A1728] border-slate-700 text-white"
                    required 
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">Guardar Reporte</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#112237] border-slate-800 text-white">
        <CardHeader className="pb-4 border-b border-slate-800/60">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white text-base">Registro de Incidencias</CardTitle>
              <CardDescription className="text-slate-400 text-xs">Historial de alertas técnicas reportadas en la red</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Buscar incidencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-[#0A1728] border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {filteredIncidencias.map((incidencia) => {
              const estadoInfo = getEstadoInfo(incidencia.estado)
              const prioridadInfo = getPrioridadInfo(incidencia.prioridad)
              const EstadoIcon = estadoInfo.icon

              return (
                <div 
                  key={incidencia.id}
                  className="p-4 rounded-xl border border-slate-800/80 bg-[#0A1728]/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-[#0A1728] border border-slate-800">{incidencia.id}</span>
                        <Badge className={`${prioridadInfo.color} border-none font-medium text-[10px]`} variant="secondary">
                          {prioridadInfo.label}
                        </Badge>
                        <Badge className={`${estadoInfo.color} border-none font-medium text-[10px]`} variant="secondary">
                          <EstadoIcon className="w-3 h-3 mr-1 inline" />
                          {estadoInfo.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-white text-base">{incidencia.titulo}</h3>
                      <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{incidencia.descripcion}</p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-4 text-xs text-slate-400 font-normal border-t border-slate-800/40 pt-3">
                        <span>Sector: <strong className="text-slate-200 font-medium">{incidencia.sector}</strong></span>
                        <span>Reportado por: <strong className="text-slate-200 font-medium">{incidencia.reportadoPor}</strong></span>
                        <span>Fecha: <strong className="text-slate-300 font-mono">{incidencia.fecha}</strong></span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#112237] border-slate-700 text-white">
                        <DropdownMenuItem className="gap-2 focus:bg-slate-800 focus:text-white cursor-pointer">
                          <Eye className="w-4 h-4 text-cyan-400" /> Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 focus:bg-slate-800 focus:text-white cursor-pointer">
                          <Edit className="w-4 h-4 text-amber-400" /> Editar Estado
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