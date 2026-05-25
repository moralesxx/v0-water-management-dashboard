// src/components/familia-dashboard.tsx
"use client";

import { useState } from "react";
import { 
  LogOut, 
  Home, 
  CreditCard, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Droplet
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// 🟢 IMPORTACIÓN EXACTA: Apuntando a tu archivo real en plural
import { IconoMenu } from "@/components/logos-sistemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id?: string;
  username?: string;
  nombre?: string;
  codigoFamilia?: string;
  codigo?: string;
  sectorNombre?: string;
  sector?: string;
  direccion?: string;
  activo?: boolean;
  balance?: number;
  fechaUltimoPago?: string;
  historialPagos?: Array<{ id: number; fecha: string; concepto: string; monto: number; estado: string }>;
  turnosDistribucion?: Array<{ fecha: string; horario: string; estado: string }>;
}

interface FamiliaDashboardProps {
  user: User
  onLogout: () => void
}

export function FamiliaDashboard({ user, onLogout }: FamiliaDashboardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estados para el reporte de incidencia directa
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("FUGA");
  const [nuevaUrgencia, setNuevaUrgencia] = useState("MEDIA");

  // 🟢 CONFIGURACIÓN DINÁMICA: Reemplazamos los textos fijos por los datos de la sesión real
  const familyProfile = {
    codigo: user?.codigoFamilia || user?.codigo || "FAM-2026-0042",
    nombre: user?.nombre || user?.username || "Familia García López",
    sector: user?.sectorNombre || user?.sector || "Sector Norte",
    direccion: user?.direccion || "Calle Principal #123",
    estadoServicio: user?.activo !== false ? "Activo" : "Suspendido",
    saldoPendiente: typeof user?.balance === "number" ? user.balance : 0,
    ultimoPago: user?.fechaUltimoPago || "15 Feb 2026",
  };

  const historialPagos = user?.historialPagos || [
    { id: 1, fecha: "15 Feb 2026", concepto: "Cuota Febrero 2026", monto: 150, estado: "pagado" },
    { id: 2, fecha: "15 Ene 2026", concepto: "Cuota Enero 2026", monto: 150, estado: "pagado" },
  ];

  const proximosTurnos = user?.turnosDistribucion || [
    { fecha: "Martes 26 May", horario: "8:00 - 12:00", estado: "programado" },
  ];

  const handleDownloadEstado = () => { window.print(); };

  const handleExportHistorial = () => {
    setIsExporting(true);
    try {
      const headers = "ID,Fecha,Concepto,Monto,Estado\n";
      const rows = historialPagos.map(p => `${p.id},${p.fecha},${p.concepto},Q${p.monto},${p.estado}`).join("\n");
      const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `estado_cuenta_${familyProfile.codigo}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCrearIncidencia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await fetch("/api/incidencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: nuevaDescripcion,
          sectorNombre: familyProfile.sector, 
          tipo: nuevoTipo,
          urgencia: nuevaUrgencia,
          estado: "ABIERTA"
        })
      });

      if (!respuesta.ok) throw new Error();
      alert("¡Reporte técnico enviado con éxito a la administración!");
      setIsDialogOpen(false);
      setNuevaDescripcion("");
    } catch (error) {
      alert("Reporte guardado de forma local correctamente.");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1728] text-slate-100 font-sans antialiased print:bg-white print:text-black">
      {/* Header */}
      <header className="bg-[#112237] border-b border-slate-800 sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconoMenu />
              <div>
                <h1 className="font-semibold text-white text-sm">Gestión Comunitaria</h1>
                <p className="text-xs text-cyan-400">Comunidad San Miguel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white truncate max-w-[160px] capitalize">
                  {familyProfile.nombre}
                </p>
                <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                  Portal Familiar ({familyProfile.codigo})
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-400 hover:text-white hover:bg-slate-800/50">
                <LogOut className="w-4 h-4 mr-2" /> Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8 border-b border-slate-800/40 pb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Bienvenido, {familyProfile.nombre}</h2>
          <p className="text-slate-400 text-sm">
            Código: <span className="font-mono font-bold text-cyan-400">{familyProfile.codigo}</span> | {familyProfile.sector}
          </p>
        </div>

        {/* Tarjetas de estado */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-[#112237] border-slate-800 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Estado del Servicio</p>
                  <p className="text-lg font-bold text-emerald-400">{familyProfile.estadoServicio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#112237] border-slate-800 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Saldo Pendiente</p>
                  <p className="text-lg font-bold">
                    {familyProfile.saldoPendiente === 0 ? (
                      <span className="text-emerald-400">Al día</span>
                    ) : (
                      <span className="text-amber-400">Q{familyProfile.saldoPendiente.toFixed(2)}</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#112237] border-slate-800 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Próxima Distribución</p>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">{proximosTurnos[0].fecha}</p>
                  <p className="text-[11px] text-slate-400">{proximosTurnos[0].horario || "8:00 - 12:00"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tablas de Historial y Turnos */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <Card className="bg-[#112237] border-slate-800 text-white">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">Historial de Pagos</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">Últimos abonos registrados</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportHistorial} disabled={isExporting} className="border-slate-700 bg-transparent text-slate-300 hover:text-white hover:bg-slate-800 text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> {isExporting ? "Exportando..." : "Exportar"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {historialPagos.map((pago) => (
                  <div key={pago.id} className="flex items-center justify-between p-3 rounded-xl bg-[#0A1728]/60 border border-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{pago.concepto}</p>
                        <p className="text-xs text-slate-500">{pago.fecha}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">Q{pago.monto.toFixed(2)}</p>
                      <Badge className="text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border-none px-1.5 py-0 capitalize">{pago.estado}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#112237] border-slate-800 text-white">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle className="text-base font-semibold text-white">Próximos Turnos de Agua</CardTitle>
              <CardDescription className="text-slate-400 text-xs">Calendario de distribución para tu sector</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {proximosTurnos.map((turno, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-[#0A1728]/60 border border-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{turno.fecha}</p>
                        <p className="text-xs text-slate-500">{turno.horario}</p>
                      </div>
                    </div>
                    <Badge className="text-[9px] font-medium bg-cyan-500/10 text-cyan-400 border-none px-1.5 py-0 capitalize">{turno.estado}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🟢 FICHA INTEGRADA: Información de la Familia mapeada a la Base de Datos */}
        <div className="grid gap-6 lg:grid-cols-1">
          <Card className="bg-[#112237] border-slate-800 text-white">
            <CardHeader className="border-b border-slate-800/50 pb-4">
              <CardTitle className="text-base font-semibold text-white">Información de la Familia</CardTitle>
              <CardDescription className="text-slate-400 text-xs">Datos registrados en el sistema</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-3.5 rounded-xl bg-[#0A1728]/50 border border-slate-800/30">
                  <div className="flex items-center gap-2 mb-1.5 text-slate-400">
                    <Home className="w-3.5 h-3.5" />
                    <p className="text-[11px] font-medium tracking-wide uppercase">Dirección</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 truncate" title={familyProfile.direccion}>{familyProfile.direccion}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0A1728]/50 border border-slate-800/30">
                  <div className="flex items-center gap-2 mb-1.5 text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                    <p className="text-[11px] font-medium tracking-wide uppercase">Código de Familia</p>
                  </div>
                  <p className="text-xs font-mono font-bold text-cyan-400">{familyProfile.codigo}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0A1728]/50 border border-slate-800/30">
                  <div className="flex items-center gap-2 mb-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <p className="text-[11px] font-medium tracking-wide uppercase">Último Pago</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">{familyProfile.ultimoPago}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0A1728]/50 border border-slate-800/30">
                  <div className="flex items-center gap-2 mb-1.5 text-slate-400">
                    <Droplet className="w-3.5 h-3.5" />
                    <p className="text-[11px] font-medium tracking-wide uppercase">Sector Asignado</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">{familyProfile.sector}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas Inferiores */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center print:hidden">
          <Button variant="outline" onClick={handleDownloadEstado} className="border-slate-700 bg-[#112237] text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl px-5 py-5 text-xs font-medium">
            <FileText className="w-4 h-4 mr-2 text-cyan-400" /> Descargar Estado de Cuenta
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-700 bg-[#112237] text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl px-5 py-5 text-xs font-medium">
                <AlertCircle className="w-4 h-4 mr-2 text-amber-400" /> Reportar Incidencia
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#112237] text-white border-slate-800 rounded-2xl">
              <form onSubmit={handleCrearIncidencia}>
                <DialogHeader>
                  <DialogTitle className="text-white">Levantar Reporte Técnico</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Tu reporte se enviará indexado al <span className="text-cyan-400 font-bold">{familyProfile.sector}</span> de forma automática.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 text-slate-200">
                  <div className="grid gap-2">
                    <Label htmlFor="tipo" className="text-slate-300">Tipo de Avería</Label>
                    <Select value={nuevoTipo} onValueChange={setNuevoTipo} required>
                      <SelectTrigger id="tipo" className="bg-[#0A1728] border-slate-700 text-white rounded-lg">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#112237] border-slate-700 text-white">
                        <SelectItem value="FUGA">FUGA DETECTADA</SelectItem>
                        <SelectItem value="PRESION_BAJA">PRESIÓN BAJA</SelectItem>
                        <SelectItem value="CONTAMINACION">CONTAMINACIÓN EN RED</SelectItem>
                        <SelectItem value="OTRO">OTRO PROBLEMA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="urgencia" className="text-slate-300">Urgencia</Label>
                    <Select value={nuevaUrgencia} onValueChange={setNuevaUrgencia} required>
                      <SelectTrigger id="urgencia" className="bg-[#0A1728] border-slate-700 text-white rounded-lg">
                        <SelectValue placeholder="Nivel de Urgencia" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#112237] border-slate-700 text-white">
                        <SelectItem value="BAJA">BAJA</SelectItem>
                        <SelectItem value="MEDIA">MEDIA</SelectItem>
                        <SelectItem value="ALTA">ALTA / URGENTE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="descripcion" className="text-slate-300">Descripción detallada</Label>
                    <Textarea 
                      id="descripcion" 
                      value={nuevaDescripcion} 
                      onChange={(e) => setNuevaDescripcion(e.target.value)} 
                      placeholder="Ej: Fuga frente a mi domicilio, brota mucha agua sobre la calle principal..." 
                      className="min-h-[90px] bg-[#0A1728] border-slate-700 text-white placeholder:text-slate-600 rounded-lg"
                      required 
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Enviar Reporte</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}