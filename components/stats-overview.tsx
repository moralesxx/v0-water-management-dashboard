"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Home, Droplets, AlertCircle } from "lucide-react"

const stats = [
  {
    label: "Usuarios Activos",
    value: "24",
    change: "+2 este mes",
    icon: Users,
    iconColor: "text-primary"
  },
  {
    label: "Familias Registradas",
    value: "103",
    change: "98% con servicio",
    icon: Home,
    iconColor: "text-accent"
  },
  {
    label: "Consumo Mensual",
    value: "1.2M L",
    change: "-5% vs anterior",
    icon: Droplets,
    iconColor: "text-primary"
  },
  {
    label: "Incidencias Abiertas",
    value: "3",
    change: "2 urgentes",
    icon: AlertCircle,
    iconColor: "text-warning"
  },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <Card key={index} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`p-2 rounded-lg bg-muted ${stat.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
