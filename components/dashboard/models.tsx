"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, Container, Zap } from "lucide-react";
import Gallery from "./gallery";
import { useState } from "react";

export default function ModelsPanel() {
  const MODELS = [
    {
      name: "Clasificador de especies de aves",
      type: "Imagen",
      state: "Inactivo",
      container: "docker-model-birdnet-lite",
      inferences: 233,
      accuracy: "92.3%",
      images: [
        {
      id: 1,
      title: "Guacamaya Roja",
      // Foto vibrante de Zdeněk Macháček
      image:
        "https://elements-resized.envatousercontent.com/elements-video-cover-images/fbb5daa3-ee95-4fb4-a4c8-925ed36bc793/video_preview/video_preview_0000.jpg?w=500&cf_fit=cover&q=85&format=auto&s=8bfe862bc3b68e12e4e5a11e650ae65ca3d18fa0d13378f7954ce8787a3a4695",
    },
    {
      id: 2,
      title: "Águila Real",
      image:
        "https://imagenes.elpais.com/resizer/v2/2CY4RIANFBBAHCSBEPZVNZ5BG4.JPG?auth=2b2630b9e69bd538c70724515c85ded5d3b1b258ea5a69c0332c9390d1939211&width=414",
    },
    {
      id: 3,
      title: "Colibrí",
      image:
        "https://elements-resized.envatousercontent.com/elements-video-cover-images/d50d9581-6f62-4f05-ad11-721a949185f7/video_preview/video_preview_0000.jpg?w=500&cf_fit=cover&q=85&format=auto&s=8575049fb216e16876db705e46a7e3c3c14cce28e67dd42f80e16c049c616da7",
    },
    {
      id: 4,
      title: "Tucán",
      image:
        "https://www.lavanguardia.com/files/image_990_484/uploads/2014/08/06/5f9c1a60be34b.jpeg",
    },
    {
      id: 5,
      title: "Búho Nival",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgriXiA-CZRKYD1agB3SFEqJUWbATWtEuuogfDxhAyDJZvz_0aD9OAA54o92Ve2T2Ichl83EGFUzPtlGk5ML6ul1i4gGxVbi5bSsE7KlZ4yULj_Sic-7f-olbUVpLTAa0n6-fCrstnGb08/s2100/B%25C3%25BAho+nival+14.jpg ",
    },
    {
      id: 6,
      title: "Flamenco",
      image:
        "https://www.excelsior.com.mx/770x530/filters:format(webp):quality(75)/media/pictures/2024/11/25/3218106.jpg",
    },
    {
      id: 7,
      title: "Pavo Real",
      image:
        "https://www.pavorealpedia.com/wp-content/uploads/2016/04/pavo-real-1.jpg",
    },
    {
      id: 8,
      title: "Pingüino Real",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRryUxvhhuAPrjwCS5D3da4-rxyNv2hc0DCvA&s",
    },
    {
      id: 9,
      title: "Cardenal",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWqYQznlRQzueVDvVhNXWqAMkg2AKbczHlnX36wgP7wN2ORtvapMkpSSQrnDIwLaLcU24&usqp=CAU",
    },
      ]
    },
    {
      name: "Clasificador de mamíferos terrestres",
      type: "Imagen",
      state: "Activo",
      container: "docker-model-mammals-edge",
      inferences: 42,
      accuracy: "89.7%",
      images: [
        {
          id: 1,
          title: "Venado Cola Blanca",
          image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Whitetail_deer.jpg",
        },
        {
          id: 2,
          title: "Ocelote",
          image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Ocelot_%28Leopardus_pardalis%29.jpg",
        },
        {
          id: 3,
          title: "Jaguar",
          image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Standing_jaguar.jpg",
        },
        {
          id: 4,
          title: "Tlacuache",
          image: "https://upload.wikimedia.org/wikipedia/commons/4/48/Opossum_2.jpg",
        },
        {
          id: 5,
          title: "Puma",
          image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Puma_Face.jpg",
        },
        {
          id: 6,
          title: "Armadillo",
          image: "https://upload.wikimedia.org/wikipedia/commons/3/32/Armadillo_%28Dasypus_novemcinctus%29.jpg",
        },
      ]
    },
    {
      name: "Reconocimiento acústico de cantos de aves",
      type: "Audio",
      state: "Inactivo",
      container: "docker-model-sonidos-aves",
      inferences: 43,
      accuracy: "87.1%",
      images: [
        {
          id: 1,
          title: "Colibrí",
          image: "https://wordpress11997.wordpress.com/wp-content/uploads/2020/02/1a-colibri-orejivioleta-verde-canto.jpg"
        },
        {
          id: 2,
          title: "Tecolote",
          image: "/audio/samples/tecolote_002.wav"
        },
        {
          id: 3,
          title: "Zanate mexicano",
          image: "/audio/samples/zanate_003.wav"
        },
        {
          id: 4,
          title: "Cenzontle",
          image: "/audio/samples/cenzontle_004.wav"
        }
      ]
    }

  ];
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
          {MODELS.map((model) => (
            <div key={model.name}>
              <button
                onClick={() => {
                  setOpen(true);
                  setItem(model.name);
                }}
                className="w-full text-left p-3 bg-muted/20 border border-border rounded-lg hover:bg-muted/30 transition flex justify-between"
              >
                <div>
                <p className="text-md font-medium">{model.name}</p>
                <p className="text-sm text-muted-foreground">Tipo: {model.type} • Estado: {model.state}</p>
                </div>
                <Container className="size-6 text-gray-500" />
              </button>
            </div>
          ))}

          {/* Render a single Gallery for the selected model to avoid multiple modals opening */}
          {(() => {
            const selected = MODELS.find(m => m.name === item)
            if (!selected) return null
            return (
              <Gallery
                open={open}
                onOpenChange={(v) => {
                  setOpen(v)
                  if (!v) setItem("")
                }}
                name={selected.name}
                type={selected.type}
                state={selected.state}
                container={selected.container}
                inferences={selected.inferences}
                accuracy={selected.accuracy}
                images={selected.images}
              />
            )
          })()}
        </div>
      </CardContent>
    </Card>
  );
}
