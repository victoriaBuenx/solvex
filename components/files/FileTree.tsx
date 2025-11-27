"use client"

import { useState } from "react"
import { ChevronRight, Folder, FileText, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  path: string
  children?: FileItem[]
}

interface FileTreeProps {
  items: FileItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  level: number
}

export default function FileTree({ items, selectedId, onSelect, level }: FileTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["1", "1-1"]))

  const getFileIcon = (name: string) => {
    const isImage =
      name.endsWith(".png") ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".gif") ||
      name.endsWith(".webp") ||
      name.endsWith(".svg")

    if (isImage) {
      return <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />
    }
    return <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => {
              if (item.type === "folder") {
                toggleExpanded(item.id)
              }
              onSelect(item.id)
            }}
            className={cn(
              "w-full flex items-center gap-1 px-2 py-1.5 rounded-md transition-colors text-sm",
              selectedId === item.id
                ? "bg-accent text-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            {item.type === "folder" ? (
              <>
                <ChevronRight
                  className={cn("w-4 h-4 transition-transform shrink-0", expanded.has(item.id) && "rotate-90")}
                />
                <Folder className="w-4 h-4 text-primary shrink-0" />
              </>
            ) : (
              <>
                <div className="w-4 shrink-0" />
                {getFileIcon(item.name)}
              </>
            )}
            <span className="truncate flex-1 text-left">{item.name}</span>
          </button>

          {item.type === "folder" && expanded.has(item.id) && item.children && (
            <FileTree items={item.children} selectedId={selectedId} onSelect={onSelect} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  )
}
