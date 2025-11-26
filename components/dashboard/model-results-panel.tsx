"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ModelResultsPanel() {
  const modelResults = [
    {
      id: 1,
      name: "Modelo de Imágenes",
      status: "Ejecutándose",
      progress: 78,
      detections: [
        { label: "Venado", confidence: 0.94, count: 342 },
        { label: "Jabalí", confidence: 0.87, count: 156 },
        { label: "Humano", confidence: 0.91, count: 23 },
      ],
    },
    {
      id: 2,
      name: "Modelo de Audio",
      status: "Completado",
      progress: 100,
      detections: [
        { label: "Ave - Chirp", confidence: 0.88, count: 234 },
        { label: "Mamífero - Gruñido", confidence: 0.82, count: 89 },
        { label: "Ruido Ambiental", confidence: 0.76, count: 524 },
      ],
    },
    {
      id: 3,
      name: "Análisis de Metadatos",
      status: "Completado",
      progress: 100,
      detections: [
        { label: "Campos Normalizados", confidence: 1.0, count: 847 },
        { label: "Coordenadas Válidas", confidence: 0.99, count: 312 },
        { label: "Fechas Consistentes", confidence: 0.95, count: 847 },
      ],
    },
  ]

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Resultados de Modelo (Procesamiento en el Borde)</CardTitle>
        <CardDescription>Outputs de contenedores Docker procesando datos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {modelResults.map((model) => (
          <div key={model.id} className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{model.name}</h3>
              <Badge
                variant="outline"
                className={`${
                  model.status === "Ejecutándose"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                }`}
              >
                {model.status}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progreso</span>
                <span>{model.progress}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                  style={{ width: `${model.progress}%` }}
                />
              </div>
            </div>

            {/* Detections */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Detecciones</p>
              <div className="space-y-2">
                {model.detections.map((detection, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-muted/20 rounded p-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{detection.label}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted/50 rounded-full h-1 max-w-24">
                          <div
                            className="h-1 rounded-full bg-blue-500"
                            style={{ width: `${detection.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(detection.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold">{detection.count}</p>
                      <p className="text-xs text-muted-foreground">detecciones</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
