"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Search,
  Filter,
  Download
} from "lucide-react"

const paymentData = [
  { 
    code: "FAM-001", 
    name: "Juan Carlos Pérez", 
    sector: "Norte", 
    balance: 180.00,
    months: 3
  },
  { 
    code: "FAM-015", 
    name: "María Elena García", 
    sector: "Centro", 
    balance: 120.00,
    months: 2
  },
  { 
    code: "FAM-023", 
    name: "Roberto Martínez", 
    sector: "Sur", 
    balance: 60.00,
    months: 1
  },
  { 
    code: "FAM-031", 
    name: "Ana Lucía Hernández", 
    sector: "Este", 
    balance: 240.00,
    months: 4
  },
  { 
    code: "FAM-042", 
    name: "Carlos Alberto López", 
    sector: "Norte", 
    balance: 300.00,
    months: 5
  },
  { 
    code: "FAM-056", 
    name: "Patricia Ramírez", 
    sector: "Centro", 
    balance: 180.00,
    months: 3
  },
  { 
    code: "FAM-067", 
    name: "Miguel Ángel Torres", 
    sector: "Sur", 
    balance: 60.00,
    months: 1
  },
  { 
    code: "FAM-078", 
    name: "Laura Fernández", 
    sector: "Este", 
    balance: 120.00,
    months: 2
  },
]

export function PaymentsView() {
  return (
    <div className="p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Pagos y Morosidad</h1>
        <p className="text-muted-foreground mt-1">
          Gestión de pagos y control de familias en mora (CU-05)
        </p>
      </header>

      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-card-foreground">
              <CreditCard className="w-5 h-5 text-primary" />
              Familias con Saldo Pendiente
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="w-4 h-4" />
                Buscar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Código
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Nombre del Representante
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Sector
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Meses en Mora
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Saldo Pendiente
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((row, index) => (
                  <tr 
                    key={index}
                    className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-foreground">{row.code}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-foreground">{row.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {row.sector}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={
                          row.months >= 3 
                            ? "bg-destructive/10 text-destructive border-destructive/20" 
                            : row.months >= 2 
                              ? "bg-warning/10 text-warning-foreground border-warning/20"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {row.months} {row.months === 1 ? 'mes' : 'meses'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold text-foreground">
                        ${row.balance.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button size="sm" className="text-xs">
                        Registrar Pago
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando {paymentData.length} de 15 familias en mora
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
