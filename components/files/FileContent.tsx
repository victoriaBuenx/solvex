"use client"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  path: string
  content?: string
}

interface FileContentProps {
  file: FileItem
}

export default function FileContent({ file }: FileContentProps) {
  const isCode =
    file.name.endsWith(".tsx") || file.name.endsWith(".ts") || file.name.endsWith(".js") || file.name.endsWith(".css")
  const isMarkdown = file.name.endsWith(".md")
  const isImage =
    file.name.endsWith(".png") ||
    file.name.endsWith(".jpg") ||
    file.name.endsWith(".jpeg") ||
    file.name.endsWith(".gif") ||
    file.name.endsWith(".webp") ||
    file.name.endsWith(".svg")

  return (
    <div className="h-full flex flex-col bg-background">
      {/* File Info */}
      <div className="px-6 py-4 border-b border-border">
        <p className="text-sm font-medium text-foreground">{file.name}</p>
        <p className="text-xs text-muted-foreground mt-1">{file.path}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isCode ? (
          <pre className="bg-muted p-4 rounded-lg border border-border overflow-auto">
            <code className="text-sm text-foreground font-mono">{file.content}</code>
          </pre>
        ) : isMarkdown ? (
          <div className="prose prose-sm max-w-none text-foreground">
            {file.content?.split("\n").map((line, i) => (
              <p key={i} className="mb-2">
                {line.startsWith("#") ? (
                  <span className="font-bold text-lg">{line.replace("#", "").trim()}</span>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
        ) : isImage ? (
          <div className="flex items-center justify-center h-full">
            <div className="max-w-2xl w-full">
              <img
                src={file.content || "/placeholder.svg?height=400&width=600&query=preview"}
                alt={file.name}
                className="w-full rounded-lg border border-border shadow-sm"
              />
            </div>
          </div>
        ) : (
          <div className="text-foreground whitespace-pre-wrap font-mono text-sm">{file.content}</div>
        )}
      </div>
    </div>
  )
}
