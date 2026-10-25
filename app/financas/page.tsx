import type { Metadata } from "next";
import { BookOpen, ChartLine, ExternalLink, PiggyBank, ReceiptText, Wallet } from "lucide-react";
import { PageHeader } from "@/components/page-header";

// Aba Finanças (/financas, grupo Serviços): app Domínio Financeiro e o e-book de educação financeira.
export const metadata: Metadata = {
  title: "Finanças | Utilitários CPPEM",
  description: "App Domínio Financeiro para organizar seu dinheiro e o e-book de educação financeira.",
};

const APP_URL = "https://app-dominio-financeiro1.vercel.app/";
const EBOOK_URL = "https://checkout.cppem.com.br/pay/ebook-de-educacao-financeira-01";

const RECURSOS = [
  { Icone: ReceiptText, texto: "Organize seus gastos" },
  { Icone: PiggyBank, texto: "Registre seus investimentos" },
  { Icone: ChartLine, texto: "Acompanhe a evolução do seu patrimônio" },
];

export default function FinancasPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Finanças" eyebrow="Serviços · Grupo CPPEM" title={<>Finanças <span className="text-gold-light">pessoais</span></>} />

      <section className="rounded-2xl border border-line-active bg-surface p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold/10 text-gold-light">
            <Wallet className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="ui-label text-[11px] text-gold">Nosso app</p>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-ink">Domínio Financeiro</h2>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-soft">
          Organize seu dinheiro sem planilha e sem a dúvida de por onde começar. Basta preencher as informações com
          constância e o app mostra para onde vai cada real.
        </p>
        <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-3">
          {RECURSOS.map(({ Icone, texto }) => (
            <li key={texto} className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink">
              <Icone className="h-4 w-4 flex-none text-gold-light" /> {texto}
            </li>
          ))}
        </ul>
        <a href={APP_URL} target="_blank" rel="noopener" className="gold-button ui-label mt-5 inline-flex min-h-11 items-center gap-2 rounded-md px-4">
          <ExternalLink className="h-4 w-4" />
          <span className="text-xs">Abrir o Domínio Financeiro</span>
        </a>
      </section>

      <h2 className="eyebrow mb-3 mt-8">Recomendação de leitura</h2>
      <a
        href={EBOOK_URL}
        target="_blank"
        rel="noopener"
        className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-line-active sm:flex-row sm:items-center sm:p-5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/servicos/ebook-educacao-financeira.jpg"
          alt="Capa do e-book Domínio Financeiro: gerencie seu dinheiro e viva bem"
          width={256}
          height={256}
          className="mx-auto h-44 w-44 flex-none rounded-xl object-cover sm:mx-0 sm:h-40 sm:w-40"
        />
        <span className="min-w-0 flex-1">
          <span className="ui-label block text-[11px] text-gold">E-book · Educação financeira</span>
          <span className="mt-1 block font-display text-xl font-bold uppercase leading-tight tracking-tight text-ink">
            Domínio Financeiro: gerencie seu dinheiro e viva bem
          </span>
          <span className="mt-2 block text-sm leading-relaxed text-soft">
            Um guia prático para transformar sua relação com o dinheiro e caminhar rumo à liberdade financeira.
          </span>
          <span className="gold-button ui-label mt-4 inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">Quero o e-book</span>
          </span>
        </span>
      </a>
    </main>
  );
}
