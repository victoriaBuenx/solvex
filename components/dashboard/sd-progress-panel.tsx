"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity } from "lucide-react"

export default function SDProgressPanel() {
  const [progress, setProgress] = useState(43)

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              Progreso de Copia (Ingesta de SD)
            </CardTitle>
            <CardDescription>Transferencia de tarjeta SD en tiempo real</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">{progress}%</div>
            <div className="text-xs text-muted-foreground">completado</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SD Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">SD Detectada</p>
            <p className="font-semibold">SanDisk Ultra</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">ID / Nombre</p>
            <p className="font-semibold">SD_2024_001</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Conexión</p>
            <p className="font-semibold text-green-400">14:32:15 GMT</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Datos Encontrados</p>
            <p className="font-semibold text-sm">IMG, Audio, Meta</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Barra de Progreso</span>
            <span className="text-xs text-muted-foreground">2,847 / 6,500 archivos</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Velocidad</p>
            <p className="font-semibold text-primary">45.2 MB/s</p>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Tiempo Restante</p>
            <p className="font-semibold text-accent">~8 min</p>
          </div>
          <div className="bg-muted/30 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Capacidad Total</p>
            <p className="font-semibold">64 GB</p>
          </div>
        </div>

        {/* Live Messages */}
        <div className="bg-muted/20 border border-border rounded-lg p-4 space-y-2">
          <p className="text-xs font-mono text-blue-400 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Validando estructura…
          </p>
          <p className="text-xs font-mono text-green-400 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Copiando carpeta imágenes (1,243 archivos)…
          </p>
          <p className="text-xs font-mono text-blue-400 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Copiando carpeta audio (847 archivos)…
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
