import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

type DeviceStatus = "montada" | "error" | "inactiva";

interface DeviceCardProps {
  sd_detectada: boolean;
  valid: boolean;
  device_id: string;
  device_name: string;
  location: string;
  status: DeviceStatus;
  className?: string;
  icon?: React.ReactNode;
}

const statusColors = {
  montada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  error: "bg-red-100 text-black-100 dark:bg-black-900 dark:text-black-200",
  inactiva: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

export function DeviceCard({
  sd_detectada,
  valid,
  device_id,
  device_name,
  location,
  status,
  className,
  icon,
  ...props
}: DeviceCardProps) {
  if (status === "inactiva") {
    return (
      <Card
        className={cn(
          "w-full max-w-sm overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-8",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-12 w-12 flex items-center justify-center">
            {icon || (
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <div className="h-6 w-6 text-muted-foreground">{icon}</div>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">Inactivo</p>
        </div>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card
        className={cn(
          "w-full max-w-sm overflow-hidden bg-red-100 dark:bg-red-900/30 flex items-center justify-center p-8",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="h-12 w-12 flex items-center justify-center">
            {icon || (
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <div className="h-6 w-6 text-red-500 dark:text-red-400">
                  {icon}
                </div>
              </div>
            )}
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
            Error
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn("w-full max-w-sm overflow-hidden", className)}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 ">
            <div className="flex items-center h-10 w-10 p-2 ">{icon}</div>
            <CardTitle className="text-lg font-medium">{device_name}</CardTitle>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusColors[status] || statusColors.inactiva
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <CardDescription className="text-sm">{device_id}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Ubicación</p>
            <p className="font-medium">{location}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tarjeta SD</p>
            <p
              className={cn(
                "font-medium",
                sd_detectada
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {sd_detectada ? "Detectada" : "No detectada"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Estado</p>
            <p
              className={cn(
                "font-medium",
                valid
                  ? "text-green-600 dark:text-green-400"
                  : "text-yellow-600 dark:text-yellow-400"
              )}
            >
              {valid ? "Válido" : "Necesita atención"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
