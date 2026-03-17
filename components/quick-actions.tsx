"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  UserPlus, 
  FileText, 
  Settings,
  Zap
} from "lucide-react"

const actions = [
  {
    label: "Reportar Incidencia",
    icon: AlertTriangle,
    variant: "default" as const,
    highlight: true
  },
  {
    label: "Registrar Nueva Familia",
    icon: UserPlus,
    variant: "outline" as const
  },
  {
    label: "Generar Reporte",
    icon: FileText,
    variant: "outline" as const
  },
  {
    label: "Configuración",
    icon: Settings,
    variant: "outline" as const
  },
]

export function QuickActions() {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <Zap className="w-5 h-5 text-primary" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action, index) => {
            const Icon = action.icon
            
            return (
              <Button
                key={index}
                variant={action.variant}
                className={`w-full justify-start gap-3 ${action.highlight ? 'bg-primary hover:bg-primary/90' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
