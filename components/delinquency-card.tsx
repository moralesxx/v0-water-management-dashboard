"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight } from "lucide-react"

interface DelinquencyCardProps {
  onViewDetails: () => void
}

export function DelinquencyCard({ onViewDetails }: DelinquencyCardProps) {
  const familiesInDefault = 15
  const totalDebt = 2450.00

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Morosidad Activa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-4xl font-bold text-foreground">{familiesInDefault}</div>
            <p className="text-sm text-muted-foreground">Familias en Mora</p>
          </div>
          
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Deuda total acumulada</span>
              <span className="text-lg font-semibold text-destructive">${totalDebt.toFixed(2)}</span>
            </div>
          </div>

          <Button 
            onClick={onViewDetails}
            className="w-full"
            variant="outline"
          >
            Ver Detalles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
