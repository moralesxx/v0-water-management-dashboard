"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react"

interface DelinquencyCardProps {
  onViewDetails: () => void
}

export function DelinquencyCard({ onViewDetails }: DelinquencyCardProps) {
  const [familiesInDefault, setFamiliesInDefault] = useState<number | null>(null)
  const [totalDebt, setTotalDebt] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/pagos/morosidad?limit=100")
      .then(r => r.json())
      .then(data => {
        const lista = data.data ?? []
        setFamiliesInDefault(data.pagination?.total ?? lista.length)
        const deudaTotal = lista.reduce((acc: number, m: any) => acc + (m.balance ?? 0), 0)
        setTotalDebt(deudaTotal)
      })
      .catch(() => {
        setFamiliesInDefault(0)
        setTotalDebt(0)
      })
      .finally(() => setLoading(false))
  }, [])

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
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-4xl font-bold text-foreground">{familiesInDefault}</div>
                <p className="text-sm text-muted-foreground">Familias en Mora</p>
              </>
            )}
          </div>

          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Deuda total acumulada</span>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-lg font-semibold text-destructive">
                  Q{(totalDebt ?? 0).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <Button onClick={onViewDetails} className="w-full" variant="outline">
            Ver Detalles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}