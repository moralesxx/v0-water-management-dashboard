// app/dashboard/page.tsx
"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardView } from "@/components/dashboard-view"
import { PaymentsView } from "@/components/payments-view"
import { UsuariosView } from "@/components/usuarios-view"
import { FamiliasView } from "@/components/familias-view"
import { TanqueView } from "@/components/tanque-view"
import { DistribucionView } from "@/components/distribucion-view"
import { IncidenciasView } from "@/components/incidencias-view"
import { ToastNotification } from "@/components/toast-notification"
import { FamiliaDashboard } from "@/components/familia-dashboard"
import { useRouter } from "next/navigation"

export type ViewType =
  | "dashboard"
  | "usuarios"
  | "familias"
  | "pagos"
  | "tanque"
  | "distribucion"
  | "incidencias"

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [showToast, setShowToast] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)
  const [cargando, setCargando] = useState(true) // 🟢 Estado de carga para evitar parpadeos
  const router = useRouter()

  useEffect(() => {
    // Leer usuario directamente del servidor de forma limpia
    fetch("/api/auth/me")
      .then(r => {
        if (!r.ok) throw new Error("No autenticado")
        return r.json()
      })
      .then(data => {
        if (data.usuario) {
          setUsuario(data.usuario)
        } else {
          router.push("/auth/login")
        }
      })
      .catch(() => {
        router.push("/auth/login")
      })
      .finally(() => {
        setCargando(false)
      })
  }, [router])

  // Función manual de Logout limpia para no depender del hook roto
  const handleLogoutManual = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/auth/login")
      router.refresh()
    } catch (error) {
      router.push("/auth/login")
    }
  }

  // 🟢 Si está verificando la sesión, mostramos una pantalla limpia en vez de disparar redirecciones vacías
  if (cargando) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground animate-pulse">Cargando panel de control...</div>
      </div>
    )
  }

  if (!usuario) return null

  if (usuario.rol === "FAMILIA") {
    return <FamiliaDashboard user={{ role: "FAMILIA", username: usuario.nombre }} onLogout={handleLogoutManual} />
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard": return <DashboardView onNavigate={setCurrentView} />
      case "usuarios": return <UsuariosView />
      case "familias": return <FamiliasView />
      case "pagos": return <PaymentsView />
      case "tanque": return <TanqueView />
      case "distribucion": return <DistribucionView />
      case "incidencias": return <IncidenciasView />
      default: return <DashboardView onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        // Enviamos el rol exacto en mayúsculas directo al Sidebar
        user={{ role: usuario.rol.toUpperCase(), username: usuario.nombre }}
        onLogout={handleLogoutManual}
      />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
      {showToast && usuario.rol === "ADMIN" && (
        <ToastNotification
          message="Sistema conectado a Supabase correctamente"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}