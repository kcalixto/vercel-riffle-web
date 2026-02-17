import { CopyPixButton } from "@/components/copy-pix-button"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Pagamento - Rifa Online",
  description: "Faca o pagamento via PIX para confirmar sua participacao na rifa.",
}

export default function PagamentoPage() {
  const pixCode = process.env.PIX_CODE || ""

  return (
    <div className="w-full max-w-lg flex flex-col gap-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-success text-success-foreground">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Numeros reservados!
        </h1>
        <p className="text-sm text-muted-foreground text-pretty max-w-sm">
          Seus numeros foram reservados com sucesso. Para confirmar sua
          participacao, faca o pagamento via PIX usando o codigo abaixo.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-card-foreground">
            Codigo PIX (Copia e Cola)
          </h2>
          <p className="text-xs text-muted-foreground">
            Copie o codigo abaixo e cole no app do seu banco para realizar o
            pagamento.
          </p>
        </div>

        <div className="rounded-md bg-muted p-4 break-all text-xs font-mono text-muted-foreground leading-relaxed select-all">
          {pixCode}
        </div>

        <CopyPixButton pixCode={pixCode} />

        <div className="rounded-md bg-accent border border-primary/10 p-4 flex flex-col gap-2">
          <p className="text-xs font-medium text-accent-foreground">
            Importante
          </p>
          <ul className="text-xs text-muted-foreground flex flex-col gap-1 list-disc list-inside">
            <li>Apos o pagamento, sua participacao sera confirmada manualmente.</li>
            <li>O prazo de confirmacao e de ate 24 horas.</li>
            <li>Em caso de duvidas, entre em contato pelo WhatsApp.</li>
          </ul>
        </div>
      </div>

      <Link
        href="/"
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a rifa
      </Link>
    </div>
  )
}
