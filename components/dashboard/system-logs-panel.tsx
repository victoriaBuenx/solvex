"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react"

export default function SystemLogsPanel() {
  const logs = [
    {
      id: 1,
      timestamp: "14:32:15",
      type: "info",
      message: "SD insertada: SanDisk Ultra 64GB",
      icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    },
    {
      id: 2,
      timestamp: "14:32:18",
      type: "info",
      message: "Ingesta iniciada - Validando estructura de carpetas",
      icon: <Zap className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 3,
      timestamp: "14:33:45",
      type: "info",
      message: "Modelo de imágenes ejecutándose (1,456 archivos)",
      icon: <Clock className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 4,
      timestamp: "14:35:12",
      type: "success",
      message: "Modelo de audio completado - 847 archivos procesados",
      icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    },
    {
      id: 5,
      timestamp: "14:35:45",
      type: "warning",
      message: "Advertencia: 3 archivos de imagen con baja calidad detectados",
      icon: <AlertCircle className="w-4 h-4 text-yellow-400" />,
    },
    {
      id: 6,
      timestamp: "14:36:22",
      type: "info",
      message: "Análisis de metadatos en progreso",
      icon: <Clock className="w-4 h-4 text-blue-400" />,
    },
  ]

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Logs en Vivo del Sistema</CardTitle>
        <CardDescription>Eventos recientes del dispositivo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 p-3 bg-muted/20 border border-border rounded-lg">
              <div className="flex-shrink-0 mt-1">{log.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-mono text-muted-foreground">{log.timestamp}</p>
                  {log.type === "warning" && (
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                      Advertencia
                    </Badge>
                  )}
                  {log.type === "success" && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs"
                    >
                      Completado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
