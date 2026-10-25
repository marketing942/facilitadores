import type { Metadata } from "next";
import { Coffee, ExternalLink, CupSoda, Pizza, Sandwich, Soup, UtensilsCrossed } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { APPS } from "@/config/food";
import Locais from "./food-service";

export const metadata: Metadata = {
  title: "Food Service | Utilitários CPPEM",
  description: "Restaurante parceiro, cantinas do prédio e apps de delivery recomendados.",
};

// Banner desenhado em código: ícones de comida espalhados sobre o degradê quente da marca
const ICONES = [
  { Icone: UtensilsCrossed, cls: "left-[6%] top-[18%] h-14 w-14 -rotate-12 sm:h-20 sm:w-20" },
  { Icone: Coffee, cls: "left-[22%] bottom-[10%] h-10 w-10 rotate-6 sm:h-14 sm:w-14" },
  { Icone: Pizza, cls: "right-[24%] top-[10%] h-12 w-12 rotate-12 sm:h-16 sm:w-16" },
  { Icone: Sandwich, cls: "right-[6%] bottom-[14%] h-14 w-14 -rotate-6 sm:h-20 sm:w-20" },
  { Icone: Soup, cls: "right-[42%] bottom-[6%] hidden h-12 w-12 sm:block" },
  { Icone: CupSoda, cls: "left-[40%] top-[8%] hidden h-10 w-10 -rotate-12 sm:block" },
];

export default function FoodServicePage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Food Service" eyebrow="Serviços · Grupo CPPEM" title={<>Food <span className="text-gold-light">Service</span></>} />

      <section className="mb-6 overflow-hidden rounded-2xl border border-line">
        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#5a3a17_0%,#2a1a0c_45%,#0d0a07_100%)] sm:h-56 md:h-64">
          {ICONES.map(({ Icone, cls }, i) => (
            <Icone key={i} aria-hidden strokeWidth={1.3} className={`absolute text-gold/25 ${cls}`} />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_55%,rgba(240,220,176,.16),transparent_70%)]" />
          <div className="relative px-4 text-center">
            <p className="ui-label text-xs text-gold-light">Bom apetite</p>
            <p className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-gold-pale sm:text-5xl">Food Service</p>
            <p className="mt-2 text-sm text-soft sm:text-base">Almoço, lanche e delivery para o seu dia no CPPEM</p>
          </div>
        </div>
        <p className="border-t border-line bg-surface px-4 py-3 text-sm text-soft sm:px-5">
          O selo &quot;Provavelmente ativa&quot; segue o horário de cada lugar. Como são parceiros, e não equipe da CPPEM,
          pode acontecer de estarem fechados mesmo no horário.
        </p>
      </section>

      <h2 className="eyebrow mb-3">Onde comer</h2>
      <Locais />

      <h2 className="eyebrow mb-3 mt-8">Apps recomendados</h2>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
        {APPS.map((app) => (
          <li key={app.nome} className="min-w-0">
            <a
              href={app.url}
              target="_blank"
              rel="noopener"
              className="flex min-h-16 items-center gap-4 rounded-xl border border-line bg-surface p-4 transition hover:border-line-active hover:bg-surface-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={app.logo} alt="" width={48} height={48} className="h-12 w-12 flex-none rounded-xl" />
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-bold uppercase tracking-tight text-ink">{app.nome}</span>
                <span className="block text-sm text-soft">{app.descricao}</span>
              </span>
              <ExternalLink className="h-4 w-4 flex-none text-gold-light" />
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
