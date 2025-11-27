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
  type?: string; // Nuevo campo para filtrar (camera | audio)
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
    requires_human_review?: boolean; 
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
        unknowns: defaultMetric,
        humanReview: defaultMetric,
        topSpecies: [], 
        topAudio: [], // Array vacío por defecto para audio
      };
    }

    const totalRecords = data.length;

    // Variables de conteo
    const clusterCounts: Record<number, number> = {};
    const clusterNames: Record<number, string> = {};
    
    // Mapas para acumular especies (separado por tipo)
    const speciesMap: Record<string, { count: number; sumConfidence: number }> = {}; 
    const audioMap: Record<string, { count: number; sumConfidence: number }> = {}; // Nuevo mapa para audio
    
    let dayCount = 0;
    let nightCount = 0;
    let alertsCount = 0;
    let unknownCount = 0;
    let humanReviewCount = 0;

    data.forEach((item) => {
      // 1. Lógica de Cúmulos
      if (item && item.deployment) {
        const cid = item.deployment.cluster_id;
        const name = item.deployment.site_name;
        clusterCounts[cid] = (clusterCounts[cid] || 0) + 1;
        if (!clusterNames[cid]) clusterNames[cid] = name;
      }

      // 2. Lógica de Tiempo
      if (item && item.timestamp) {
        const date = new Date(item.timestamp);
        const hour = date.getUTCHours();
        if (hour >= 6 && hour < 18) {
          dayCount++;
        } else {
          nightCount++;
        }
      }

      // 3. Lógica de Filtros de IA y Especies
      if (item && item.ai_analysis && item.ai_analysis.common_name) {
        const rawName = item.ai_analysis.common_name;
        const nameLower = rawName.trim().toLowerCase();
        const itemType = item.type || "camera"; // Default a camera si no existe

        // Alertas (Filtro Global)
        if (
          nameLower === "falso positivo (viento)" ||
          nameLower.includes("persona") ||
          nameLower.includes("cazador")
        ) {
          alertsCount++;
        } else {
            // Lógica Diferenciada: Audio vs Cámara
            if (itemType === "audio") {
                // Acumular para Top Audio
                if (!audioMap[rawName]) {
                    audioMap[rawName] = { count: 0, sumConfidence: 0 };
                }
                audioMap[rawName].count++;
                audioMap[rawName].sumConfidence += item.ai_analysis.confidence;
            } else {
                // Acumular para Top Especies (Imágenes)
                if (!speciesMap[rawName]) {
                    speciesMap[rawName] = { count: 0, sumConfidence: 0 };
                }
                speciesMap[rawName].count++;
                speciesMap[rawName].sumConfidence += item.ai_analysis.confidence;
            }
        }

        // Unknown / Desconocido
        if (nameLower.includes("unknown") || nameLower.includes("desconocido") || nameLower.includes("no identificado")) {
          unknownCount++;
        }

        // Intervención Humana
        if (item.ai_analysis.requires_human_review === true) {
          humanReviewCount++;
        }
      }
    });

    // --- Ganadores y Totales ---
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
    
    // Actividad
    const totalTimeRecords = dayCount + nightCount;
    const isDayDominant = dayCount >= nightCount;
    const dominantActivityCount = isDayDominant ? dayCount : nightCount;

    // --- Helper para generar Top 3 ---
    const getTop3 = (map: Record<string, { count: number; sumConfidence: number }>) => {
        return Object.entries(map)
            .map(([name, data]) => ({
                label: name,
                count: data.count,
                confidence: data.count > 0 ? data.sumConfidence / data.count : 0
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    };

    const topSpecies = getTop3(speciesMap);
    const topAudio = getTop3(audioMap); // Generamos Top 3 de Audio

    return {
      cluster: {
        label: `Cúmulo Más Activo: ${dominantSiteName}`,
        confidence: maxCount / totalRecords,
        count: maxCount,
      },
      activity: {
        label: `Tendencia: ${isDayDominant ? "Día" : "Noche"}`,
        confidence: totalTimeRecords > 0 ? dominantActivityCount / totalTimeRecords : 0,
        count: dominantActivityCount,
      },
      alerts: {
        label: "Falsos Positivos",
        confidence: alertsCount / totalRecords,
        count: alertsCount,
      },
      unknowns: {
        label: "Especies Desconocidas (Unknown)",
        confidence: unknownCount / totalRecords,
        count: unknownCount,
      },
      humanReview: {
        label: "Intervención Humana Requerida",
        confidence: humanReviewCount / totalRecords,
        count: humanReviewCount,
      },
      topSpecies: topSpecies.length > 0 ? topSpecies : [defaultMetric],
      topAudio: topAudio.length > 0 ? topAudio : [{ label: "Sin audio detectado", confidence: 0, count: 0 }],
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
      detections: metrics.topSpecies, // Dinámico (Cámaras)
    },
    {
      id: 2,
      name: "Modelo de Audio",
      status: "Completado",
      progress: 100,
      detections: metrics.topAudio, // AQUI INTEGRAMOS EL AUDIO DINÁMICO
    },
    {
      id: 3,
      name: "Análisis de Biodiversidad",
      status: "Completado",
      progress: 100,
      detections: [
        metrics.cluster,
        metrics.activity,
        metrics.alerts,
      ],
    },
    {
      id: 4,
      name: "Hallazgos de Especies",
      status: "Completado",
      progress: 100,
      detections: [
        metrics.unknowns,     
        metrics.humanReview,  
      ],
    },
    {
      id: 5,
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
    <Card className="border-border bg-card/50 backdrop-blur w-full max-w-4xl mx-auto">
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
              <h3 className="font-semibold text-foreground">{model.name}</h3>
              <Badge
                variant="outline"
                className={`${
                  model.status.includes("Completado")
                    ? "px-3 py-1 text-sm rounded-md bg-emerald-500/20 text-emerald-700 border-emerald-500/30"
                    : model.status === "Ejecutándose"
                    ? "px-3 py-1 text-sm rounded-md bg-blue-500/20 text-blue-700 border-blue-500/30"
                    : "px-3 py-1 text-sm rounded-md bg-yellow-500/20 text-amber-600 border-yellow-500/30"
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
              <div className="w-full bg-secondary/30 rounded-full h-2">
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
                    className="flex items-center justify-between bg-secondary/20 rounded p-2 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{detection.label}</p>

                      {/* Confidence Bar - Visualiza el PORCENTAJE */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-secondary/50 rounded-full h-1 max-w-[100px]">
                          <div
                            className={`h-1 rounded-full transition-all duration-700 ${
                              detection.confidence > 0.9
                                ? "bg-emerald-500"
                                : "bg-blue-500"
                            }`}
                            // Ancho = Porcentaje
                            style={{ width: `${detection.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(detection.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="text-right ml-4 min-w-[60px]">
                      {/* Visualiza la CANTIDAD */}
                      <p className="text-sm font-semibold text-foreground">{detection.count}</p>
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