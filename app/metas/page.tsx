import type { Metadata } from "next";
import { CalendarCheck, Dumbbell, ExternalLink, NotebookPen, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Metas e organização pessoal | Utilitários CPPEM",
  description: "App Life Board para metas anuais, rotina de treino, anotações por área da vida e evolução.",
};

const APP_URL = "https://app-life-board.vercel.app/";

const RECURSOS = [
  { Icone: Target, texto: "Metas do ano" },
  { Icone: Dumbbell, texto: "Rotina de treino semanal" },
  { Icone: NotebookPen, texto: "Anotações para cada área da vida" },
  { Icone: TrendingUp, texto: "Acompanhe sua evolução" },
];

export default function MetasPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader
        crumb="Metas e organização"
        eyebrow="Serviços · Grupo CPPEM"
        title={<>Metas e <span className="text-gold-light">organização pessoal</span></>}
      />

      <section className="rounded-2xl border border-line-active bg-surface p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold/10 text-gold-light">
            <CalendarCheck className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="ui-label text-[11px] text-gold">Nosso app</p>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-ink">Life Board</h2>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-soft">
          Coloque suas metas do ano, monte a rotina de treino da semana, faça anotações para cada área da vida e veja
          sua evolução, tudo num lugar só.
        </p>
        <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
          {RECURSOS.map(({ Icone, texto }) => (
            <li key={texto} className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink">
              <Icone className="h-4 w-4 flex-none text-gold-light" /> {texto}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-soft">
          Idealizado e recomendado por <strong className="font-semibold text-gold-pale">Itallo Mota</strong>.
        </p>
        <a href={APP_URL} target="_blank" rel="noopener" className="gold-button ui-label mt-5 inline-flex min-h-11 items-center gap-2 rounded-md px-4">
          <ExternalLink className="h-4 w-4" />
          <span className="text-xs">Abrir o Life Board</span>
        </a>
      </section>
    </main>
  );
}
