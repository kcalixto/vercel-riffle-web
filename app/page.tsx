import { fetchAvailableNumbers } from "./actions"
import { RaffleForm } from "@/components/raffle-form"
import { Ticket } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const availableNumbers = await fetchAvailableNumbers()

  return (
    <div className="w-full max-w-lg flex flex-col gap-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary text-primary-foreground">
          <Ticket className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Rifa Online
        </h1>
        <p className="text-sm text-muted-foreground text-pretty max-w-sm">
          Escolha seus numeros da sorte, preencha seus dados e faca o pagamento
          via PIX para confirmar sua participacao.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <RaffleForm availableNumbers={availableNumbers} />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {availableNumbers.length} numero{availableNumbers.length !== 1 ? "s" : ""} disponivel{availableNumbers.length !== 1 ? "is" : ""}
      </p>
    </div>
  )
}
