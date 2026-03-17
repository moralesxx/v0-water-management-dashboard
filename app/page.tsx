"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardView } from "@/components/dashboard-view"
import { PaymentsView } from "@/components/payments-view"
import { ToastNotification } from "@/components/toast-notification"

export type ViewType = 
  | "dashboard" 
  | "usuarios" 
  | "familias" 
  | "pagos" 
  | "tanque" 
  | "distribucion" 
  | "incidencias"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [showToast, setShowToast] = useState(true)

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView onNavigate={setCurrentView} />
      case "pagos":
        return <PaymentsView />
      default:
        return <DashboardView onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
      {showToast && (
        <ToastNotification 
          message="Sugerencia: Suspender servicio a Familia Pérez por mora acumulada (Extends CU-02)"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}
