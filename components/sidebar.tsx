"use client"

import { 
  LayoutDashboard, 
  Users, 
  Home, 
  CreditCard, 
  Droplets, 
  GitBranch, 
  AlertTriangle,
  Droplet,
  LogOut,
  Shield,
  Wallet
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ViewType, User } from "@/app/page"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  user: User
  onLogout: () => void
}

const allMenuItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard, code: "CU-08", roles: ["admin", "tesorero"] },
  { id: "usuarios" as const, label: "Gestión de Usuarios", icon: Users, code: "CU-01", roles: ["admin"] },
  { id: "familias" as const, label: "Familias y Servicio", icon: Home, code: "CU-02", roles: ["admin", "tesorero"] },
  { id: "pagos" as const, label: "Pagos y Morosidad", icon: CreditCard, code: "CU-05", roles: ["admin", "tesorero"] },
  { id: "tanque" as const, label: "Control de Tanque", icon: Droplets, code: "CU-03", roles: ["admin"] },
  { id: "distribucion" as const, label: "Distribución", icon: GitBranch, code: "CU-04", roles: ["admin"] },
  { id: "incidencias" as const, label: "Incidencias", icon: AlertTriangle, code: "CU-06", roles: ["admin", "tesorero"] },
]

const roleLabels = {
  admin: { label: "Administrador", icon: Shield, color: "bg-primary" },
  familia: { label: "Familia", icon: Home, color: "bg-accent" },
  tesorero: { label: "Tesorero", icon: Wallet, color: "bg-success" },
}

export function Sidebar({ currentView, onNavigate, user, onLogout }: SidebarProps) {
  // Filtrar items del menú según el rol del usuario
  const menuItems = allMenuItems.filter(item => item.roles.includes(user.role))
  const roleInfo = roleLabels[user.role]
  const RoleIcon = roleInfo.icon

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
      
      <nav className="flex-1 p-4 overflow-auto">
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
      
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground",
            roleInfo.color
          )}>
            <RoleIcon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate capitalize">
              {user.username}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{roleInfo.label}</p>
          </div>
        </div>
        
        {/* Logout button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLogout}
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}
