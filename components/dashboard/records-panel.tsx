"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RecordsPanel({empty} : {empty: boolean}) {
  const records = {
    totalFiles: 10185,
    byType: {
      images: 101,
      audio: 84,
      metadata: 10000,
    },
    dataSize: "2.2 GB",
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Registros Cargados (Contenido)</CardTitle>
            <CardDescription>Estructura de datos procesada</CardDescription>
          </div>
          {
            !empty && (
            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                Completado
            </Badge>
            ) 
          }
         
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total de Archivos</p>
            {
              !empty ? (
                <p className="text-2xl font-bold">{records.totalFiles.toLocaleString()}</p>
              ) : (
                <p className="text-2xl font-bold">---</p>

              )
            }
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Tamaño Total</p>

            {
              !empty ? (
                <p className="text-2xl font-bold">{records.dataSize}</p>
              ) : (
                <p className="text-2xl font-bold">---</p>
              )
            }
          </div>
        </div>

        {/* Data Types Breakdown */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Distribución por Tipo</h3>
          {
           !empty && (
               <div className="space-y-3">
            {Object.entries(records.byType).map(([type, count]) => {
              const total = records.totalFiles
              const percentage = (count / total) * 100
              return (
                <div key={type}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm capitalize">{type}</span>
                    <span className="text-xs text-muted-foreground">{count} archivos</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        type === "images"
                          ? "bg-blue-500"
                          : type === "audio"
                            ? "bg-purple-500"
                            : type === "gps"
                              ? "bg-green-500"
                              : "bg-amber-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
            )
          }
         
        </div>

        {
          !empty && (
<div className="bg-muted/20 border border-border rounded-lg p-3">
          <p className="text-xs font-mono text-muted-foreground mb-2">Estructura de Carpetas</p>
          <div className="text-xs font-mono space-y-1 text-foreground/70">
            <p>📁 /data/tcam-001/2025-11-27/</p>
            <p className="ml-4">📁 images/ (101 ✓)</p>
            <p className="ml-4">📁 audio/ (84 ✓)</p>
            <p className="ml-4">📁 metadata/ (10000 ✓)</p>
          </div>
        </div>
          )
        }
        {/* Structure Info */}
        
      </CardContent>
    </Card>
  )
}
