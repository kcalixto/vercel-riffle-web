"use client"

import { useState, useTransition } from "react"
import { submitRaffle } from "@/app/actions"
import { NumberPicker } from "./number-picker"
import { Loader2 } from "lucide-react"

interface RaffleFormProps {
  availableNumbers: number[]
}

export function RaffleForm({ availableNumbers }: RaffleFormProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)

    if (selectedNumbers.length === 0) {
      setError("Selecione pelo menos um numero.")
      return
    }

    formData.set("numbers", selectedNumbers.join(","))

    startTransition(async () => {
      const result = await submitRaffle(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="nome" className="text-sm font-medium text-foreground">
          Nome completo
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          placeholder="Seu nome completo"
          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="whatsapp" className="text-sm font-medium text-foreground">
          WhatsApp
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          placeholder="(11) 99999-9999"
          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <NumberPicker
        availableNumbers={availableNumbers}
        selected={selectedNumbers}
        onSelectionChange={setSelectedNumbers}
      />

      {error && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || selectedNumbers.length === 0}
        className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Reservando...
          </>
        ) : (
          "Gerar link de pagamento"
        )}
      </button>
    </form>
  )
}
