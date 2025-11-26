"use client";

import type React from "react";
import { Activity, AlertTriangle, HardDrive, Info, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: NavTab[] = [
  {
    id: "sync",
    label: "Sincronización",
    icon: <HardDrive className="w-5 h-5" />,
  },
  {
    id: "logs",
    label: "Logs",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    id: "anomalies",
    label: "Anomalías",
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  {
    id: "system-info",
    label: "Sistema",
    icon: <Info className="w-5 h-5" />,
  },
  {
    id: "models",
    label: "Modelos",
    icon: <Bot className="w-5 h-5" />,
  },
];

export default function SidebarNav({
  activeTab,
  onTabChange,
}: SidebarNavProps) {
  return (
    <nav className="w-full md:w-64 bg-card/50 backdrop-blur border-b md:border-r border-border p-4 md:p-6 space-y-2 md:min-h-screen">
      <h2 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wide">
        Navegación
      </h2>
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap md:whitespace-normal font-medium text-sm",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <span className="flex-shrink-0">{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
