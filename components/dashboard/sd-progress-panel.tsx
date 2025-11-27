"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity } from "lucide-react"

export default function SDProgressPanel({empty}: {empty?: boolean}) {
  const [progress, setProgress] = useState(0)

  // useEffect para incrementar cada segundo el progreso en 1 o 2
  useEffect(() => {
    if (empty) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        const inc = Math.random() < 0.5 ? 1 : 2
        return Math.min(100, prev + inc)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [empty])
  

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              Progreso de Copia en NAS
            </CardTitle>
            <CardDescription>Transferencia de tarjeta SD en tiempo real</CardDescription>
          </div>
          {empty ? (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">0%</div>
              <div className="text-xs text-muted-foreground">completado</div>
            </div>
          ) : (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">{progress}%</div>
              <div className="text-xs text-muted-foreground">completado</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SD Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">SD Detectada</p>
            {
              empty ? (
                <p className="font-semibold">--</p>
              ) : (
                <p className="font-semibold">ADATA 16GB</p>
              )
            }
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">ID / Nombre</p>

            {
              empty ? (
                <p className="font-semibold">--</p>
              ) : (
                <p className="font-semibold">ST_2024_001</p>
              )
            }
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Conexión</p>
            {
              empty ? (
                <p className="font-semibold">--</p>
              ) : (
                <p className="font-semibold text-green-500">{new Date().toLocaleTimeString()}</p>
              )
            }
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Datos Encontrados</p>
            {
              empty ? (
                <p className="font-semibold">--</p>
              ) : (
                <p className="font-semibold">IMG, Audio, Meta</p>
              )
            }
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Barra de Progreso</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stats */}
        {
          !empty && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Velocidad promedio</p>
              <p className="font-semibold text-primary">45.2 MB/s</p>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Tiempo Restante</p>
              <p className="font-semibold text-accent">~1 min</p>
            </div>
            <div className="bg-muted/30 border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Capacidad Total</p>
              <p className="font-semibold">16 GB</p>
            </div>
        </div>
          ) 
        }
       
        {
          !empty && (
            <div className="bg-muted/20 border border-border rounded-lg p-4 space-y-2">
          <p className="text-xs font-mono text-blue-400 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Validando estructura…
          </p>
          <p className="text-xs font-mono text-green-400 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Copiando carpeta imágenes (101 archivos)…
          </p>
          <p className="text-xs font-mono text-blue-400 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Copiando carpeta audio (84 archivos)…
          </p>
          <p className="text-xs font-mono text-blue-400 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Generando metadatos …
          </p>
        </div>
          )
        }
        {/* Live Messages */}
        
      </CardContent>
    </Card>
  )
}
