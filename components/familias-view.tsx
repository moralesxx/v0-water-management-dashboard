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
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  Power
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const familias = [
  { id: "FAM-001", representante: "Roberto Martínez", sector: "Norte", direccion: "Calle Principal #123", servicio: "activo", medidor: "MED-1234", consumoMes: 15.5 },
  { id: "FAM-002", representante: "Carmen Vega", sector: "Sur", direccion: "Av. Central #456", servicio: "activo", medidor: "MED-1235", consumoMes: 12.3 },
  { id: "FAM-003", representante: "Luis Pérez", sector: "Este", direccion: "Calle 5 #789", servicio: "suspendido", medidor: "MED-1236", consumoMes: 0 },
  { id: "FAM-004", representante: "Sofia Torres", sector: "Oeste", direccion: "Av. Las Flores #321", servicio: "activo", medidor: "MED-1237", consumoMes: 18.7 },
  { id: "FAM-005", representante: "Miguel Ángel Ruiz", sector: "Centro", direccion: "Plaza Mayor #15", servicio: "activo", medidor: "MED-1238", consumoMes: 22.1 },
  { id: "FAM-006", representante: "Elena Gómez", sector: "Norte", direccion: "Calle Norte #88", servicio: "pendiente", medidor: "---", consumoMes: 0 },
]

export function FamiliasView() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFamilias = familias.filter(f => 
    f.representante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.sector.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getServicioInfo = (servicio: string) => {
    switch (servicio) {
      case "activo":
        return { icon: CheckCircle, color: "bg-success text-success-foreground", label: "Activo" }
      case "suspendido":
        return { icon: XCircle, color: "bg-destructive text-destructive-foreground", label: "Suspendido" }
      case "pendiente":
        return { icon: AlertCircle, color: "bg-warning text-warning-foreground", label: "Pendiente" }
      default:
        return { icon: AlertCircle, color: "bg-muted text-muted-foreground", label: servicio }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Familias y Servicio</h1>
          <p className="text-muted-foreground">CU-02: Gestión de familias beneficiarias y estado del servicio</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Familia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">248</p>
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
              <p className="text-2xl font-bold text-foreground">230</p>
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
              <p className="text-2xl font-bold text-foreground">15</p>
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
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Código</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Representante</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sector</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Dirección</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Medidor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Consumo (m³)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Servicio</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredFamilias.map((familia) => {
                  const servicioInfo = getServicioInfo(familia.servicio)
                  const ServicioIcon = servicioInfo.icon
                  return (
                    <tr key={familia.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm text-foreground">{familia.id}</td>
                      <td className="py-3 px-4 font-medium text-foreground">{familia.representante}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{familia.sector}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">{familia.direccion}</td>
                      <td className="py-3 px-4 font-mono text-sm text-muted-foreground">{familia.medidor}</td>
                      <td className="py-3 px-4 text-foreground">{familia.consumoMes > 0 ? `${familia.consumoMes} m³` : "---"}</td>
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
                            <DropdownMenuItem className="gap-2">
                              <Eye className="w-4 h-4" /> Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <Power className="w-4 h-4" /> 
                              {familia.servicio === "activo" ? "Suspender Servicio" : "Activar Servicio"}
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
        </CardContent>
      </Card>
    </div>
  )
}
