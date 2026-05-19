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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface RegistrarPagoModalProps {
  familia: {
    id: string
    codigoFamilia: string
    nombreRepresentante: string
    balance: number
    months: number
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function RegistrarPagoModal({
  familia,
  open,
  onOpenChange,
  onSuccess,
}: RegistrarPagoModalProps) {
  const [loading, setLoading] = useState(false)
  const [mesesAPagar, setMesesAPagar] = useState("1")
  const [metodoPago, setMetodoPago] = useState("EFECTIVO")

  // Si la cuota base por mes es fija (por ejemplo Q60.00 basado en tu mock)
  const cuotaPorMes = familia ? familia.balance / familia.months : 0
  const montoTotal = cuotaPorMes * parseInt(mesesAPagar)

  useEffect(() => {
    if (open) {
      setMesesAPagar("1")
      setMetodoPago("EFECTIVO")
    }
  }, [open])

  const handleSubmit = async () => {
    if (!familia) return

    setLoading(true)
    try {
      const res = await fetch(`/api/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familiaId: familia.id,
          cantidadMeses: parseInt(mesesAPagar),
          monto: montoTotal,
          metodoPago,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? "Error al registrar el pago")

      toast.success(`Pago de Q${montoTotal.toFixed(2)} registrado correctamente`)
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message ?? "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  if (!familia) return null

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) onOpenChange(v) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <DialogTitle>Registrar Pago</DialogTitle>
              <DialogDescription>
                Genera un cobro de servicio para {familia.nombreRepresentante}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3 text-sm">
          {/* Fila Informativa de la Familia */}
          <div className="grid grid-cols-2 gap-2 bg-muted/50 p-3 rounded-lg border border-border">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Código Familia</p>
              <p className="font-mono font-semibold text-foreground">{familia.codigoFamilia}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Meses acumulados</p>
              <p className="font-semibold text-destructive">{familia.months} {familia.months === 1 ? 'mes' : 'meses'}</p>
            </div>
          </div>

          {/* Selector de Meses a Cancelar */}
          <div className="space-y-1.5">
            <Label htmlFor="meses">Cantidad de meses a pagar</Label>
            <Select value={mesesAPagar} onValueChange={setMesesAPagar}>
              <SelectTrigger id="meses">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: familia.months }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Mes" : "Meses"} — Q{(cuotaPorMes * num).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Método de Pago */}
          <div className="space-y-1.5">
            <Label htmlFor="metodo">Método de pago</Label>
            <Select value={metodoPago} onValueChange={setMetodoPago}>
              <SelectTrigger id="metodo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                <SelectItem value="TRANSFERENCIA">Transferencia Bancaria</SelectItem>
                <SelectItem value="DEPOSITO">Depósito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cuadro del Gran Total */}
          <div className="border-t pt-4 flex items-center justify-between">
            <span className="text-base font-medium text-foreground">Total a Recibir:</span>
            <span className="text-2xl font-bold text-success">
              Q{montoTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Procesando..." : "Confirmar Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}