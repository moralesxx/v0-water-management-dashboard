"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Droplets, 
  Thermometer, 
  Gauge, 
  Activity,
  RefreshCw,
  Bell,
  TrendingUp,
  TrendingDown
} from "lucide-react"

const historialLecturas = [
  { fecha: "2024-01-15 12:00", nivel: 75, temperatura: 18, presion: 2.4 },
  { fecha: "2024-01-15 11:00", nivel: 78, temperatura: 17, presion: 2.5 },
  { fecha: "2024-01-15 10:00", nivel: 82, temperatura: 16, presion: 2.5 },
  { fecha: "2024-01-15 09:00", nivel: 85, temperatura: 15, presion: 2.6 },
  { fecha: "2024-01-15 08:00", nivel: 88, temperatura: 14, presion: 2.6 },
]

export function TanqueView() {
  const nivelActual = 75
  const temperaturaActual = 18
  const presionActual = 2.4

  const getNivelStatus = (nivel: number) => {
    if (nivel >= 70) return { label: "Óptimo", color: "bg-success text-success-foreground" }
    if (nivel >= 40) return { label: "Moderado", color: "bg-warning text-warning-foreground" }
    return { label: "Crítico", color: "bg-destructive text-destructive-foreground" }
  }

  const status = getNivelStatus(nivelActual)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Control de Tanque</h1>
          <p className="text-muted-foreground">CU-03: Monitoreo del nivel y estado del tanque principal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Bell className="w-4 h-4" />
            Configurar Alertas
          </Button>
          <Button className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tanque visual principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estado del Tanque Principal</CardTitle>
            <CardDescription>Capacidad total: 50,000 litros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              {/* Visual del tanque */}
              <div className="relative w-48 h-64 rounded-lg border-4 border-primary/30 bg-muted/30 overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/70 transition-all duration-500"
                  style={{ height: `${nivelActual}%` }}
                >
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-2 left-0 right-0 h-1 bg-primary-foreground/20 rounded-full mx-2" />
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-primary-foreground/10 rounded-full mx-4" />
                    <div className="absolute top-10 left-0 right-0 h-1 bg-primary-foreground/20 rounded-full mx-3" />
                  </div>
                </div>
                {/* Marcas de nivel */}
                <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-2 text-xs text-muted-foreground">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                {/* Indicador de nivel actual */}
                <div 
                  className="absolute left-0 right-12 h-0.5 bg-foreground"
                  style={{ bottom: `${nivelActual}%` }}
                >
                  <div className="absolute -right-8 -top-2 text-xs font-bold text-foreground bg-background px-1 rounded">
                    {nivelActual}%
                  </div>
                </div>
              </div>

              {/* Métricas */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nivel Actual</p>
                      <p className="text-2xl font-bold text-foreground">{nivelActual}%</p>
                    </div>
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Thermometer className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Temperatura</p>
                      <p className="text-2xl font-bold text-foreground">{temperaturaActual}°C</p>
                    </div>
                  </div>
                  <Badge variant="outline">Normal</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Presión</p>
                      <p className="text-2xl font-bold text-foreground">{presionActual} bar</p>
                    </div>
                  </div>
                  <Badge variant="outline">Estable</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Volumen Disponible</p>
                  <p className="text-xl font-bold text-foreground">37,500 L</p>
                </div>
                <Activity className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consumo Diario Prom.</p>
                  <p className="text-xl font-bold text-foreground">8,200 L</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Autonomía Estimada</p>
                  <p className="text-xl font-bold text-foreground">4.5 días</p>
                </div>
                <TrendingDown className="w-8 h-8 text-warning/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-destructive mb-2">Alertas Configuradas</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Nivel menor a 30%</li>
                <li>Temperatura mayor a 25°C</li>
                <li>Presión fuera de rango</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Historial de lecturas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Lecturas</CardTitle>
          <CardDescription>Últimas 5 lecturas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha/Hora</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nivel (%)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Temperatura (°C)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Presión (bar)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {historialLecturas.map((lectura, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm text-foreground">{lectura.fecha}</td>
                    <td className="py-3 px-4">
                      <Badge className={getNivelStatus(lectura.nivel).color}>
                        {lectura.nivel}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground">{lectura.temperatura}°C</td>
                    <td className="py-3 px-4 text-foreground">{lectura.presion} bar</td>
                    <td className="py-3 px-4">
                      {index < historialLecturas.length - 1 && (
                        lectura.nivel < historialLecturas[index + 1].nivel ? (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-success" />
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
