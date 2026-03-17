"use client"

import { TankLevelWidget } from "./tank-level-widget"
import { DelinquencyCard } from "./delinquency-card"
import { DistributionSchedule } from "./distribution-schedule"
import { QuickActions } from "./quick-actions"
import { StatsOverview } from "./stats-overview"
import type { ViewType } from "@/app/page"

interface DashboardViewProps {
  onNavigate: (view: ViewType) => void
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Panel de control del Sistema de Gestión del Agua
        </p>
      </header>

      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TankLevelWidget />
            <DelinquencyCard onViewDetails={() => onNavigate("pagos")} />
          </div>
          <DistributionSchedule />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
