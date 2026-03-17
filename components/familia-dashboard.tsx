"use client"

import { 
  Droplet, 
  LogOut, 
  Home, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Download
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/app/page"

interface FamiliaDashboardProps {
  user: User
  onLogout: () => void
}

// Datos de ejemplo para la familia
const familyData = {
  codigo: "FAM-2024-0042",
  nombre: "Familia García López",
  sector: "Sector Norte",
  direccion: "Calle Principal #123",
  estadoServicio: "activo" as const,
  ultimoPago: "15 Feb 2024",
  proximoTurno: "Martes 19 Mar, 8:00 - 12:00",
  saldoPendiente: 0,
  mesesAlDia: true,
}

const historialPagos = [
  { id: 1, fecha: "15 Feb 2024", concepto: "Cuota Febrero 2024", monto: 150, estado: "pagado" },
  { id: 2, fecha: "15 Ene 2024", concepto: "Cuota Enero 2024", monto: 150, estado: "pagado" },
  { id: 3, fecha: "15 Dic 2023", concepto: "Cuota Diciembre 2023", monto: 150, estado: "pagado" },
  { id: 4, fecha: "15 Nov 2023", concepto: "Cuota Noviembre 2023", monto: 150, estado: "pagado" },
]

const proximosTurnos = [
  { fecha: "Mar 19 Mar", horario: "8:00 - 12:00", estado: "programado" },
  { fecha: "Mar 26 Mar", horario: "8:00 - 12:00", estado: "programado" },
  { fecha: "Mar 02 Abr", horario: "8:00 - 12:00", estado: "programado" },
]

export function FamiliaDashboard({ user, onLogout }: FamiliaDashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Droplet className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Sistema de Agua</h1>
                <p className="text-xs text-muted-foreground">Comunidad San Miguel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground capitalize">{user.username}</p>
                <p className="text-xs text-muted-foreground">Portal Familiar</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-1">Bienvenido, {familyData.nombre}</h2>
          <p className="text-muted-foreground">Código: {familyData.codigo} | {familyData.sector}</p>
        </div>

        {/* Status cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {/* Estado del servicio */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado del Servicio</p>
                  <p className="text-lg font-semibold text-success">Activo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saldo pendiente */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
                  <p className="text-lg font-semibold text-foreground">
                    {familyData.saldoPendiente === 0 ? (
                      <span className="text-success">Al día</span>
                    ) : (
                      `Q${familyData.saldoPendiente.toFixed(2)}`
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximo turno */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Próximo Turno</p>
                  <p className="text-sm font-semibold text-foreground">{familyData.proximoTurno}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Historial de pagos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Historial de Pagos</CardTitle>
                  <CardDescription>Últimos pagos realizados</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {historialPagos.map((pago) => (
                  <div 
                    key={pago.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{pago.concepto}</p>
                        <p className="text-xs text-muted-foreground">{pago.fecha}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">Q{pago.monto.toFixed(2)}</p>
                      <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">
                        Pagado
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Próximos turnos de agua */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximos Turnos de Agua</CardTitle>
              <CardDescription>Calendario de distribución para tu sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proximosTurnos.map((turno, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{turno.fecha}</p>
                        <p className="text-xs text-muted-foreground">{turno.horario}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      Programado
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-primary">Recordatorio</p>
                    <p className="text-xs text-muted-foreground">
                      Asegúrese de tener sus recipientes listos antes del horario asignado.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la familia */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Información de la Familia</CardTitle>
              <CardDescription>Datos registrados en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Dirección</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">{familyData.direccion}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Código de Familia</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">{familyData.codigo}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Último Pago</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">{familyData.ultimoPago}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Sector Asignado</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">{familyData.sector}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Descargar Estado de Cuenta
          </Button>
          <Button variant="outline">
            <AlertCircle className="w-4 h-4 mr-2" />
            Reportar Incidencia
          </Button>
        </div>
      </main>
    </div>
  )
}
