"use client"

import { useState } from "react"
import { Droplet, User, Shield, Wallet, Home, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type UserRole = "admin" | "familia" | "tesorero"

interface LoginPageProps {
  onLogin: (role: UserRole, username: string) => void
}

const roles = [
  {
    id: "admin" as const,
    label: "Administrador",
    description: "Acceso completo al sistema",
    icon: Shield,
    color: "bg-primary",
  },
  {
    id: "familia" as const,
    label: "Familia",
    description: "Ver estado de cuenta y pagos",
    icon: Home,
    color: "bg-accent",
  },
  {
    id: "tesorero" as const,
    label: "Tesorero",
    description: "Gestión de pagos y reportes",
    icon: Wallet,
    color: "bg-success",
  },
]

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedRole) {
      setError("Por favor seleccione un tipo de usuario")
      return
    }

    if (!username.trim()) {
      setError("Por favor ingrese su usuario")
      return
    }

    if (!password.trim()) {
      setError("Por favor ingrese su contraseña")
      return
    }

    setIsLoading(true)

    // Simular autenticación
    setTimeout(() => {
      setIsLoading(false)
      onLogin(selectedRole, username)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Droplet className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sistema de Gestión del Agua</h1>
          <p className="text-muted-foreground mt-1">Comunidad San Miguel</p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription>Seleccione su tipo de usuario para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selección de rol */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tipo de Usuario</Label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon
                    const isSelected = selectedRole === role.id
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            isSelected ? role.color : "bg-muted"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-5 h-5",
                              isSelected ? "text-primary-foreground" : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <div className="text-center">
                          <p
                            className={cn(
                              "text-xs font-medium",
                              isSelected ? "text-primary" : "text-foreground"
                            )}
                          >
                            {role.label}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {selectedRole && (
                  <p className="text-xs text-muted-foreground text-center">
                    {roles.find((r) => r.id === selectedRole)?.description}
                  </p>
                )}
              </div>

              {/* Campo de usuario */}
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Campo de contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Botón de login */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Ingresando...
                  </span>
                ) : (
                  "Ingresar al Sistema"
                )}
              </Button>

              {/* Demo credentials */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center mb-2">
                  Credenciales de demostración:
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Admin</p>
                    <p className="text-muted-foreground">admin / 1234</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Familia</p>
                    <p className="text-muted-foreground">familia / 1234</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Tesorero</p>
                    <p className="text-muted-foreground">tesorero / 1234</p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Sistema de Gestión y Control del Agua v1.0
        </p>
      </div>
    </div>
  )
}
