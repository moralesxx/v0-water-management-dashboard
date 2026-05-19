"use client"

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
  XCircle,
  Eye,
  Edit,
  MessageSquare
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

export function IncidenciasView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [listaIncidencias, setListaIncidencias] = useState([
    { 
      id: "INC-001", 
      titulo: "Fuga detectada", // Mapeado visual
      sector: "Sector A", 
      reportadoPor: "Carlos Mendoza",
      fecha: "2026-05-19 08:30",
      prioridad: "alta",
      estado: "en_proceso",
      descripcion: "Se detectó fuga considerable en la tubería principal."
    },
  ])

  // 🟢 Nuevos estados alineados a tu Base de Datos
  const [nuevaDescripcion, setNuevaDescripcion] = useState("")
  const [nuevoSector, setNuevoSector] = useState("")
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
        return { icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-200", label: "Abierta" }
      case "en_proceso":
        return { icon: AlertTriangle, color: "bg-blue-500/10 text-blue-600 border-blue-200", label: "En Proceso" }
      case "resuelto":
      case "resuelta":
        return { icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", label: "Resuelta" }
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
          id: incidenciaGuardada.id.slice(-7).toUpperCase(),
          titulo: nuevoTipo,
          descripcion: nuevaDescripcion,
          sector: nuevoSector,
          reportadoPor: "Administrador", 
          fecha: fechaHoyStr,
          prioridad: nuevaUrgencia.toLowerCase(),
          estado: nuevoEstado.toLowerCase()
        },
        ...listaIncidencias
      ])

      setIsDialogOpen(false)
      setNuevaDescripcion("")
      setNuevoSector("")
      setNuevoTipo("FUGA")
      setNuevaUrgencia("MEDIA")
      setNuevoEstado("ABIERTA")

    } catch (error) {
      console.error(error)
      alert("Error de conexión con el servidor")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Incidencias</h1>
          <p className="text-muted-foreground">CU-06: Registro y seguimiento de incidencias del sistema</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Incidencia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCrearIncidencia}>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Incidencia</DialogTitle>
                <DialogDescription>
                  Reporta fallas directamente mapeadas a los Enums de la base de datos.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* 🟢 Select del TIPO real */}
                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Incidencia</Label>
                  <Select value={nuevoTipo} onValueChange={setNuevoTipo} required>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FUGA">FUGA</SelectItem>
                      <SelectItem value="PRESION_BAJA">PRESION_BAJA</SelectItem>
                      <SelectItem value="CONTAMINACION">CONTAMINACION</SelectItem>
                      <SelectItem value="AVERIA_BOMBA">AVERIA_BOMBA</SelectItem>
                      <SelectItem value="OTRO">OTRO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Select del SECTOR real */}
                <div className="grid gap-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select value={nuevoSector} onValueChange={setNuevoSector} required>
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sector A">Sector A</SelectItem>
                      <SelectItem value="Sector B">Sector B</SelectItem>
                      <SelectItem value="Sector C">Sector C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 🟢 Select de la URGENCIA real */}
                <div className="grid gap-2">
                  <Label htmlFor="urgencia">Urgencia</Label>
                  <Select value={nuevaUrgencia} onValueChange={setNuevaUrgencia} required>
                    <SelectTrigger id="urgencia">
                      <SelectValue placeholder="Nivel de Urgencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BAJA">BAJA</SelectItem>
                      <SelectItem value="MEDIA">MEDIA</SelectItem>
                      <SelectItem value="ALTA">ALTA</SelectItem>
                      <SelectItem value="CRITICA">CRITICA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 🟢 Select del ESTADO inicial real */}
                <div className="grid gap-2">
                  <Label htmlFor="estado">Estado Inicial</Label>
                  <Select value={nuevoEstado} onValueChange={setNuevoEstado} required>
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Estado inicial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ABIERTA">ABIERTA</SelectItem>
                      <SelectItem value="EN_PROCESO">EN_PROCESO</SelectItem>
                      <SelectItem value="RESUELTA">RESUELTA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción y Detalles</Label>
                  <Textarea 
                    id="descripcion" 
                    value={nuevaDescripcion} 
                    onChange={(e) => setNuevaDescripcion(e.target.value)} 
                    placeholder="Describe los detalles de la incidencia..." 
                    className="min-h-[80px]"
                    required 
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Reporte</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Las tarjetas y el mapa del final se quedan leyendo las variables reactivas calculadas automáticamente */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Incidencias</CardTitle>
              <CardDescription>Historial de incidencias reportadas</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar incidencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIncidencias.map((incidencia) => {
              const estadoInfo = getEstadoInfo(incidencia.estado)
              const prioridadInfo = getPrioridadInfo(incidencia.prioridad)
              const EstadoIcon = estadoInfo.icon

              return (
                <div 
                  key={incidencia.id}
                  className="p-4 rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-slate-100">{incidencia.id}</span>
                        <Badge className={`${prioridadInfo.color} border font-normal`} variant="secondary">
                          {prioridadInfo.label}
                        </Badge>
                        <Badge className={`${estadoInfo.color} border font-normal`} variant="secondary">
                          <EstadoIcon className="w-3 h-3 mr-1 inline" />
                          {estadoInfo.label}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground text-base">{incidencia.titulo}</h3>
                      <p className="text-sm text-muted-foreground mt-1.5">{incidencia.descripcion}</p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-3 text-xs text-muted-foreground font-normal">
                        <span>Sector: <strong className="text-slate-600 font-medium">{incidencia.sector}</strong></span>
                        <span>Reportado por: <strong className="text-slate-600 font-medium">{incidencia.reportadoPor}</strong></span>
                        <span>Fecha: {incidencia.fecha}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" /> Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="w-4 h-4" /> Editar Estado
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