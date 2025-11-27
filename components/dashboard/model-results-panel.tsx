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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import IMPORTED_JSON_DATA from "@/bdd/conabio_full_gps.json";
import { Spinner } from "../ui/spinner";
import { Container, BarChart2, DownloadCloud, FileText, Terminal } from "lucide-react";

// Small sparkline component (SVG) to show a mini-chart from an array of numbers
function Sparkline({ data, color = "#7c3aed" }: { data: number[]; color?: string }) {
  if (!data || data.length === 0) return null
  const w = 160
  const h = 40
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function downloadJSON(obj: any, filename = "model-result.json") {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

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
      images: [
        "https://source.roboflow.com/f8sLUH2zz1NtVh7byyLUl8Lqcb03/CeuCPxsp7BMziKRImlzb/original.jpg",
        "https://source.roboflow.com/5HvRYWwg5PXNLJc2IEOgjmFzamI3/0gLKcDgLdrN27NLMvtuQ/thumb.jpg",
        "https://www.lavanguardia.com/files/image_990_484/uploads/2014/08/06/5f9c1a60be34b.jpeg",
      ],
      history: [12, 22, 35, 48, 60, 68, 74, 78],
      logs: [
        { t: "14:00", msg: "Contenedor arrancado" },
        { t: "14:12", msg: "Cargando batch #12" },
        { t: "14:18", msg: "Inferencias: 120 (78% completado)" },
      ],
      requiredActions: [
        { id: "r1", title: "Revisar imágenes corruptas", description: "Hay 5 imágenes con confianza baja; confirmarlas o descartarlas.", severity: "high", actionLabel: "Marcar como revisado" },
      ],
    },
    {
      id: 2,
      name: "Modelo de Audio",
      status: "Completado",
      progress: 100,
      detections: metrics.topAudio, // AQUI INTEGRAMOS EL AUDIO DINÁMICO
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/White-tailed_deer.jpg/1200px-White-tailed_deer.jpg",
      ],
      history: [0, 10, 45, 70, 92, 100],
      logs: [
        { t: "09:00", msg: "Inicio de procesado audio" },
        { t: "09:21", msg: "Modelo entrenado cargado" },
        { t: "09:45", msg: "Finalizado" },
      ],
      requiredActions: [],
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
      images: [],
      history: [100],
      logs: [{ t: "00:00", msg: "Proceso batch finalizado" }],
      requiredActions: [],
    },
  ]);

  const [selected, setSelected] = useState<null | typeof modelResults[0]>(null)
  const [open, setOpen] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [modalActions, setModalActions] = useState<Array<any>>([])

  const openModel = (m: (typeof modelResults)[0]) => {
    setSelected(m)
    setModalActions(m.requiredActions ? [...m.requiredActions] : [])
    setOpen(true)
  }

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
              <div className="flex gap-4 items-center">
                <Container className="text-gray-500 size-5" />
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
              
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progreso</span>
                <div>
                  {
                    model.progress !== 100 && (
                      <Spinner className="w-4 h-4 mr-2 inline-block text-purple-800" />
                    ) 
                  }
                  <span>{model.progress}%</span>
                </div>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                      model.progress === 100
                      ? "bg-emerald-500"
                      : "bg-linear-to-r from-blue-500 to-purple-500"
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
                    {/* Agregar un boton para ver resultado o progreso del modelo */}
                    
                  </div>
                ))}
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => openModel(model)}
                        className={
                          model.progress === 100
                            ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
                            : "bg-purple-600 text-white border-transparent hover:bg-purple-700"
                        }
                      >
                        {model.progress === 100 ? "Ver resultado" : "Ver progreso"}
                      </Button>
                    </div>
                  </div>
          </div>
        ))}

        {/* Modal para resultado detallado del modelo seleccionado */}
        <AlertDialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) setSelected(null) }}>
          <AlertDialogContent
            className={`
              max-w-none!
              w-[95vw]!
              h-[90vh]!

              md:w-[85vw]!
              lg:w-[75vw]!
              xl:w-[65vw]!

              overflow-y-auto
              rounded-xl
              p-6
          `}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{selected?.name}</AlertDialogTitle>
              <AlertDialogDescription>
                {selected ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left: images */}
                    <div className="md:col-span-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart2 className="w-4 h-4" />
                          <span className="font-semibold">Vista rápida</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{selected.status}</div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {(selected.images || []).slice(0,4).map((src: string, i: number) => (
                          <div key={i} className="rounded-md overflow-hidden">
                            <img src={src} alt="preview" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {(selected.images || []).length === 0 && (
                          <div className="h-20 rounded-md bg-muted/20 flex items-center justify-center text-sm text-muted-foreground">Sin imágenes</div>
                        )}
                      </div>

                      <div className="mt-10 flex flex-col gap-10">
                        <h4>Progreso</h4>
                        <span className="w-full">
                        <Sparkline data={selected.history || []} color={selected.progress === 100 ? '#059669' : '#7c3aed'} />
                        </span>
                      </div>
                    </div>

                    {/* Right: details + actions */}
                    <div className="md:col-span-2 space-y-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold">{selected.name}</h4>
                        <div className="text-sm text-muted-foreground">Progreso: {selected.progress}%</div>
                      </div>

                      <div className="w-full bg-secondary/30 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${selected.progress === 100 ? 'bg-emerald-500' : 'bg-purple-600'}`}
                          style={{ width: `${selected.progress}%` }}
                        />
                      </div>

                      <div className="flex gap-2 flex-wrap items-center">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex items-center gap-2 min-w-0"
                          onClick={() => downloadJSON(selected, `${selected.name.replace(/\s+/g,'_')}.json`)}
                          disabled={selected.progress < 100}
                          title={selected.progress < 100 ? 'Disponible cuando el modelo complete' : 'Descargar resultado'}
                        >
                          <DownloadCloud className="w-4 h-4" /> Descargar
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 min-w-0"
                          onClick={() => setShowLogs(v => !v)}
                          disabled={selected.progress < 100}
                          title={selected.progress < 100 ? 'Logs disponibles cuando el modelo complete' : (showLogs ? 'Ocultar logs' : 'Ver logs')}
                        >
                          <FileText className="w-4 h-4" /> {showLogs ? 'Ocultar logs' : 'Ver logs'}
                        </Button>

                      </div>

                      <div className="mt-2">
                        <p className="text-sm font-semibold">Métricas</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          {selected.detections.map((d: any, i: number) => (
                            <div key={i} className="flex items-center justify-between bg-secondary/20 rounded p-2">
                              <div>
                                <p className="text-sm font-medium">{d.label}</p>
                                <p className="text-xs text-muted-foreground">Confianza {(d.confidence*100).toFixed(1)}%</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{d.count}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {showLogs && (
                        <div className="mt-2 bg-muted/10 border border-border rounded p-2 max-h-40 overflow-y-auto">
                          <p className="text-sm font-semibold mb-2">Logs</p>
                          <div className="space-y-1 text-xs font-mono text-muted-foreground">
                            {(selected.logs || []).map((l: any, idx: number) => (
                              <div key={idx} className="flex justify-between">
                                <span>{l.t}</span>
                                <span className="ml-2">{l.msg}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Acciones requeridas por el usuario */}
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Acciones requeridas del usuario</p>
                        {modalActions.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No hay acciones pendientes.</p>
                        ) : (
                          <div className="space-y-2">
                            {modalActions.map((a, i) => (
                              <div key={a.id} className="flex items-start justify-between bg-muted/10 border border-border rounded p-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{a.title}</p>
                                  <p className="text-xs text-muted-foreground truncate">{a.description}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button size="sm" variant="outline" className="min-w-0" onClick={() => {
                                    // mark as done locally
                                    setModalActions(prev => prev.filter(x => x.id !== a.id))
                                  }}>{a.actionLabel || 'Marcar'}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ) : null}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter />
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}