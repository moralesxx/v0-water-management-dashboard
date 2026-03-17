"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

const incidencias = [
  { 
    id: "INC-001", 
    titulo: "Fuga en tubería principal", 
    sector: "Norte", 
    reportadoPor: "Carlos Mendoza",
    fecha: "2024-01-15 08:30",
    prioridad: "alta",
    estado: "en_proceso",
    descripcion: "Se detectó fuga considerable en la tubería principal del sector norte."
  },
  { 
    id: "INC-002", 
    titulo: "Baja presión en sector", 
    sector: "Sur", 
    reportadoPor: "María García",
    fecha: "2024-01-14 16:45",
    prioridad: "media",
    estado: "pendiente",
    descripcion: "Reportan baja presión del agua en varias viviendas del sector sur."
  },
  { 
    id: "INC-003", 
    titulo: "Medidor dañado", 
    sector: "Centro", 
    reportadoPor: "Juan López",
    fecha: "2024-01-14 10:20",
    prioridad: "baja",
    estado: "resuelto",
    descripcion: "Medidor de la familia López presenta daños y no registra consumo."
  },
  { 
    id: "INC-004", 
    titulo: "Agua turbia", 
    sector: "Este", 
    reportadoPor: "Ana Rodríguez",
    fecha: "2024-01-13 14:00",
    prioridad: "alta",
    estado: "resuelto",
    descripcion: "Múltiples reportes de agua con coloración turbia en el sector este."
  },
  { 
    id: "INC-005", 
    titulo: "Válvula atascada", 
    sector: "Oeste", 
    reportadoPor: "Pedro Sánchez",
    fecha: "2024-01-13 09:15",
    prioridad: "media",
    estado: "en_proceso",
    descripcion: "La válvula de distribución del sector oeste no cierra correctamente."
  },
]

export function IncidenciasView() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIncidencias = incidencias.filter(i => 
    i.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.sector.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return { icon: Clock, color: "bg-warning text-warning-foreground", label: "Pendiente" }
      case "en_proceso":
        return { icon: AlertTriangle, color: "bg-primary text-primary-foreground", label: "En Proceso" }
      case "resuelto":
        return { icon: CheckCircle, color: "bg-success text-success-foreground", label: "Resuelto" }
      case "cancelado":
        return { icon: XCircle, color: "bg-muted text-muted-foreground", label: "Cancelado" }
      default:
        return { icon: Clock, color: "bg-muted text-muted-foreground", label: estado }
    }
  }

  const getPrioridadInfo = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return { color: "bg-destructive text-destructive-foreground", label: "Alta" }
      case "media":
        return { color: "bg-warning text-warning-foreground", label: "Media" }
      case "baja":
        return { color: "bg-muted text-muted-foreground", label: "Baja" }
      default:
        return { color: "bg-muted text-muted-foreground", label: prioridad }
    }
  }

  const pendientes = incidencias.filter(i => i.estado === "pendiente").length
  const enProceso = incidencias.filter(i => i.estado === "en_proceso").length
  const resueltas = incidencias.filter(i => i.estado === "resuelto").length
  const altaPrioridad = incidencias.filter(i => i.prioridad === "alta" && i.estado !== "resuelto").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Incidencias</h1>
          <p className="text-muted-foreground">CU-06: Registro y seguimiento de incidencias del sistema</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Incidencia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendientes}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{enProceso}</p>
              <p className="text-sm text-muted-foreground">En Proceso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{resueltas}</p>
              <p className="text-sm text-muted-foreground">Resueltas</p>
            </div>
          </CardContent>
        </Card>
        <Card className={altaPrioridad > 0 ? "border-destructive/50" : ""}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{altaPrioridad}</p>
              <p className="text-sm text-muted-foreground">Alta Prioridad</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  className={`p-4 rounded-lg border ${
                    incidencia.prioridad === "alta" && incidencia.estado !== "resuelto"
                      ? "border-destructive/50 bg-destructive/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">{incidencia.id}</span>
                        <Badge className={prioridadInfo.color} variant="secondary">
                          {prioridadInfo.label}
                        </Badge>
                        <Badge className={estadoInfo.color}>
                          <EstadoIcon className="w-3 h-3 mr-1" />
                          {estadoInfo.label}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground">{incidencia.titulo}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{incidencia.descripcion}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Sector: {incidencia.sector}</span>
                        <span>Reportado por: {incidencia.reportadoPor}</span>
                        <span>{incidencia.fecha}</span>
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
                        <DropdownMenuItem className="gap-2">
                          <MessageSquare className="w-4 h-4" /> Agregar Comentario
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
