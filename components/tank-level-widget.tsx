"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, CheckCircle2 } from "lucide-react"

export function TankLevelWidget() {
  const tankLevel = 75

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
          <Droplets className="w-5 h-5 text-primary" />
          Nivel del Tanque Principal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-32">
            <div className="absolute inset-0 rounded-lg border-2 border-border bg-muted overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-primary/80 transition-all duration-500"
                style={{ height: `${tankLevel}%` }}
              >
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1 left-0 right-0 h-2 bg-primary-foreground/20 rounded-full mx-2" />
                  <div className="absolute top-4 left-0 right-0 h-1 bg-primary-foreground/10 rounded-full mx-3" />
                </div>
              </div>
            </div>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-[10px] text-muted-foreground">
              <span>100%</span>
              <span className="mt-6">50%</span>
              <span className="mt-6">0%</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="text-4xl font-bold text-foreground">{tankLevel}%</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Nivel Óptimo
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Capacidad: 50,000 L<br />
              Disponible: 37,500 L
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
