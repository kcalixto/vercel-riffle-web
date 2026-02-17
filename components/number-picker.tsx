"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface NumberPickerProps {
  availableNumbers: number[]
  selected: number[]
  onSelectionChange: (numbers: number[]) => void
}

export function NumberPicker({
  availableNumbers,
  selected,
  onSelectionChange,
}: NumberPickerProps) {
  const [search, setSearch] = useState("")

  const allNumbers = Array.from({ length: 200 }, (_, i) => i + 1)

  const filteredNumbers = search
    ? allNumbers.filter((n) => n.toString().includes(search))
    : allNumbers

  function toggleNumber(num: number) {
    if (!availableNumbers.includes(num)) return
    if (selected.includes(num)) {
      onSelectionChange(selected.filter((n) => n !== num))
    } else {
      onSelectionChange([...selected, num])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-foreground">
          Escolha seus numeros
        </label>
        {selected.length > 0 && (
          <span className="text-xs font-medium text-primary bg-accent px-2 py-1 rounded-md">
            {selected.length} selecionado{selected.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <input
        type="text"
        placeholder="Buscar numero..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-card border border-border" />
          Disponivel
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
          Selecionado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-muted" />
          Indisponivel
        </span>
      </div>

      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 md:grid-cols-10 max-h-[360px] overflow-y-auto p-1 rounded-lg border border-border bg-card">
        {filteredNumbers.map((num) => {
          const isAvailable = availableNumbers.includes(num)
          const isSelected = selected.includes(num)

          return (
            <button
              key={num}
              type="button"
              disabled={!isAvailable}
              onClick={() => toggleNumber(num)}
              aria-label={`Numero ${num}${!isAvailable ? ", indisponivel" : isSelected ? ", selecionado" : ", disponivel"}`}
              className={cn(
                "flex items-center justify-center rounded-md text-xs font-medium h-9 w-full transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isAvailable
                    ? "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border border-border"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              )}
            >
              {num}
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {selected
            .sort((a, b) => a - b)
            .map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => toggleNumber(num)}
                className="flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-2 py-1 text-xs font-medium hover:opacity-80 transition-opacity"
              >
                {num}
                <span aria-hidden="true" className="text-primary-foreground/70">x</span>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
