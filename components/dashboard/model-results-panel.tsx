"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import IMPORTED_JSON_DATA from "@/bdd/conabio_full_gps.json";

interface DetectionData {
  uuid?: string;
  file_name?: string;
  timestamp?: string;
  deployment: {
    site_name: string;
    habitat_type?: string;
    cluster_id: number;
    node_id?: number;
  };
  ai_analysis?: {
    primary_tag: string;
    common_name?: string;
    confidence: number;
  };
}

export default function ModelResultsPanel() {
  // --- Lógica de Cálculo Completa ---
  const calculateBiodiversityMetrics = (data: DetectionData[]) => {
    // Valores por defecto
    const defaultMetric = { label: "Sin datos", confidence: 0, count: 0 };

    if (!Array.isArray(data) || data.length === 0) {
      return {
        cluster: defaultMetric,
        activity: defaultMetric,
        alerts: defaultMetric,
      };
    }

    const totalRecords = data.length;

    // Variables para Cúmulos
    const clusterCounts: Record<number, number> = {};
    const clusterNames: Record<number, string> = {};

    // Variables para Actividad (Día vs Noche) - RESTAURADO
    let dayCount = 0;
    let nightCount = 0;

    // Variables para Alertas (Filtro específico)
    let alertsCount = 0;

    data.forEach((item) => {
      // 1. Lógica de Cúmulos
      if (item && item.deployment) {
        const cid = item.deployment.cluster_id;
        const name = item.deployment.site_name;
        clusterCounts[cid] = (clusterCounts[cid] || 0) + 1;
        if (!clusterNames[cid]) clusterNames[cid] = name;
      }

      // 2. Lógica de Tiempo (Día vs Noche) - RESTAURADO
      if (item && item.timestamp) {
        const date = new Date(item.timestamp);
        // Usamos getUTCHours porque el formato ISO termina en Z (UTC).
        const hour = date.getUTCHours();

        // Definimos "Día" arbitrariamente de 06:00 AM a 05:59 PM (18:00)
        if (hour >= 6 && hour < 18) {
          dayCount++;
        } else {
          nightCount++;
        }
      }

      // 3. Lógica de Filtro Específico (Alertas)
      if (item && item.ai_analysis && item.ai_analysis.common_name) {
        const name = item.ai_analysis.common_name.trim().toLowerCase();

        if (
          name === "falso positivo (viento)" ||
          name === "persona / cazador furtivo"
        ) {
          alertsCount++;
        }
      }
    });

    // --- Ganador de Cúmulos ---
    let maxClusterId = -1;
    let maxCount = 0;
    for (const [idStr, count] of Object.entries(clusterCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxClusterId = Number(idStr);
      }
    }
    const rawName = clusterNames[maxClusterId] || "Desconocido";
    const dominantSiteName = rawName.replace(/_/g, " ");
    const clusterConfidence = maxCount / totalRecords;

    // --- Ganador de Actividad - RESTAURADO ---
    const totalTimeRecords = dayCount + nightCount;
    const isDayDominant = dayCount >= nightCount;
    const dominantActivityCount = isDayDominant ? dayCount : nightCount;
    const activityLabel = isDayDominant ? "Día" : "Noche";
    const activityConfidence =
      totalTimeRecords > 0 ? dominantActivityCount / totalTimeRecords : 0;

    // --- Métricas de Alertas ---
    const alertsConfidence = alertsCount / totalRecords;

    return {
      cluster: {
        label: `Cúmulo Más Activo: ${dominantSiteName}`,
        confidence: clusterConfidence,
        count: maxCount,
      },
      activity: {
        label: `Tendencia de actividad: ${activityLabel}`,
        confidence: activityConfidence,
        count: dominantActivityCount,
      },
      alerts: {
        label: "Falsos Positivos",
        confidence: alertsConfidence,
        count: alertsCount,
      },
    };
  };

  // Ejecutamos cálculo
  const metrics = calculateBiodiversityMetrics(
    IMPORTED_JSON_DATA as unknown as DetectionData[]
  );

  // Estado inicial
  const [modelResults] = useState([
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
      name: "Análisis de Biodiversidad",
      status: "Completado",
      progress: 100,
      detections: [
        metrics.cluster, // 1. Cúmulo
        metrics.activity, // 2. Actividad (Restaurado)
        metrics.alerts, // 3. Alertas (Filtro específico)
      ],
    },
    {
      id: 4,
      name: "Análisis de Metadatos",
      status: "Completado",
      progress: 100,
      detections: [
        { label: "Campos Normalizados", confidence: 1.0, count: 847 },
        { label: "Coordenadas Válidas", confidence: 0.99, count: 312 },
        { label: "Fechas Consistentes", confidence: 0.95, count: 847 },
      ],
    },
  ]);

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Resultados de Modelo (Procesamiento en el Borde)</CardTitle>
        <CardDescription>
          Outputs de contenedores Docker procesando datos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {modelResults.map((model) => (
          <div
            key={model.id}
            className="border border-border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{model.name}</h3>
              <Badge
                variant="outline"
                className={`${
                  model.status.includes("Completado")
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : model.status === "Ejecutándose"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
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
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    model.progress === 100
                      ? "bg-emerald-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  }`}
                  style={{ width: `${model.progress}%` }}
                />
              </div>
            </div>

            {/* Detections */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Métricas Clave
              </p>
              <div className="space-y-2">
                {model.detections.map((detection, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-muted/20 rounded p-2 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{detection.label}</p>

                      {/* Confidence Bar */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-muted/50 rounded-full h-1 max-w-[100px]">
                          <div
                            className={`h-1 rounded-full transition-all duration-700 ${
                              detection.confidence > 0.9
                                ? "bg-emerald-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${detection.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(detection.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="text-right ml-4 min-w-[60px]">
                      <p className="text-sm font-semibold">{detection.count}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        items
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
