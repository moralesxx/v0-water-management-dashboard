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
import { LoginPage, type UserRole } from "@/components/login-page"
import { FamiliaDashboard } from "@/components/familia-dashboard"

export type ViewType = 
  | "dashboard" 
  | "usuarios" 
  | "familias" 
  | "pagos" 
  | "tanque" 
  | "distribucion" 
  | "incidencias"

export interface User {
  role: UserRole
  username: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [showToast, setShowToast] = useState(true)

  const handleLogin = (role: UserRole, username: string) => {
    setUser({ role, username })
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView("dashboard")
    setShowToast(true)
  }

  // Si no hay usuario autenticado, mostrar login
  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Vista para Familia (rol limitado)
  if (user.role === "familia") {
    return <FamiliaDashboard user={user} onLogout={handleLogout} />
  }

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
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
      {showToast && user.role === "admin" && (
        <ToastNotification 
          message="Sugerencia: Suspender servicio a Familia Pérez por mora acumulada (Extends CU-02)"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}
