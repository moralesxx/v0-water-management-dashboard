"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"

interface Sector {
  id: string
  nombre: string
}

interface NuevaFamiliaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function NuevaFamiliaModal({
  open,
  onOpenChange,
  onSuccess,
}: NuevaFamiliaModalProps) {
  const [sectores, setSectores] = useState<Sector[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSectores, setLoadingSectores] = useState(false)

  const [form, setForm] = useState({
    nombreRepresentante: "",
    direccion: "",
    telefono: "",
    sectorId: "",
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar sectores al abrir
  useEffect(() => {
    if (!open) return
    const fetchSectores = async () => {
      setLoadingSectores(true)
      try {
        const res = await fetch("/api/sectores")
        const data = await res.json()
        setSectores(data.data ?? [])
      } catch {
        toast.error("No se pudieron cargar los sectores")
      } finally {
        setLoadingSectores(false)
      }
    }
    fetchSectores()
  }, [open])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.nombreRepresentante.trim()) newErrors.nombreRepresentante = "Nombre requerido"
    if (!form.direccion.trim()) newErrors.direccion = "Dirección requerida"
    if (!form.sectorId) newErrors.sectorId = "Selecciona un sector"
    if (!form.email.trim()) newErrors.email = "Email requerido"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email inválido"
    if (!form.password) newErrors.password = "Contraseña requerida"
    else if (form.password.length < 8) newErrors.password = "Mínimo 8 caracteres"
    return newErrors
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/familias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 422 && data.detalles) {
          const apiErrors: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(data.detalles)) {
            apiErrors[key] = (msgs as string[])[0]
          }
          setErrors(apiErrors)
          return
        }
        throw new Error(data.error ?? "Error al crear familia")
      }

      toast.success(`Familia ${data.data.codigoFamilia} creada correctamente`)
      onSuccess()
      onOpenChange(false)
      setForm({
        nombreRepresentante: "",
        direccion: "",
        telefono: "",
        sectorId: "",
        email: "",
        password: "",
      })
      setErrors({})
    } catch (err: any) {
      toast.error(err.message ?? "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    onOpenChange(false)
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Nueva Familia</DialogTitle>
              <DialogDescription>
                Registra una familia beneficiaria y crea sus credenciales de acceso
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Nombre representante */}
          <div className="space-y-1.5">
            <Label htmlFor="nombreRepresentante">
              Nombre del representante <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombreRepresentante"
              placeholder="Ej: Juan Pérez García"
              value={form.nombreRepresentante}
              onChange={(e) => handleChange("nombreRepresentante", e.target.value)}
              className={errors.nombreRepresentante ? "border-destructive" : ""}
            />
            {errors.nombreRepresentante && (
              <p className="text-xs text-destructive">{errors.nombreRepresentante}</p>
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-1.5">
            <Label htmlFor="direccion">
              Dirección <span className="text-destructive">*</span>
            </Label>
            <Input
              id="direccion"
              placeholder="Ej: Calle Principal #123"
              value={form.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              className={errors.direccion ? "border-destructive" : ""}
            />
            {errors.direccion && (
              <p className="text-xs text-destructive">{errors.direccion}</p>
            )}
          </div>

          {/* Teléfono + Sector en fila */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                placeholder="5555-1234"
                value={form.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sector">
                Sector <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.sectorId}
                onValueChange={(v) => handleChange("sectorId", v)}
                disabled={loadingSectores}
              >
                <SelectTrigger
                  id="sector"
                  className={errors.sectorId ? "border-destructive" : ""}
                >
                  <SelectValue
                    placeholder={loadingSectores ? "Cargando..." : "Seleccionar"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {sectores.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sectorId && (
                <p className="text-xs text-destructive">{errors.sectorId}</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4 space-y-1">
            <p className="text-sm font-medium text-foreground">Credenciales de acceso</p>
            <p className="text-xs text-muted-foreground">
              El representante usará estas credenciales para ingresar al sistema
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="juan.perez@ejemplo.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">
              Contraseña <span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creando..." : "Crear Familia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}