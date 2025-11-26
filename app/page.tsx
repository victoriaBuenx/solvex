"use client";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import SDProgressPanel from "@/components/dashboard/sd-progress-panel";
import RecordsPanel from "@/components/dashboard/records-panel";
import ModelResultsPanel from "@/components/dashboard/model-results-panel";
import SystemLogsPanel from "@/components/dashboard/system-logs-panel";
import AnomaliesPanel from "@/components/dashboard/anomalies-panel";
import { DeviceCard } from "@/components/ui/deviceCard";
import { MdOutlineSdStorage } from "react-icons/md";
import { CiUsb } from "react-icons/ci";
import { AiOutlineUsb } from "react-icons/ai";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeviceCardGroups from "@/components/dashboard/DeviceCardGroups";

const POLLING_RATE = 3000;
const API_URL = "http://10.156.124.132:8000/api/devices"


import ModelsPanel from "@/components/dashboard/models";

export default function DashboardPage() {
  const fetchDevices = async() => {
  try {
    const response = await fetch(API_URL)

    if(!response.ok) {
      throw new Error('Error HTTP')
    }

    const data = await response.json()
    console.log("Datos de dispositivos:", data)
    setDevices(data)

  } catch (err) {
    console.error("Fallo al obtener estado")
  }
}

  const [activeTab, setActiveTab] = useState("sync");
  useEffect(() => {
  // hacer peticion a la api
  fetchDevices()

  const interval = setInterval(() => {
    fetchDevices()
  }
  , POLLING_RATE)

  return () => clearInterval(interval)
}, [])

const [devices, setDevices] = useState();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance mb-2">
                BioEdge
              </h1>
              <p className="text-muted-foreground">
                Panel de control para ingesta de datos, procesamiento y
                monitoreo
              </p>
            </div>

            <ThemeToggle />
          </div>

          <div className="flex flex-row gap-2 mb-8 justify-between w-full">
            <div className="flex gap-2 w-full">
              

              <DeviceCardGroups devices={devices} />
    
               
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "sync" && (
            <>
              <div className="flex flex-row gap-2 mb-8 justify-between w-full">
                <div className="flex gap-2 w-full">
                  
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <SDProgressPanel />
                  <RecordsPanel />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ModelResultsPanel />
                  </div>
                  <AnomaliesPanel />
                </div>
              </div>
            </>
          )}

          {activeTab === "logs" && (
            <div>
              <SystemLogsPanel />
            </div>
          )}

          {activeTab === "anomalies" && (
            <div>
              <AnomaliesPanel />
            </div>
          )}

          {activeTab === "system-info" && (
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
                        <p className="font-semibold text-lg">Raspberry Pi 4B</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          CPU
                        </p>
                        <p className="font-semibold">
                          ARM Cortex-A72 4x 1.5GHz
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
                        <p className="font-semibold">45 días, 12 horas</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Temperatura
                        </p>
                        <p className="font-semibold text-blue-400">52.3°C</p>
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
                      <div className="flex justify-between text-muted-foreground">
                        <span>python-ai-model</span>
                        <span>18.5% CPU</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>sd-sync-service</span>
                        <span>8.2% CPU</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>data-processor</span>
                        <span>5.1% CPU</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>logger-daemon</span>
                        <span>1.3% CPU</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === "models" && (
            <div>
              <ModelsPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
