"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const turnosHoy = [
  { id: 1, sector: "Norte", horario: "06:00 - 10:00", estado: "completado", familias: 62 },
  { id: 2, sector: "Centro", horario: "10:00 - 14:00", estado: "en_curso", familias: 45 },
  { id: 3, sector: "Sur", horario: "14:00 - 18:00", estado: "pendiente", familias: 58 },
  { id: 4, sector: "Este", horario: "18:00 - 22:00", estado: "pendiente", familias: 41 },
]

const programacionSemanal = [
  { dia: "Lunes", sectores: ["Norte", "Centro"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Martes", sectores: ["Sur", "Este"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Miércoles", sectores: ["Oeste", "Norte"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Jueves", sectores: ["Centro", "Sur"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Viernes", sectores: ["Este", "Oeste"], horarioGeneral: "06:00 - 18:00" },
  { dia: "Sábado", sectores: ["Todos"], horarioGeneral: "06:00 - 12:00" },
  { dia: "Domingo", sectores: ["Mantenimiento"], horarioGeneral: "---" },
]

export function DistribucionView() {
  const [selectedDay, setSelectedDay] = useState("Lunes")

  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case "completado":
        return { icon: CheckCircle, color: "bg-success text-success-foreground", label: "Completado" }
      case "en_curso":
        return { icon: Play, color: "bg-primary text-primary-foreground", label: "En Curso" }
      case "pendiente":
        return { icon: Circle, color: "bg-muted text-muted-foreground", label: "Pendiente" }
      default:
        return { icon: Circle, color: "bg-muted text-muted-foreground", label: estado }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Distribución del Agua</h1>
          <p className="text-muted-foreground">CU-04: Programación y control de turnos de distribución</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Turno
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">Completados Hoy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">En Curso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">206</p>
              <p className="text-sm text-muted-foreground">Familias Hoy</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turnos de hoy */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Turnos de Hoy
                </CardTitle>
                <CardDescription>Miércoles, 15 de Enero 2024</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {turnosHoy.map((turno) => {
                const estadoInfo = getEstadoInfo(turno.estado)
                const EstadoIcon = estadoInfo.icon
                return (
                  <div 
                    key={turno.id}
                    className={`p-4 rounded-lg border ${turno.estado === "en_curso" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${turno.estado === "en_curso" ? "bg-primary/10" : "bg-muted"}`}>
                          <MapPin className={`w-5 h-5 ${turno.estado === "en_curso" ? "text-primary" : "text-muted-foreground"}`} />
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
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{turno.familias} familias</p>
                          <Badge className={estadoInfo.color}>
                            <EstadoIcon className="w-3 h-3 mr-1" />
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
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <Trash2 className="w-4 h-4" /> Cancelar
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

        {/* Programación semanal */}
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
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted/50 hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{prog.dia}</p>
                      <p className={`text-sm ${selectedDay === prog.dia ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {prog.sectores.join(", ")}
                      </p>
                    </div>
                    <span className={`text-sm ${selectedDay === prog.dia ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {prog.horarioGeneral}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapa de sectores (placeholder visual) */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Sectores</CardTitle>
          <CardDescription>Distribución geográfica de los sectores de la comunidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {["Norte", "Centro", "Sur", "Este", "Oeste"].map((sector) => {
              const turno = turnosHoy.find(t => t.sector === sector)
              const estado = turno ? getEstadoInfo(turno.estado) : null
              return (
                <div 
                  key={sector}
                  className={`p-6 rounded-lg border-2 text-center ${
                    turno?.estado === "en_curso" 
                      ? "border-primary bg-primary/5" 
                      : turno?.estado === "completado"
                      ? "border-success/50 bg-success/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <MapPin className={`w-8 h-8 mx-auto mb-2 ${
                    turno?.estado === "en_curso" ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <p className="font-medium text-foreground">{sector}</p>
                  {estado && (
                    <Badge className={`mt-2 ${estado.color}`} variant="secondary">
                      {estado.label}
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
