import type { Metadata } from "next";
import Link from "next/link";
import CalculadoraStone from "@/components/CalculadoraStone";

export const metadata: Metadata = {
  title: "Calculadora Guru + Stone | Utilitários CPPEM",
  description: "Simule juros, parcelas e valor líquido recebido via Guru + Stone",
};

export default function CalculadoraPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-ink-soft">
        <Link href="/" className="-my-2 py-2 transition-colors hover:text-ink">
          Início
        </Link>
        <svg className="h-4 w-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium text-ink">Calculadora Guru + Stone</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <div className="eyebrow mb-3">Ferramenta</div>
        <h1 className="page-title text-2xl">Calculadora de Parcelas — Guru + Stone</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Preencha o valor do produto e a taxa de juros para ver a simulação completa de parcelas, repasse de juros e
          o valor líquido que você recebe.
        </p>
      </div>

      <CalculadoraStone />
    </main>
  );
}
