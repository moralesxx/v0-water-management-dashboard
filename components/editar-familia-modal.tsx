"use client"

import { useEffect, useState } from "react"
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
import { Loader2, Edit } from "lucide-react"
import { toast } from "sonner"

interface Sector {
  id: string
  nombre: string
}

interface Familia {
  id: string
  nombreRepresentante: string
  direccion: string
  telefono?: string | null
  sectorId: string
  sector: { id: string; nombre: string }
}

interface EditarFamiliaModalProps {
  familia: Familia | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditarFamiliaModal({
  familia,
  open,
  onOpenChange,
  onSuccess,
}: EditarFamiliaModalProps) {
  const [sectores, setSectores] = useState<Sector[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSectores, setLoadingSectores] = useState(false)

  const [form, setForm] = useState({
    nombreRepresentante: "",
    direccion: "",
    telefono: "",
    sectorId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-rellenar formulario cuando cambia la familia
  useEffect(() => {
    if (familia) {
      setForm({
        nombreRepresentante: familia.nombreRepresentante,
        direccion: familia.direccion,
        telefono: familia.telefono ?? "",
        sectorId: familia.sectorId,
      })
      setErrors({})
    }
  }, [familia])

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
    return newErrors
  }

  const handleSubmit = async () => {
    if (!familia) return
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/familias/${familia.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreRepresentante: form.nombreRepresentante,
          direccion: form.direccion,
          telefono: form.telefono || null,
          sectorId: form.sectorId,
        }),
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
        throw new Error(data.error ?? "Error al actualizar")
      }

      toast.success("Familia actualizada correctamente")
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message ?? "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) onOpenChange(v) }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Edit className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Editar Familia</DialogTitle>
              <DialogDescription>
                Modifica los datos del representante familiar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-nombre">
              Nombre del representante <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-nombre"
              value={form.nombreRepresentante}
              onChange={(e) => handleChange("nombreRepresentante", e.target.value)}
              className={errors.nombreRepresentante ? "border-destructive" : ""}
            />
            {errors.nombreRepresentante && (
              <p className="text-xs text-destructive">{errors.nombreRepresentante}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-direccion">
              Dirección <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-direccion"
              value={form.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              className={errors.direccion ? "border-destructive" : ""}
            />
            {errors.direccion && (
              <p className="text-xs text-destructive">{errors.direccion}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                placeholder="5555-1234"
                value={form.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Sector <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.sectorId}
                onValueChange={(v) => handleChange("sectorId", v)}
                disabled={loadingSectores}
              >
                <SelectTrigger className={errors.sectorId ? "border-destructive" : ""}>
                  <SelectValue placeholder={loadingSectores ? "Cargando..." : "Seleccionar"} />
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}