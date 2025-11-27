"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, FileJson, BrainCircuit, HardDrive, Database, CloudUpload} from "lucide-react";
import { MdOutlinePlaylistAddCheck } from "react-icons/md";

export default function CargaArchivos() {
  const multimediaData = {
    count: 1678,
    size: "19.2 GB",
    images: 1240,
    audio: 438,
    status: "Listo",
  };

  const metadataData = {
    count: 1678,
    size: "45 MB",
    format: "JSON + CSV",
    schema: "CONABIO v2.1",
    status: "Standard",
  };

  const aiData = {
    processed: 1678,
    detections: 3420,
    model: "Nano (TFLite)",
    accuracy: "94.5%",
    status: "Analizado",
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4">
      
      {/* --- TARJETA 1: ARCHIVOS MULTIMEDIA --- */}
      <Card className="flex-1 border-border bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                <Image className="text-blue-500 w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <CardTitle className="text-base truncate">Multimedia</CardTitle>
                <CardDescription className="truncate">Raw Data</CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 gap-1 shrink-0">
              <CloudUpload className="w-3 h-3" /> {multimediaData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-end">
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground font-medium uppercase">Total Archivos</p>
                <p className="text-xl font-bold">{multimediaData.count.toLocaleString()}</p>
              </div>
              <div className="space-y-0.5 text-right">
                <p className="text-[10px] text-muted-foreground font-medium uppercase">Peso</p>
                <p className="text-xl font-bold flex items-center justify-end gap-1">
                  {multimediaData.size}
                  <HardDrive className="text-muted-foreground w-3 h-3" />
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Img ({multimediaData.images})</span>
                  <span>Audio ({multimediaData.audio})</span>
               </div>
               <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-500 w-[74%]" />
                  <div className="h-full bg-purple-500 w-[26%]" />
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- TARJETA 2: METADATOS --- */}
      <Card className="flex-1 border-border bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                <FileJson className="text-amber-500 w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Metadatos</CardTitle>
                <CardDescription>Contexto</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/5 gap-1 shrink-0">
              <Database className="w-3 h-3" /> {metadataData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 mt-2">
             <div className="flex justify-between items-center bg-secondary/20 p-2 rounded border border-border/50">
                <span className="text-xs text-muted-foreground">Schema</span>
                <span className="text-xs font-semibold">{metadataData.schema}</span>
             </div>
             <div className="flex justify-between items-center bg-secondary/20 p-2 rounded border border-border/50">
                <span className="text-xs text-muted-foreground">Formato</span>
                <span className="text-xs font-semibold">{metadataData.format}</span>
             </div>
             <div className="flex justify-between items-center bg-secondary/20 p-2 rounded border border-border/50">
                <span className="text-xs text-muted-foreground">Peso</span>
                <span className="text-xs font-semibold">{metadataData.size}</span>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* --- TARJETA 3: ANÁLISIS DEL MODELO --- */}
      <Card className="flex-1 border-border bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg shrink-0">
                <BrainCircuit className="text-purple-500 w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Modelos IA</CardTitle>
                <CardDescription>Inferencia</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-purple-500/30 text-purple-600 bg-purple-500/5 shrink-0">
              <MdOutlinePlaylistAddCheck className="h-3 w-3"/>{aiData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col gap-4 mt-2">
              <div className="w-full">
                  <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium">Precisión (mAP)</span>
                      <span className="text-xs font-bold text-purple-600">{aiData.accuracy}</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-[94.5%]" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 text-right truncate">Modelo: {aiData.model}</p>
              </div>
              
              <div className="flex gap-4 border-t border-border pt-2 justify-between">
                  <div className="text-center">
                      <p className="text-lg font-bold">{aiData.processed}</p>
                      <p className="text-[10px] text-muted-foreground">Items</p>
                  </div>
                  <div className="text-center">
                      <p className="text-lg font-bold">{aiData.detections}</p>
                      <p className="text-[10px] text-muted-foreground">Detecciones</p>
                  </div>
              </div>
           </div>
        </CardContent>
      </Card>

    </div>
  );
}