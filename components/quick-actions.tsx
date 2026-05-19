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
import type { ViewType } from "@/app/page" // Aseguramos que los tipos coincidan con tu layout

// 1. Añadimos el destino "view" a cada acción de tu array
const actions = [
  {
    label: "Reportar Incidencia",
    icon: AlertTriangle,
    variant: "default" as const,
    highlight: true,
    view: "incidencias" as ViewType
  },
  {
    label: "Registrar Nueva Familia",
    icon: UserPlus,
    variant: "outline" as const,
    view: "familias" as ViewType
  },
  {
    label: "Generar Reporte",
    icon: FileText,
    variant: "outline" as const,
    view: "pagos" as ViewType // Te manda a pagos para que puedan usar la exportación CSV
  },
  {
    label: "Configuración",
    icon: Settings,
    variant: "outline" as const,
    view: "configuracion" as ViewType
  },
]

// 2. Definimos la interfaz para recibir la función de navegación
interface QuickActionsProps {
  onNavigate: (view: ViewType) => void
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
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
                // 3. Conectamos el click con tu manejador de navegación
                onClick={() => onNavigate(action.view)}
                className={`w-full justify-start gap-3 ${
                  action.highlight ? 'bg-primary hover:bg-primary/90' : ''
                }`}
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