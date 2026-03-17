"use client"

import { 
  LayoutDashboard, 
  Users, 
  Home, 
  CreditCard, 
  Droplets, 
  GitBranch, 
  AlertTriangle,
  Droplet
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ViewType } from "@/app/page"

interface SidebarProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

const menuItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard, code: "CU-08" },
  { id: "usuarios" as const, label: "Gestión de Usuarios", icon: Users, code: "CU-01" },
  { id: "familias" as const, label: "Familias y Servicio", icon: Home, code: "CU-02" },
  { id: "pagos" as const, label: "Pagos y Morosidad", icon: CreditCard, code: "CU-05" },
  { id: "tanque" as const, label: "Control de Tanque", icon: Droplets, code: "CU-03" },
  { id: "distribucion" as const, label: "Distribución", icon: GitBranch, code: "CU-04" },
  { id: "incidencias" as const, label: "Incidencias", icon: AlertTriangle, code: "CU-06" },
]

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Droplet className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-sidebar-foreground">Sistema de Agua</h1>
            <p className="text-xs text-sidebar-foreground/70">Comunidad San Miguel</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sidebar-border/50 text-sidebar-foreground/60">
                    {item.code}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-medium">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Administrador</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">admin@sanmiguel.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
