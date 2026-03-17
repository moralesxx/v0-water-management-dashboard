"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  UserCheck, 
  UserX,
  Shield,
  Edit,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const usuarios = [
  { id: 1, nombre: "Carlos Mendoza", email: "carlos@sanmiguel.com", rol: "Administrador", estado: "activo", ultimoAcceso: "2024-01-15 10:30" },
  { id: 2, nombre: "María García", email: "maria@sanmiguel.com", rol: "Operador", estado: "activo", ultimoAcceso: "2024-01-15 09:15" },
  { id: 3, nombre: "Juan López", email: "juan@sanmiguel.com", rol: "Tesorero", estado: "activo", ultimoAcceso: "2024-01-14 16:45" },
  { id: 4, nombre: "Ana Rodríguez", email: "ana@sanmiguel.com", rol: "Operador", estado: "inactivo", ultimoAcceso: "2024-01-10 08:00" },
  { id: 5, nombre: "Pedro Sánchez", email: "pedro@sanmiguel.com", rol: "Lector", estado: "activo", ultimoAcceso: "2024-01-15 11:20" },
]

export function UsuariosView() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">CU-01: Administración de usuarios del sistema</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-sm text-muted-foreground">Usuarios Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <UserX className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">Usuarios Inactivos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-muted-foreground">Roles Definidos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>Usuarios registrados en el sistema</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rol</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Último Acceso</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                          {usuario.nombre.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium text-foreground">{usuario.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{usuario.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={usuario.rol === "Administrador" ? "default" : "secondary"}>
                        {usuario.rol}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={usuario.estado === "activo" ? "default" : "outline"} className={usuario.estado === "activo" ? "bg-success text-success-foreground" : ""}>
                        {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">{usuario.ultimoAcceso}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
