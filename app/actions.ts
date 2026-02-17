"use server"

import { getAvailableNumbers, reserveNumbers } from "@/lib/sheets"
import { redirect } from "next/navigation"

export async function fetchAvailableNumbers(): Promise<number[]> {
  return getAvailableNumbers()
}

export async function submitRaffle(formData: FormData) {
  const nome = formData.get("nome") as string
  const whatsapp = formData.get("whatsapp") as string
  const numbersRaw = formData.get("numbers") as string

  if (!nome || !nome.trim()) {
    return { error: "Nome completo e obrigatorio." }
  }

  if (!whatsapp || !whatsapp.trim()) {
    return { error: "Numero de WhatsApp e obrigatorio." }
  }

  if (!numbersRaw) {
    return { error: "Selecione pelo menos um numero." }
  }

  const numbers = numbersRaw
    .split(",")
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !isNaN(n))

  if (numbers.length === 0) {
    return { error: "Selecione pelo menos um numero." }
  }

  const result = await reserveNumbers(numbers, nome.trim(), whatsapp.trim())

  if (!result.success) {
    return { error: result.error || "Erro ao reservar numeros." }
  }

  redirect("/pagamento")
}
