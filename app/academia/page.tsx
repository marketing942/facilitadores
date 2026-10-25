import type { Metadata } from "next";
import { Activity, Bike, Check, Dumbbell, HeartPulse, MapPin, Navigation, Timer } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { BENEFICIO, CARUARU, rotaUrl } from "@/config/academia";
import MaisPerto from "./mais-perto";

// Aba Academia (/academia, grupo Serviços): Plano Selfit e unidades de Caruaru. Dados em config/academia.ts.
export const metadata: Metadata = {
  title: "Academia: Selfit | Utilitários CPPEM",
  description: "Plano Plus Corporativo Selfit para alunos e colaboradores do CPPEM, com a unidade mais perto de você.",
};

const ICONES = [
  { Icone: Dumbbell, cls: "left-[5%] top-[16%] h-16 w-16 -rotate-12 sm:h-24 sm:w-24" },
  { Icone: HeartPulse, cls: "left-[24%] bottom-[8%] h-10 w-10 sm:h-14 sm:w-14" },
  { Icone: Activity, cls: "right-[22%] top-[10%] h-12 w-12 sm:h-16 sm:w-16" },
  { Icone: Bike, cls: "right-[5%] bottom-[12%] h-14 w-14 rotate-6 sm:h-20 sm:w-20" },
  { Icone: Timer, cls: "right-[42%] bottom-[6%] hidden h-12 w-12 sm:block" },
];

export default function AcademiaPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Academia" eyebrow="Serviços · Grupo CPPEM" title={<>Academia <span className="text-gold-light">Selfit</span></>} />

      <section className="mb-6 overflow-hidden rounded-2xl border border-line">
        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#4a1712_0%,#22100c_45%,#0b0908_100%)] sm:h-56 md:h-64">
          {ICONES.map(({ Icone, cls }, i) => (
            <Icone key={i} aria-hidden strokeWidth={1.3} className={`absolute text-gold/25 ${cls}`} />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_55%,rgba(240,220,176,.16),transparent_70%)]" />
          <div className="relative px-4 text-center">
            <p className="ui-label text-xs text-gold-light">Parceria CPPEM + Selfit</p>
            <p className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-gold-pale sm:text-5xl">Treine com desconto</p>
            <p className="mt-2 text-sm text-soft sm:text-base">{BENEFICIO.abrangencia}</p>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-xl border border-line-active bg-gold/5 p-4 sm:p-6">
          <p className="ui-label text-[11px] text-gold">{BENEFICIO.plano}</p>
          <p className="mt-2 font-display text-4xl font-extrabold text-gold-pale">
            {BENEFICIO.mensalidade}
            <span className="ml-1 text-base font-semibold text-soft">/mês</span>
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink">
            {BENEFICIO.isencoes.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 flex-none text-emerald-300" /> {item} isenta
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 sm:p-6">
          <h2 className="eyebrow mb-2">Como funciona</h2>
          <p className="text-sm leading-relaxed text-soft">{BENEFICIO.quem}</p>
          <p className="mt-3 text-sm leading-relaxed text-soft">
            {BENEFICIO.abrangencia} O plano inclui as áreas e aulas previstas nele:
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {BENEFICIO.inclui.map((item) => (
              <li key={item} className="ui-label rounded-full border border-line px-2.5 py-1 text-[10px] text-gold-light">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MaisPerto />

      <h2 className="eyebrow mb-3 mt-8">As {CARUARU.length} unidades de Caruaru</h2>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
        {CARUARU.map((u) => (
          <li key={u.url} className="min-w-0 rounded-xl border border-line bg-surface p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-ink">Selfit {u.nome}</h3>
              {u.emBreve && (
                <span className="ui-label flex-none rounded-full border border-line px-2.5 py-0.5 text-[10px] text-muted">Pré-venda</span>
              )}
            </div>
            <p className="mt-1.5 flex gap-1.5 text-sm text-soft">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-gold-light" />
              <span>{u.endereco}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={rotaUrl(u)} target="_blank" rel="noopener" className="gold-button ui-label inline-flex min-h-10 items-center gap-1.5 rounded-md px-3">
                <Navigation className="h-4 w-4" />
                <span className="text-xs">Como chegar</span>
              </a>
              <a href={u.url} target="_blank" rel="noopener" className="ghost-button ui-label inline-flex min-h-10 items-center rounded-md px-3">
                <span className="text-xs">Ver unidade</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Unidades e endereços do site da Selfit. A Life Center ainda está em pré-venda: confira a data de abertura com a Selfit.
      </p>
    </main>
  );
}
