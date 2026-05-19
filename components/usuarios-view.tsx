"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, UserCheck, UserX, Shield, Edit, Trash2, X, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: string
  activo: boolean
  createdAt: string
}

const ROL_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TESORERO: "Tesorero",
  ENCARGADO: "Encargado",
  FAMILIA: "Familia",
}

export function UsuariosView() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Modal crear
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "ENCARGADO" })

  // Modal editar
  const [showEditModal, setShowEditModal] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ id: "", nombre: "", email: "", rol: "ENCARGADO", activo: true })

  async function cargarUsuarios() {
    setLoading(true)
    try {
      const res = await fetch("/api/usuarios")
      if (!res.ok) throw new Error()
      setUsuarios(await res.json())
    } catch {
      setError("No se pudieron cargar los usuarios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargarUsuarios() }, [])

  async function handleCrear(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Error al crear"); return }
      setShowModal(false)
      setForm({ nombre: "", email: "", password: "", rol: "ENCARGADO" })
      cargarUsuarios()
    } catch {
      setError("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  function abrirEditar(u: Usuario) {
    setEditForm({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, activo: u.activo })
    setEditError(null)
    setShowEditModal(true)
  }

  async function handleEditar(e: React.FormEvent) {
    e.preventDefault()
    setEditSaving(true)
    setEditError(null)
    try {
      const res = await fetch(`/api/usuarios/${editForm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editForm.nombre,
          email: editForm.email,
          rol: editForm.rol,
          activo: editForm.activo,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setEditError(data.error ?? "Error al editar"); return }
      setShowEditModal(false)
      cargarUsuarios()
    } catch {
      setEditError("Error de conexión")
    } finally {
      setEditSaving(false)
    }
  }

  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activos = usuarios.filter(u => u.activo).length
  const inactivos = usuarios.filter(u => !u.activo).length
  const roles = new Set(usuarios.map(u => u.rol)).size

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">CU-01: Administración de usuarios del sistema</p>
        </div>
        <Button className="gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><UserCheck className="w-6 h-6 text-primary" /></div>
          <div><p className="text-2xl font-bold">{activos}</p><p className="text-sm text-muted-foreground">Usuarios Activos</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center"><UserX className="w-6 h-6 text-destructive" /></div>
          <div><p className="text-2xl font-bold">{inactivos}</p><p className="text-sm text-muted-foreground">Usuarios Inactivos</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center"><Shield className="w-6 h-6 text-accent" /></div>
          <div><p className="text-2xl font-bold">{roles}</p><p className="text-sm text-muted-foreground">Roles Definidos</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div><CardTitle>Lista de Usuarios</CardTitle><CardDescription>Usuarios registrados en el sistema</CardDescription></div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar usuario..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rol</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Creado</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No se encontraron usuarios</td></tr>
                  ) : filteredUsuarios.map(usuario => (
                    <tr key={usuario.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                            {usuario.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium">{usuario.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{usuario.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={usuario.rol === "ADMIN" ? "default" : "secondary"}>{ROL_LABELS[usuario.rol] ?? usuario.rol}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={usuario.activo ? "default" : "outline"}>{usuario.activo ? "Activo" : "Inactivo"}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">{new Date(usuario.createdAt).toLocaleDateString("es-GT")}</td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => abrirEditar(usuario)}>
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
          )}
        </CardContent>
      </Card>

      {/* Modal Crear */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Nuevo Usuario</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nombre completo</label>
                <Input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Juan Pérez" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Correo electrónico</label>
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="usuario@sanmiguel.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Contraseña</label>
                <Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Mínimo 8 caracteres" required minLength={8} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Rol</label>
                <select value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="ADMIN">Administrador</option>
                  <option value="TESORERO">Tesorero</option>
                  <option value="ENCARGADO">Encargado</option>
                  <option value="FAMILIA">Familia</option>
                </select>
              </div>
              {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"><p className="text-sm text-destructive">{error}</p></div>}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancelar</Button>
                <Button type="submit" className="flex-1" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear Usuario"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Editar Usuario</h2>
              <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nombre completo</label>
                <Input value={editForm.nombre} onChange={e => setEditForm(p => ({ ...p, nombre: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Correo electrónico</label>
                <Input type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Rol</label>
                <select value={editForm.rol} onChange={e => setEditForm(p => ({ ...p, rol: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="ADMIN">Administrador</option>
                  <option value="TESORERO">Tesorero</option>
                  <option value="ENCARGADO">Encargado</option>
                  <option value="FAMILIA">Familia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Estado</label>
                <select value={editForm.activo ? "true" : "false"} onChange={e => setEditForm(p => ({ ...p, activo: e.target.value === "true" }))} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
              {editError && <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"><p className="text-sm text-destructive">{editError}</p></div>}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                <Button type="submit" className="flex-1" disabled={editSaving}>{editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar cambios"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}