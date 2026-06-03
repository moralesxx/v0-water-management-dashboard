"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Home, Droplets, AlertCircle } from "lucide-react"

export function StatsOverview() {
  const [totalFamilias, setTotalFamilias] = useState<number | null>(null)
  const [totalIncidencias, setTotalIncidencias] = useState<number | null>(null)
  const [usuariosActivos, setUsuariosActivos] = useState<number | null>(null)

  useEffect(() => {
    // Total real de familias
    fetch("/api/familias?limit=1")
      .then(r => r.json())
      .then(data => {
        if (data.pagination?.total !== undefined) setTotalFamilias(data.pagination.total)
        else if (data.stats?.total !== undefined) setTotalFamilias(data.stats.total)
      })
      .catch(() => {})

    // Total real de incidencias
    fetch("/api/incidencias?limit=1")
      .then(r => r.json())
      .then(data => {
        if (data.pagination?.total !== undefined) setTotalIncidencias(data.pagination.total)
      })
      .catch(() => {})

    // Usuarios activos
    fetch("/api/usuarios")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsuariosActivos(data.filter((u: any) => u.activo).length)
        }
      })
      .catch(() => {})
  }, [])

  const stats = [
    {
      label: "Usuarios Activos",
      value: usuariosActivos !== null ? usuariosActivos.toString() : "...",
      change: usuariosActivos !== null ? `${usuariosActivos} en el sistema` : "Cargando...",
      icon: Users,
      iconColor: "text-primary"
    },
    {
      label: "Familias Registradas",
      value: totalFamilias !== null ? totalFamilias.toString() : "...",
      change: totalFamilias !== null ? `${totalFamilias} en el sistema` : "Cargando...",
      icon: Home,
      iconColor: "text-accent"
    },
    {
      label: "Consumo Mensual",
      value: "1.2M L",
      change: "Ver control de tanque",
      icon: Droplets,
      iconColor: "text-primary"
    },
    {
      label: "Incidencias Abiertas",
      value: totalIncidencias !== null ? totalIncidencias.toString() : "...",
      change: totalIncidencias !== null ? `${totalIncidencias} registradas` : "Cargando...",
      icon: AlertCircle,
      iconColor: "text-warning"
    },
  ]

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