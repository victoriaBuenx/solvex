"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Activity, AlertTriangle, HardDrive, Info } from "lucide-react"
import SDProgressPanel from "./sd-progress-panel"
import RecordsPanel from "./records-panel"
import ModelResultsPanel from "./model-results-panel"
import SystemLogsPanel from "./system-logs-panel"
import AnomaliesPanel from "./anomalies-panel"
import SystemInfoPanel from "./system-info-panel"

export default function DashboardNavigation() {
  return (
    <Tabs defaultValue="sincronizacion" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="sincronizacion" className="flex items-center gap-2">
          <HardDrive className="w-4 h-4" />
          <span className="hidden sm:inline">Sincronización</span>
        </TabsTrigger>
        <TabsTrigger value="logs" className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline">Logs</span>
        </TabsTrigger>
        <TabsTrigger value="anomalias" className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="hidden sm:inline">Anomalías</span>
        </TabsTrigger>
        <TabsTrigger value="sistema" className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span className="hidden sm:inline">Sistema</span>
        </TabsTrigger>
      </TabsList>

      {/* Sincronización Tab */}
      <TabsContent value="sincronizacion" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SDProgressPanel />
          <RecordsPanel />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ModelResultsPanel />
          </div>
          <AnomaliesPanel />
        </div>
      </TabsContent>

      {/* Logs Tab */}
      <TabsContent value="logs">
        <SystemLogsPanel />
      </TabsContent>

      {/* Anomalías Tab */}
      <TabsContent value="anomalias">
        <AnomaliesPanel />
      </TabsContent>

      {/* Sistema Tab */}
      <TabsContent value="sistema">
        <SystemInfoPanel />
      </TabsContent>
    </Tabs>
  )
}
