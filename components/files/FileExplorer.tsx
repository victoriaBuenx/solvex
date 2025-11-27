"use client"

import { useState } from "react"
import { Folder, Plus, Search, MoreVertical, Edit2, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FileContent from "./FileContent"
import FileTree from "./FileTree"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  path: string
  children?: FileItem[]
  content?: string
}

const INITIAL_FILES: FileItem[] = [
  {
    id: "1",
    name: "ecoedge",
    type: "folder",
    path: "/ecoedge",
    children: [
      {
        id: "1-1",
        name: "backend",
        type: "folder",
        path: "/ecoedge/backend",
        children: [
          {
            id: "1-1-1",
            name: "main.py",
            type: "file",
            path: "/ecoedge/backend/main.py",
            content:
              'from fastapi import FastAPI\nfrom routers import devices, sd, network\n\napp = FastAPI(title="EcoEdge API")\n\napp.include_router(devices.router, prefix="/api/devices")\napp.include_router(sd.router, prefix="/api/sd")\napp.include_router(network.router, prefix="/api/network")\n',
          },
          {
            id: "1-1-2",
            name: "requirements.txt",
            type: "file",
            path: "/ecoedge/backend/requirements.txt",
            content:
              "fastapi\nuvicorn\npydantic\npython-multipart\n",
          },
          {
            id: "1-1-3",
            name: "routers",
            type: "folder",
            path: "/ecoedge/backend/routers",
            children: [
              {
                id: "1-1-3-1",
                name: "devices.py",
                type: "file",
                path: "/ecoedge/backend/routers/devices.py",
                content:
                  'from fastapi import APIRouter\nimport json, os\n\nrouter = APIRouter()\nSTATE_DIR = "/home/hack39/data/system"\n\n@router.get("/")\nasync def list_devices():\n    path = os.path.join(STATE_DIR, "devices.json")\n    if not os.path.exists(path):\n        return {}\n    with open(path) as f:\n        return json.load(f)\n',
              },
              {
                id: "1-1-3-2",
                name: "sd.py",
                type: "file",
                path: "/ecoedge/backend/routers/sd.py",
                content:
                  'from fastapi import APIRouter\nimport json, os\n\nrouter = APIRouter()\nSTATE_DIR = "/home/hack39/data/system"\n\n@router.get("/status")\nasync def sd_status():\n    path = os.path.join(STATE_DIR, "sd_state.json")\n    if not os.path.exists(path):\n        return {"sd_detectada": False, "status": "idle"}\n    with open(path) as f:\n        return json.load(f)\n',
              },
              {
                id: "1-1-3-3",
                name: "network.py",
                type: "file",
                path: "/ecoedge/backend/routers/network.py",
                content:
                  'from fastapi import APIRouter\nimport json, os\n\nrouter = APIRouter()\nSTATE_DIR = "/home/hack39/data/system"\n\n@router.get("/status")\nasync def network_status():\n    path = os.path.join(STATE_DIR, "network_state.json")\n    if not os.path.exists(path):\n        return {"mode": "client", "online": False}\n    with open(path) as f:\n        return json.load(f)\n',
              },
            ],
          },
          {
            id: "1-1-4",
            name: "config.yaml",
            type: "file",
            path: "/ecoedge/backend/config.yaml",
            content:
              "server:\n  host: 0.0.0.0\n  port: 8000\nlogging:\n  level: info\n",
          },
        ],
      },
      {
        id: "1-2",
        name: "frontend",
        type: "folder",
        path: "/ecoedge/frontend",
        children: [
          {
            id: "1-2-1",
            name: "package.json",
            type: "file",
            path: "/ecoedge/frontend/package.json",
            content:
              '{\n  "name": "ecoedge-dashboard",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  }\n}\n',
          },
          {
            id: "1-2-2",
            name: "src",
            type: "folder",
            path: "/ecoedge/frontend/src",
            children: [
              {
                id: "1-2-2-1",
                name: "main.tsx",
                type: "file",
                path: "/ecoedge/frontend/src/main.tsx",
                content:
                  'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport { App } from "./App";\n\nReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n',
              },
              {
                id: "1-2-2-2",
                name: "App.tsx",
                type: "file",
                path: "/ecoedge/frontend/src/App.tsx",
                content:
                  'import React from "react";\nimport { DevicesView } from "./views/DevicesView";\nimport { SdView } from "./views/SdView";\nimport { NetworkView } from "./views/NetworkView";\n\nexport const App = () => {\n  return (\n    <div className="app">\n      <h1>EcoEdge Dashboard</h1>\n      <SdView />\n      <NetworkView />\n      <DevicesView />\n    </div>\n  );\n};\n',
              },
              {
                id: "1-2-2-3",
                name: "views",
                type: "folder",
                path: "/ecoedge/frontend/src/views",
                children: [
                  {
                    id: "1-2-2-3-1",
                    name: "DevicesView.tsx",
                    type: "file",
                    path: "/ecoedge/frontend/src/views/DevicesView.tsx",
                    content:
                      'import React, { useEffect, useState } from "react";\n\nexport const DevicesView: React.FC = () => {\n  const [devices, setDevices] = useState<any>({});\n\n  useEffect(() => {\n    const fetchDevices = async () => {\n      const res = await fetch("/api/devices");\n      const data = await res.json();\n      setDevices(data);\n    };\n    fetchDevices();\n    const id = setInterval(fetchDevices, 3000);\n    return () => clearInterval(id);\n  }, []);\n\n  const entries = Object.entries(devices);\n\n  return (\n    <section>\n      <h2>Dispositivos USB</h2>\n      {entries.length === 0 && <p>No hay dispositivos registrados.</p>}\n      {entries.length > 0 && (\n        <table>\n          <thead>\n            <tr>\n              <th>Dispositivo</th>\n              <th>Conectado</th>\n              <th>Válido</th>\n              <th>Nombre</th>\n              <th>ID</th>\n            </tr>\n          </thead>\n          <tbody>\n            {entries.map(([key, value]: any) => (\n              <tr key={key}>\n                <td>{value.device}</td>\n                <td>{value.connected ? \"Sí\" : \"No\"}</td>\n                <td>{value.valid ? \"Sí\" : \"No\"}</td>\n                <td>{value.config?.name || \"-\"}</td>\n                <td>{value.config?.id || \"-\"}</td>\n              </tr>\n            ))}\n          </tbody>\n        </table>\n      )}\n    </section>\n  );\n};\n',
                  },
                  {
                    id: "1-2-2-3-2",
                    name: "SdView.tsx",
                    type: "file",
                    path: "/ecoedge/frontend/src/views/SdView.tsx",
                    content:
                      'import React, { useEffect, useState } from "react";\n\nexport const SdView: React.FC = () => {\n  const [sd, setSd] = useState<any | null>(null);\n\n  useEffect(() => {\n    const fetchSd = async () => {\n      const res = await fetch("/api/sd/status");\n      const data = await res.json();\n      setSd(data);\n    };\n    fetchSd();\n    const id = setInterval(fetchSd, 2000);\n    return () => clearInterval(id);\n  }, []);\n\n  if (!sd) return <p>Cargando estado de medio...</p>;\n\n  if (!sd.sd_detectada) {\n    return <p>No hay medio de almacenamiento detectado.</p>;\n  }\n\n  return (\n    <section>\n      <h2>Medio de almacenamiento</h2>\n      <p>Estado: {sd.status}</p>\n      {sd.config && (\n        <ul>\n          <li>Nombre: {sd.config.name}</li>\n          <li>ID: {sd.config.id}</li>\n        </ul>\n      )}\n    </section>\n  );\n};\n',
                  },
                  {
                    id: "1-2-2-3-3",
                    name: "NetworkView.tsx",
                    type: "file",
                    path: "/ecoedge/frontend/src/views/NetworkView.tsx",
                    content:
                      'import React, { useEffect, useState } from "react";\n\nexport const NetworkView: React.FC = () => {\n  const [net, setNet] = useState<any | null>(null);\n\n  useEffect(() => {\n    const fetchNet = async () => {\n      const res = await fetch("/api/network/status");\n      const data = await res.json();\n      setNet(data);\n    };\n    fetchNet();\n    const id = setInterval(fetchNet, 5000);\n    return () => clearInterval(id);\n  }, []);\n\n  if (!net) return <p>Cargando red...</p>;\n\n  return (\n    <section>\n      <h2>Estado de red</h2>\n      <p>Modo: {net.mode}</p>\n      <p>En línea: {net.online ? \"Sí\" : \"No\"}</p>\n    </section>\n  );\n};\n',
                  },
                ],
              },
              {
                id: "1-2-2-4",
                name: "styles.css",
                type: "file",
                path: "/ecoedge/frontend/src/styles.css",
                content:
                  "body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  padding: 1rem;\n  background: #050816;\n  color: #f9fafb;\n}\n\nh1 {\n  margin-bottom: 1rem;\n}\n\nsection {\n  margin-bottom: 1.5rem;\n  padding: 1rem;\n  border-radius: 0.5rem;\n  background: #0b1120;\n}\n",
              },
            ],
          },
        ],
      },
      {
        id: "1-3",
        name: "workers",
        type: "folder",
        path: "/ecoedge/workers",
        children: [
          {
            id: "1-3-1",
            name: "usb_worker.py",
            type: "file",
            path: "/ecoedge/workers/usb_worker.py",
            content:
              "# Worker para detección y gestión de dispositivos USB\nimport os, json, time, subprocess\nfrom datetime import datetime, timezone\n\nSTATE_DIR = '/home/hack39/data/system'\nDEVICES_JSON = os.path.join(STATE_DIR, 'devices.json')\n\n# ... implementación recortada para demo\n",
          },
          {
            id: "1-3-2",
            name: "network_worker.py",
            type: "file",
            path: "/ecoedge/workers/network_worker.py",
            content:
              "# Worker para monitoreo de conectividad y modo AP\nimport subprocess, time, json, os\n\nSTATE_DIR = '/home/hack39/data/system'\nNETWORK_JSON = os.path.join(STATE_DIR, 'network_state.json')\n\n# ... implementación recortada para demo\n",
          },
          {
            id: "1-3-3",
            name: "ingestor.py",
            type: "file",
            path: "/ecoedge/workers/ingestor.py",
            content:
              "# Ingestor de datos desde el medio USB hacia el almacenamiento interno\n\nimport shutil, os, json\n\n# ... implementación recortada\n",
          },
        ],
      },
      {
        id: "1-4",
        name: "models",
        type: "folder",
        path: "/ecoedge/models",
        children: [
          {
            id: "1-4-1",
            name: "models.json",
            type: "file",
            path: "/ecoedge/models/models.json",
            content:
              '{\n  "models": [\n    {\n      "name": "Audio aves generico",\n      "image": "ecoedge/model_audio_aves:1.0",\n      "type": "audio",\n      "enabled": true,\n      "default": true,\n      "container_name": "model_audio_aves"\n    },\n    {\n      "name": "Clasificador mamiferos imagen",\n      "image": "ecoedge/model_imagen_mamiferos:1.0",\n      "type": "image",\n      "enabled": false,\n      "default": false,\n      "container_name": "model_img_mamiferos"\n    }\n  ]\n}\n',
          },
          {
            id: "1-4-2",
            name: "README.md",
            type: "file",
            path: "/ecoedge/models/README.md",
            content:
              "# Modelos de IA\n\nEste directorio contiene la definición de modelos desplegados mediante contenedores Docker para ejecutar en el borde.\n",
          },
        ],
      },
      {
        id: "1-5",
        name: "docs",
        type: "folder",
        path: "/ecoedge/docs",
        children: [
          {
            id: "1-5-1",
            name: "arquitectura.md",
            type: "file",
            path: "/ecoedge/docs/arquitectura.md",
            content:
              "# Arquitectura EcoEdge\n\n- Cómputo de borde con Raspberry Pi\n- Workers para USB, red y modelos\n- Backend FastAPI\n- Dashboard web\n",
          },
          {
            id: "1-5-2",
            name: "metodologia.md",
            type: "file",
            path: "/ecoedge/docs/metodologia.md",
            content:
              "# Metodología de desarrollo\n\nSe empleó un enfoque MVP + desarrollo ágil + prototipado rápido, con énfasis en pruebas en campo.\n",
          },
          {
            id: "1-5-3",
            name: "ap_poc_notas.txt",
            type: "file",
            path: "/ecoedge/docs/ap_poc_notas.txt",
            content:
              "- Probar hostapd en segunda Raspberry\n- Documentar SSID, password y rango DHCP\n- Verificar acceso al dashboard desde celular\n",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "data",
    type: "folder",
    path: "/data",
    children: [
      {
        id: "2-1",
        name: "system",
        type: "folder",
        path: "/data/system",
        children: [
          {
            id: "2-1-1",
            name: "devices.json",
            type: "file",
            path: "/data/system/devices.json",
            content:
              '{\n  "sdb1": {\n    "device": "sdb1",\n    "mount_point": "/media/usb_sdb1",\n    "connected": true,\n    "valid": true,\n    "config": {\n      "name": "Camara trampa 1",\n      "id": "TCAM-001",\n      "location": {\n        "description": "Selva baja caducifolia",\n        "lat": 17.1234,\n        "lng": -96.1234\n      }\n    },\n    "last_seen": "2025-11-27T05:10:00Z"\n  }\n}\n',
          },
          {
            id: "2-1-2",
            name: "sd_state.json",
            type: "file",
            path: "/data/system/sd_state.json",
            content:
              '{\n  "sd_detectada": true,\n  "valid": true,\n  "device": "sdb1",\n  "mount_point": "/media/usb_sdb1",\n  "status": "ready",\n  "last_update": "2025-11-27T05:10:05Z"\n}\n',
          },
          {
            id: "2-1-3",
            name: "network_state.json",
            type: "file",
            path: "/data/system/network_state.json",
            content:
              '{\n  "mode": "client",\n  "online": true,\n  "last_change": "2025-11-26T22:00:00Z",\n  "last_update": "2025-11-27T05:10:10Z"\n}\n',
          },
        ],
      },
      {
        id: "2-2",
        name: "projects",
        type: "folder",
        path: "/data/projects",
        children: [
          {
            id: "2-2-1",
            name: "TCAM-001",
            type: "folder",
            path: "/data/projects/TCAM-001",
            children: [
              {
                id: "2-2-1-1",
                name: "raw",
                type: "folder",
                path: "/data/projects/TCAM-001/raw",
                children: [
                  {
                    id: "2-2-1-1-1",
                    name: "IMG_0001.JPG",
                    type: "file",
                    path: "/data/projects/TCAM-001/raw/IMG_0001.JPG",
                    content: "/mock/path/tcam001/IMG_0001.JPG",
                  },
                  {
                    id: "2-2-1-1-2",
                    name: "IMG_0002.JPG",
                    type: "file",
                    path: "/data/projects/TCAM-001/raw/IMG_0002.JPG",
                    content: "/mock/path/tcam001/IMG_0002.JPG",
                  },
                ],
              },
              {
                id: "2-2-1-2",
                name: "processed",
                type: "folder",
                path: "/data/projects/TCAM-001/processed",
                children: [
                  {
                    id: "2-2-1-2-1",
                    name: "detections.json",
                    type: "file",
                    path: "/data/projects/TCAM-001/processed/detections.json",
                    content:
                      '{\n  "IMG_0001.JPG": [{ "species": "Odocoileus virginianus", "confidence": 0.92 }]\n}\n',
                  },
                ],
              },
              {
                id: "2-2-1-3",
                name: "log.txt",
                type: "file",
                path: "/data/projects/TCAM-001/log.txt",
                content:
                  "2025-11-27 05:00:01 - Inicio de ingesta desde sdb1\n2025-11-27 05:02:30 - Copia completada\n2025-11-27 05:05:10 - Procesamiento IA completado\n",
              },
            ],
          },
          {
            id: "2-2-2",
            name: "TCAM-002",
            type: "folder",
            path: "/data/projects/TCAM-002",
            children: [
              {
                id: "2-2-2-1",
                name: "raw",
                type: "folder",
                path: "/data/projects/TCAM-002/raw",
                children: [],
              },
              {
                id: "2-2-2-2",
                name: "processed",
                type: "folder",
                path: "/data/projects/TCAM-002/processed",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "infra",
    type: "folder",
    path: "/infra",
    children: [
      {
        id: "3-1",
        name: "systemd",
        type: "folder",
        path: "/infra/systemd",
        children: [
          {
            id: "3-1-1",
            name: "usbworker.service",
            type: "file",
            path: "/infra/systemd/usbworker.service",
            content:
              "[Unit]\nDescription=USB Worker for EcoEdge\n\n[Service]\nWorkingDirectory=/home/hack39/workers\nExecStart=/usr/bin/python3 /home/hack39/workers/usb_worker.py\nRestart=always\nRestartSec=3\nUser=hack39\n\n[Install]\nWantedBy=multi-user.target\n",
          },
          {
            id: "3-1-2",
            name: "backend.service",
            type: "file",
            path: "/infra/systemd/backend.service",
            content:
              "[Unit]\nDescription=FastAPI backend for EcoEdge\n\n[Service]\nWorkingDirectory=/home/hack39/backend\nExecStart=/usr/bin/uvicorn main:app --host 0.0.0.0 --port 8000\nRestart=always\nRestartSec=3\nUser=hack39\n\n[Install]\nWantedBy=multi-user.target\n",
          },
        ],
      },
      {
        id: "3-2",
        name: "netplan",
        type: "folder",
        path: "/infra/netplan",
        children: [
          {
            id: "3-2-1",
            name: "50-cloud-init.yaml",
            type: "file",
            path: "/infra/netplan/50-cloud-init.yaml",
            content:
              "network:\n  version: 2\n  renderer: networkd\n  ethernets:\n    eth0:\n      dhcp4: true\n",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "scripts",
    type: "folder",
    path: "/scripts",
    children: [
      {
        id: "4-1",
        name: "dev-start.sh",
        type: "file",
        path: "/scripts/dev-start.sh",
        content:
          "#!/usr/bin/env bash\n\n# Levanta backend y frontend en modo desarrollo\n(cd /ecoedge/backend && uvicorn main:app --reload &)\n(cd /ecoedge/frontend && npm run dev &)\n",
      },
      {
        id: "4-2",
        name: "check-status.sh",
        type: "file",
        path: "/scripts/check-status.sh",
        content:
          "#!/usr/bin/env bash\n\necho 'usbworker:'\nsystemctl status usbworker --no-pager -n 2 || true\n\necho 'backend:'\nsystemctl status backend --no-pager -n 2 || true\n",
      },
    ],
  },
];

export default function FileExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>("1-1-1")
  const [files, setFiles] = useState(INITIAL_FILES)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newItemName, setNewItemName] = useState("")

  const findFileById = (items: FileItem[], id: string): FileItem | null => {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children) {
        const found = findFileById(item.children, id)
        if (found) return found
      }
    }
    return null
  }

  const selectedFile = selectedId ? findFileById(files, selectedId) : null

  const filteredFiles = (items: FileItem[]): FileItem[] => {
    if (!searchTerm) return items
    return items
      .filter((item) => {
        const matches = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        if (item.children) {
          const filteredChildren = filteredFiles(item.children)
          return matches || filteredChildren.length > 0
        }
        return matches
      })
      .map((item) => ({
        ...item,
        children: item.children ? filteredFiles(item.children) : item.children,
      }))
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-sidebar flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-9 h-9 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto p-2">
          <FileTree items={filteredFiles(files)} selectedId={selectedId} onSelect={setSelectedId} level={0} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{selectedFile?.path}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {selectedFile ? (
            selectedFile.type === "file" ? (
              <FileContent file={selectedFile} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Folder className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Selecciona un archivo para ver su contenido</p>
                </div>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No hay archivos seleccionados</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
