"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react";
import Gallery from "./gallery";
import { useState } from "react";

export default function ModelsPanel() {
  const Modeloptions = ["Modelo BirdNet"];
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState("");
  const logs = [
    {
      id: 1,
      timestamp: "14:32:15",
      type: "info",
      message: "SD insertada: SanDisk Ultra 64GB",
      icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    },
  ];

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Modelos disponibles para acceso</CardTitle>
        <CardDescription>Galería de modelos añadidos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Modeloptions.map((nombre, index) => (
            <button
              key={index}
              onClick={() => {
                setOpen(true);
                setItem(nombre);
              }}
              className="w-full text-left p-3 bg-muted/20 border border-border rounded-lg hover:bg-muted/30 transition"
            >
              <p className="text-sm font-medium">{nombre}</p>
            </button>
          ))}
        </div>
        <Gallery open={open} onOpenChange={setOpen} title={item} />
      </CardContent>
    </Card>
  );
}
