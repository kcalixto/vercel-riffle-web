"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface CopyPixButtonProps {
  pixCode: string
}

export function CopyPixButton({ pixCode }: CopyPixButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = pixCode
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Codigo copiado!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copiar codigo PIX
        </>
      )}
    </button>
  )
}
