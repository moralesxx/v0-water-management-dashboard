"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardView } from "@/components/dashboard-view"
import { PaymentsView } from "@/components/payments-view"
import { UsuariosView } from "@/components/usuarios-view"
import { FamiliasView } from "@/components/familias-view"
import { TanqueView } from "@/components/tanque-view"
import { DistribucionView } from "@/components/distribucion-view"
import { IncidenciasView } from "@/components/incidencias-view"
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
      case "usuarios":
        return <UsuariosView />
      case "familias":
        return <FamiliasView />
      case "pagos":
        return <PaymentsView />
      case "tanque":
        return <TanqueView />
      case "distribucion":
        return <DistribucionView />
      case "incidencias":
        return <IncidenciasView />
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
