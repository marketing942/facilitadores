import type { Metadata } from "next";
import Link from "next/link";
import CalculadoraTon from "@/components/CalculadoraTon";

export const metadata: Metadata = {
  title: "Calculadora Maquineta TON | Time Comercial",
  description:
    "Simule taxas da maquineta TON por plano (Super, Turbo, Max) e forma de pagamento — Pix, débito e crédito parcelado.",
};

export default function CalculadoraTonPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-ink-soft">
        <Link href="/" className="-my-2 py-2 transition-colors hover:text-ink">
          Início
        </Link>
        <svg className="h-4 w-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium text-ink">Calculadora Maquineta TON</span>
      </nav>

      <div className="mb-6">
        <div className="eyebrow mb-3">Ferramenta</div>
        <h1 className="page-title text-2xl">Calculadora Maquineta TON</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Digite o valor do produto, escolha o plano TON e veja o que você recebe líquido em Pix, débito e crédito
          parcelado — com o valor de cada parcela que o cliente vai pagar.
        </p>
      </div>

      <CalculadoraTon />
    </main>
  );
}
