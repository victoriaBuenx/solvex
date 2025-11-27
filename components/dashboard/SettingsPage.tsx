"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

export function SettingsPage() {
  const [temperature, setTemperature] = useState(52.3)
  const [processes, setProcesses] = useState([
    { name: "python-ai-model", cpu: 18.5 },
    { name: "sd-sync-service", cpu: 8.2 },
    { name: "data-processor", cpu: 5.1 },
    { name: "logger-daemon", cpu: 1.3 },
  ])

  useEffect(() => {
    const id = setInterval(() => {
      setTemperature(prev => {
        const delta = (Math.random() - 0.5) * 1.0
        let next = Math.round((prev + delta) * 10) / 10
        if (next < 20) next = 20
        if (next > 95) next = 95
        return next
      })

      setProcesses(prev => prev.map(p => {
        const delta = (Math.random() - 0.5) * 2
        let next = Math.round((p.cpu + delta) * 10) / 10
        if (next < 0) next = 0
        if (next > 100) next = 100
        return { ...p, cpu: next }
      }))
    }, 1500)

    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-6">
              <Card className="border-border bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>Información del Sistema</CardTitle>
                  <CardDescription>
                    Detalles técnicos de la Raspberry Pi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Modelo
                        </p>
                        <p className="font-semibold text-lg">Raspberry Pi 5</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          CPU
                        </p>
                        <p className="font-semibold">
                          Arm Cortex A76 4x 2.4GHz
                        </p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          RAM Disponible
                        </p>
                        <p className="font-semibold text-green-400">
                          6.2 GB / 8 GB
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Uptime
                        </p>
                        <p className="font-semibold">12 horas</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Temperatura
                        </p>
                        <p className="font-semibold text-blue-400">{temperature.toFixed(1)}°C</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Almacenamiento
                        </p>
                        <p className="font-semibold">243.5 GB / 256 GB</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-muted/30 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Procesos Activos</h3>
                    <div className="space-y-2 text-sm font-mono">
                      {processes.map(p => (
                        <div key={p.name} className="flex justify-between text-muted-foreground">
                          <span>{p.name}</span>
                          <span>{p.cpu.toFixed(1)}% CPU</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
  )
}