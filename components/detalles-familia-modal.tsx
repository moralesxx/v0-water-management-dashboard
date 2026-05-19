"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Hash,
  CreditCard,
} from "lucide-react"
import { EstadoServicio, EstadoPago } from "@prisma/client"

interface DetallesFamiliaModalProps {
  familiaId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MESES = [
  "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

const estadoPagoColor: Record<string, string> = {
  PAGADO: "bg-success text-success-foreground",
  PENDIENTE: "bg-warning text-warning-foreground",
  MOROSO: "bg-destructive text-destructive-foreground",
}

export function DetallesFamiliaModal({
  familiaId,
  open,
  onOpenChange,
}: DetallesFamiliaModalProps) {
  const [familia, setFamilia] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !familiaId) return
    const fetch_ = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/familias/${familiaId}`)
        const data = await res.json()
        setFamilia(data.data)
      } catch {
        setFamilia(null)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [open, familiaId])

  const isActivo = familia?.estadoServicio === EstadoServicio.ACTIVO

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle de Familia</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : familia ? (
          <div className="space-y-5 py-2">
            {/* Encabezado con código y estado */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono font-semibold text-foreground">
                  {familia.codigoFamilia}
                </span>
              </div>
              <Badge
                className={`gap-1 ${
                  isActivo
                    ? "bg-success text-success-foreground"
                    : "bg-destructive text-destructive-foreground"
                }`}
              >
                {isActivo ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {isActivo ? "Activo" : "Suspendido"}
              </Badge>
            </div>

            {/* Info principal */}
            <div className="space-y-2.5">
              <p className="text-lg font-semibold text-foreground">
                {familia.nombreRepresentante}
              </p>

              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{familia.direccion}</span>
              </div>

              {familia.telefono && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{familia.telefono}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{familia.usuario?.email}</span>
              </div>
            </div>

            {/* Sector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sector:</span>
              <Badge variant="outline">{familia.sector?.nombre}</Badge>
            </div>

            {/* Últimos pagos */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Últimos pagos</p>
              </div>

              {familia.pagos?.length > 0 ? (
                <div className="rounded-lg border border-border divide-y divide-border">
                  {familia.pagos.map((pago: any) => (
                    <div
                      key={`${pago.mesPeriodo}-${pago.anioPeriodo}`}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span className="text-foreground">
                        {MESES[pago.mesPeriodo]} {pago.anioPeriodo}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">
                          Q{pago.monto.toFixed(2)}
                        </span>
                        <Badge
                          className={`text-xs ${estadoPagoColor[pago.estadoPago] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {pago.estadoPago}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Sin pagos registrados
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No se pudo cargar la información
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}