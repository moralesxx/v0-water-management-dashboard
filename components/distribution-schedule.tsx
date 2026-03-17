"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"

const todaySchedule = [
  { 
    sector: "Sector Norte", 
    time: "06:00 - 10:00", 
    status: "completed" as const,
    families: 28
  },
  { 
    sector: "Sector Centro", 
    time: "10:00 - 14:00", 
    status: "active" as const,
    families: 35
  },
  { 
    sector: "Sector Sur", 
    time: "14:00 - 18:00", 
    status: "pending" as const,
    families: 22
  },
  { 
    sector: "Sector Este", 
    time: "18:00 - 22:00", 
    status: "pending" as const,
    families: 18
  },
]

const statusConfig = {
  completed: { label: "Completado", className: "bg-success/10 text-success border-success/20" },
  active: { label: "En Curso", className: "bg-primary/10 text-primary border-primary/20" },
  pending: { label: "Pendiente", className: "bg-muted text-muted-foreground border-muted" },
}

export function DistributionSchedule() {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          Turnos de Distribución de Hoy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todaySchedule.map((schedule, index) => {
            const config = statusConfig[schedule.status]
            
            return (
              <div 
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-foreground">{schedule.sector}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{schedule.time}</span>
                    <span className="text-xs text-muted-foreground">• {schedule.families} familias</span>
                  </div>
                </div>
                <Badge variant="outline" className={config.className}>
                  {config.label}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
