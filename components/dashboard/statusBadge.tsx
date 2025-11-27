import { Badge } from "@/components/ui/badge"
import { Wifi } from "lucide-react";
import { TbAccessPoint } from "react-icons/tb";

interface StatusBadgeProps {
  mode: "wifi" | "ap";
}

export function StatusBadge({ mode }: StatusBadgeProps) {
  const isWifi = mode === "wifi";

  return (
    <Badge
      variant="outline"
      className={
        isWifi
          ? "px-3 py-1 text-sm rounded-md bg-blue-500/20 text-blue-700 border-blue-500/30 "
          : "px-3 py-1 text-sm rounded-md bg-amber-500/20 text-amber-600 border-amber-500/30"
      }
    >
      {isWifi ? (
        <>
          <Wifi className="w-10 h-10" />
          Modo WiFi
        </>
      ) : (
        <>
          <TbAccessPoint className="w-10 h-10" />
          Modo AP
        </>
      )}
    </Badge>
  );
}
