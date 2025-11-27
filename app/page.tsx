"use client";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import SDProgressPanel from "@/components/dashboard/sd-progress-panel";
import RecordsPanel from "@/components/dashboard/records-panel";
import ModelResultsPanel from "@/components/dashboard/model-results-panel";
import SystemLogsPanel from "@/components/dashboard/system-logs-panel";
import AnomaliesPanel from "@/components/dashboard/anomalies-panel";
import carga_archivos from "@/components/dashboard/carga_archivos";
import { DeviceCard } from "@/components/ui/deviceCard";
import { MdOutlineSdStorage } from "react-icons/md";
import { CiUsb } from "react-icons/ci";
import { AiOutlineUsb } from "react-icons/ai";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeviceCardGroups from "@/components/dashboard/DeviceCardGroups";

const POLLING_RATE = 3000;
const API_URL = "http://10.67.254.132:8000/api/devices"


import ModelsPanel from "@/components/dashboard/models";
import CargaArchivos from "@/components/dashboard/carga_archivos";
import { StatusBadge } from "@/components/dashboard/statusBadge";
import FileManager from "@/components/dashboard/FileManager";
import { SettingsPage } from "@/components/dashboard/SettingsPage";

export default function DashboardPage() {
  const fetchDevices = async() => {
  try {
    const response = await fetch(API_URL)

    if(!response.ok) {
      throw new Error('Error HTTP')
    }

    const data = await response.json()
    console.log(data)
    console.log(Object.keys(data).length)
    setDevices(data)
    if(Object.keys(data).length > 0) {
      setEmpty(false)
    }

  } catch (err) {
    console.error("Fallo al obtener estado" + err)
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
const [empty, setEmpty] = useState(true)

  // Estado para temperatura y procesos activos (valores dinámicos)
  const [temperature, setTemperature] = useState(52.3)
  const [processes, setProcesses] = useState([
    { name: "python-ai-model", cpu: 18.5 },
    { name: "sd-sync-service", cpu: 8.2 },
    { name: "data-processor", cpu: 5.1 },
    { name: "logger-daemon", cpu: 1.3 },
  ])

  useEffect(() => {
    const id = setInterval(() => {
      // Actualizar temperatura con pequeña variación (-0.5..+0.5)
      setTemperature(prev => {
        const delta = (Math.random() - 0.5) * 1.0
        let next = Math.round((prev + delta) * 10) / 10
        if (next < 25) next = 25
        if (next > 90) next = 90
        return next
      })

      // Actualizar procesos: variación pequeña (-1..+1)
      setProcesses(prev => prev.map(p => {
        const delta = (Math.random() - 0.5) * 2
        let next = Math.round((p.cpu + delta) * 10) / 10
        if (next < 0) next = 0
        if (next > 100) next = 100
        return { ...p, cpu: next }
      }))
    }, 1500)

    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-foreground md:pl-64">
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
            <div className="flex items-center gap-4">
              <StatusBadge mode="wifi" />
              <ThemeToggle />
              </div>
            </div>

         

          {/* Tab Content */}
          {activeTab === "sync" && (
            <>
              <div className="flex flex-row gap-2 mb-2 justify-between w-full">
                <div className="flex gap-2 w-full">
                  <DeviceCardGroups devices={devices} />
                </div>
              </div>
              <div className="flex flex-row gap-2 mb-8 justify-between w-full">
                <div className="flex gap-2 w-full">
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <SDProgressPanel empty={empty} />
                  <RecordsPanel empty={empty} />
                </div>
                {/*Div de la carga de archvios */}
                <div className="mb-5">
                  <CargaArchivos />
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
            <SettingsPage />
          )}
          {activeTab === "models" && (
            <div>
              <ModelsPanel />
            </div>
          )}
          {activeTab === "files" && (
            <div>
              <FileManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
