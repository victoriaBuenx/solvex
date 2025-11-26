"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export default function AnomaliesPanel() {
  const anomalies = [
    {
      id: 1,
      type: "Imágenes Borrosas",
      severity: "warning",
      count: 3,
      details: "IMG_045.jpg, IMG_078.jpg, IMG_123.jpg",
    },
    {
      id: 2,
      type: "Archivos Duplicados",
      severity: "info",
      count: 2,
      details: "Audio_metadata_001 (GPS mismatch)",
    },
    {
      id: 3,
      type: "Fechas Inconsistentes",
      severity: "warning",
      count: 1,
      details: "Archivo: metadata_2023.json (año incorrecto)",
    },
    {
      id: 4,
      type: "Coordenadas Inválidas",
      severity: "error",
      count: 5,
      details: "GPS data with NULL values",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    }
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Anomalías Detectadas
        </CardTitle>
        <CardDescription>Problemas en la integridad de datos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {anomalies.map((anomaly) => (
            <div key={anomaly.id} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{anomaly.type}</h4>
                <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                  {anomaly.count}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{anomaly.details}</p>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-border bg-muted/20 rounded p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Resumen</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Total de Anomalías</p>
                <p className="font-bold text-lg">11</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Críticas</p>
                <p className="font-bold text-lg text-red-400">5</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
