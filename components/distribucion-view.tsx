"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus, 
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Circle,
  Play,
  Edit,
  Trash2,
  MoreHorizontal
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

const programacionSemanal = [
  { dia: "Lunes", sectores: ["Sector A", "Sector C"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Martes", sectores: ["Sector B"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Miércoles", sectores: ["Sector A"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Jueves", sectores: ["Sector C", "Sector B"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Viernes", sectores: ["Sector B"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Sábado", sectores: ["Todos"], horarioGeneral: "06:00 - 12:00" },
  { dia: "Domingo", sectores: ["Mantenimiento"], horarioGeneral: "---" },
]

export function DistribucionView() {
  const [selectedDay, setSelectedDay] = useState("Lunes")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [turnos, setTurnos] = useState([
    { id: "1", sector: "Sector A", horario: "06:00 - 10:00", estado: "completado", familias: 62 },
    { id: "2", sector: "Sector C", horario: "10:00 - 14:00", estado: "en_curso", familias: 45 },
    { id: "3", sector: "Sector B", horario: "14:00 - 18:00", estado: "pendiente", familias: 58 },
  ])

  // Estados de control
  const [nuevoSector, setNuevoSector] = useState("")
  const [nuevaHoraInicio, setNuevaHoraInicio] = useState("08:00")
  const [nuevaDuracionHoras, setNuevaDuracionHoras] = useState("4") 
  const [cantidadFamiliasInput, setCantidadFamiliasInput] = useState("50") 

  const fechaActual = new Date()
  const opcionesFecha: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opcionesFecha)

  const completadosHoy = turnos.filter(t => t.estado === "completado").length
  const enCursoHoy = turnos.filter(t => t.estado === "en_curso").length
  const pendientesHoy = turnos.filter(t => t.estado === "pendiente").length
  const totalFamiliasHoy = turnos.reduce((acc, t) => acc + t.familias, 0)

  const getEstadoInfo = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "completado":
      case "finalizado":
        return { icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", label: "Completado" }
      case "en_curso":
      case "activo":
        return { icon: Play, color: "bg-blue-500/10 text-blue-600 border-blue-200", label: "En Curso" }
      case "pendiente":
      case "programado":
        return { icon: Circle, color: "bg-slate-100 text-slate-600 border-slate-200", label: "Pendiente" }
      default:
        return { icon: Circle, color: "bg-slate-100 text-slate-600 border-slate-200", label: estado }
    }
  }

  // 🟢 1. ACCIÓN: CREAR TURNO
  const handleCrearTurno = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoSector) return

    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const diaActualStr = diasSemana[new Date().getDay()]
    const minutosDuracion = (parseInt(nuevaDuracionHoras) || 1) * 60

    try {
      const respuesta = await fetch("/api/distribucion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectorNombre: nuevoSector,
          dia: diaActualStr,
          horaInicio: nuevaHoraInicio,
          duracionMin: minutosDuracion
        })
      })

      if (!respuesta.ok) {
        const errorData = await respuesta.json()
        alert(errorData.error || "Error al guardar el turno")
        return
      }

      const { data: turnoGuardado } = await respuesta.json()

      const [horas, minutos] = nuevaHoraInicio.split(":").map(Number)
      const fin = new Date()
      fin.setHours(horas + (parseInt(nuevaDuracionHoras) || 0), minutos)
      const horaFinStr = fin.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', hour12: false })
      const rangoHorarioVisual = `${nuevaHoraInicio} - ${horaFinStr}`

      setTurnos([...turnos, {
        id: turnoGuardado.id,
        sector: nuevoSector,
        horario: rangoHorarioVisual,
        estado: "pendiente", 
        familias: parseInt(cantidadFamiliasInput) || 0
      }])

      setIsDialogOpen(false)
      setNuevoSector("")
      setNuevaHoraInicio("08:00")
      setNuevaDuracionHoras("4")
      setCantidadFamiliasInput("50")

    } catch (error) {
      console.error("Error en la petición:", error)
      alert("No se pudo conectar con el servidor para guardar el turno")
    }
  }

  // 🟢 2. ACCIÓN: CANCELAR/ELIMINAR TURNO (Independiente y al alcance global)
  const handleCancelarTurno = async (id: string | number) => {
    if (typeof id === 'number' || id.toString().length < 5) {
      setTurnos(turnos.filter(t => t.id !== id))
      return
    }

    if (!confirm("¿Estás seguro de que deseas cancelar y eliminar este turno de distribución?")) return

    try {
      const respuesta = await fetch(`/api/distribucion/${id}`, {
        method: "DELETE"
      })

      if (respuesta.ok) {
        setTurnos(turnos.filter(t => t.id !== id))
      } else {
        alert("No se pudo cancelar el turno en el servidor")
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
      alert("Error de conexión")
    }
  }

  // 🟢 3. ACCIÓN: EDITAR TURNO (Independiente y al alcance global)
  const handleEditarTurno = async (id: string | number, horaActual: string) => {
    if (typeof id === 'number' || id.toString().length < 5) {
      alert("Los turnos de prueba estáticos no se pueden editar en la base de datos.")
      return
    }

    const nuevaHora = prompt("Modificar hora de apertura (HH:MM):", horaActual)
    if (!nuevaHora || nuevaHora === horaActual) return

    try {
      const respuesta = await fetch(`/api/distribucion/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horaInicio: nuevaHora })
      })

      if (respuesta.ok) {
        setTurnos(turnos.map(t => {
          if (t.id === id) {
            const [, m] = t.horario.split(" - ")
            return { ...t, horario: `${nuevaHora} - ${m}` }
          }
          return t
        }))
      } else {
        alert("Error al actualizar el horario")
      }
    } catch (error) {
      console.error("Error al editar:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Distribución del Agua</h1>
          <p className="text-muted-foreground">CU-04: Programación y control de turnos de distribución</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Turno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCrearTurno}>
              <DialogHeader>
                <DialogTitle>Programar Nuevo Turno</DialogTitle>
                <DialogDescription>
                  Asigna un sector y horario para la apertura de válvulas hoy.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="sector">Sector Beneficiado</Label>
                  <Select value={nuevoSector} onValueChange={setNuevoSector} required>
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Selecciona un sector real" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sector A">Sector A (Zona Norte)</SelectItem>
                      <SelectItem value="Sector B">Sector B (Zona Sur)</SelectItem>
                      <SelectItem value="Sector C">Sector C (Zona Central)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="horaInicio">Hora de Apertura (Inicio)</Label>
                  <Input 
                    id="horaInicio" 
                    type="time"
                    value={nuevaHoraInicio} 
                    onChange={(e) => setNuevaHoraInicio(e.target.value)} 
                    required 
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duracion">Duración del Suministro</Label>
                  <Select value={nuevaDuracionHoras} onValueChange={setNuevaDuracionHoras} required>
                    <SelectTrigger id="duracion">
                      <SelectValue placeholder="Selecciona la duración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Horas</SelectItem>
                      <SelectItem value="4">4 Horas</SelectItem>
                      <SelectItem value="6">6 Horas</SelectItem>
                      <SelectItem value="12">12 Horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="familias">Familias Estimadas</Label>
                  <Input 
                    id="familias" 
                    type="number"
                    value={cantidadFamiliasInput} 
                    onChange={(e) => setCantidadFamiliasInput(e.target.value)} 
                    placeholder="Cantidad de conexiones" 
                    required 
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Turno</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completadosHoy}</p>
              <p className="text-sm text-muted-foreground">Completados Hoy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{enCursoHoy}</p>
              <p className="text-sm text-muted-foreground">En Curso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendientesHoy}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalFamiliasHoy}</p>
              <p className="text-sm text-muted-foreground">Familias Hoy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Turnos de Hoy
                </CardTitle>
                <CardDescription className="capitalize">{fechaFormateada}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {turnos.map((turno) => {
                const estadoInfo = getEstadoInfo(turno.estado)
                const EstadoIcon = estadoInfo.icon
                return (
                  <div 
                    key={turno.id}
                    className={`p-4 rounded-lg border transition-all ${
                      turno.estado === "en_curso" ? "border-blue-500 bg-blue-500/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          turno.estado === "en_curso" ? "bg-blue-500/10" : "bg-slate-100"
                        }`}>
                          <MapPin className={`w-5 h-5 ${turno.estado === "en_curso" ? "text-blue-600" : "text-slate-500"}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Sector {turno.sector}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {turno.horario}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <p className="text-xs text-muted-foreground">{turno.familias} familias</p>
                          <Badge className={`${estadoInfo.color} border font-normal`} variant="secondary">
                            <EstadoIcon className="w-3 h-3 mr-1 inline" />
                            {estadoInfo.label}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="gap-2" 
                              onClick={() => handleEditarTurno(turno.id, turno.horario.split(" - ")[0])}
                            >
                              <Edit className="w-4 h-4" /> Editar Horario
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="gap-2 text-destructive focus:text-destructive" 
                              onClick={() => handleCancelarTurno(turno.id)}
                            >
                              <Trash2 className="w-4 h-4" /> Cancelar Turno
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Programación Semanal</CardTitle>
            <CardDescription>Distribución por sectores durante la semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {programacionSemanal.map((prog) => (
                <button
                  key={prog.dia}
                  onClick={() => setSelectedDay(prog.dia)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedDay === prog.dia 
                      ? "bg-blue-600 text-white" 
                      : "bg-slate-50 hover:bg-slate-100 text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{prog.dia}</p>
                      <p className={`text-sm ${selectedDay === prog.dia ? "text-white/80" : "text-muted-foreground"}`}>
                        {prog.sectores.join(", ")}
                      </p>
                    </div>
                    <span className={`text-sm ${selectedDay === prog.dia ? "text-white/80" : "text-muted-foreground"}`}>
                      {prog.horarioGeneral}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mapa de Sectores</CardTitle>
          <CardDescription>Distribución geográfica de los sectores de la comunidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* 🟢 Mapeado dinámico con tus sectores reales para consistencia en la UI */}
            {["Sector A", "Sector B", "Sector C"].map((sector) => {
              const turno = turnos.find(t => t.sector === sector)
              const estado = turno ? getEstadoInfo(turno.estado) : null
              return (
                <div 
                  key={sector}
                  className={`p-6 rounded-lg border-2 text-center transition-all ${
                    turno?.estado === "en_curso" 
                      ? "border-blue-500 bg-blue-50/50" 
                      : turno?.estado === "completado"
                      ? "border-emerald-500/40 bg-emerald-50/20"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <MapPin className={`w-8 h-8 mx-auto mb-2 ${
                    turno?.estado === "en_curso" ? "text-blue-600" : "text-slate-400"
                  }`} />
                  <p className="font-medium text-foreground">{sector}</p>
                  {estado ? (
                    <Badge className={`mt-2 ${estado.color} border font-normal`} variant="secondary">
                      {estado.label}
                    </Badge>
                  ) : (
                    <Badge className="mt-2 bg-slate-100 text-slate-400 border border-slate-200 font-normal" variant="secondary">
                      Cerrado
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}