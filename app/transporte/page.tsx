import type { Metadata } from "next";
import { Bus, CircleAlert, ExternalLink, Mail, MapPin, MessageCircle, Phone, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { APPS_CORRIDA, LEVA } from "@/config/transporte";

// Aba Transporte (/transporte, grupo Serviços): cartão Leva e apps de corrida. Dados em config/transporte.ts.
export const metadata: Metadata = {
  title: "Transporte | Utilitários CPPEM",
  description: "Cartão Leva para os ônibus de Caruaru e apps de corrida recomendados.",
};

export default function TransportePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Transporte" eyebrow="Serviços · Grupo CPPEM" title={<>Transporte <span className="text-gold-light">em Caruaru</span></>} />

      <p role="note" className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-400/50 bg-yellow-400/10 px-4 py-3 text-sm text-ink">
        <CircleAlert className="mt-0.5 h-5 w-5 flex-none text-yellow-300" />
        <span>
          No momento, a CPPEM <strong>não oferece vale-transporte</strong>. Para andar de ônibus em Caruaru, use o cartão
          Leva, logo aqui na praça.
        </span>
      </p>

      <section className="rounded-2xl border border-line-active bg-surface p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold/10 text-gold-light">
            <Bus className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ink">{LEVA.nome}</h2>
            <p className="text-sm text-soft">{LEVA.descricao}</p>
          </div>
        </div>

        <p className="mt-4 flex gap-2 text-sm text-ink">
          <MapPin className="mt-0.5 h-4 w-4 flex-none text-gold-light" />
          <span>
            {LEVA.endereco}. <span className="text-soft">{LEVA.pertinho}</span>
          </span>
        </p>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
          <div>
            <h3 className="eyebrow mb-2">No posto você pode</h3>
            <ul className="space-y-1 text-sm text-soft">
              {LEVA.servicos.map((s) => (
                <li key={s}>· {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow mb-2">Tipos de cartão</h3>
            <ul className="flex flex-wrap gap-1.5">
              {LEVA.categorias.map((c) => (
                <li key={c} className="ui-label rounded-full border border-line px-2.5 py-1 text-[10px] text-gold-light">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">As regras e os descontos de cada tipo são definidos pelo Leva: confirme no posto.</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <a href={LEVA.mapa} target="_blank" rel="noopener" className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">Ver no mapa</span>
          </a>
          <a href={LEVA.whatsapp.url} target="_blank" rel="noopener" className="ghost-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">WhatsApp {LEVA.whatsapp.label}</span>
          </a>
          <a href={LEVA.app} target="_blank" rel="noopener" className="ghost-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <Smartphone className="h-4 w-4" />
            <span className="text-xs">App Leva Caruaru</span>
          </a>
          <a href={LEVA.site} target="_blank" rel="noopener" className="ghost-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <ExternalLink className="h-4 w-4" />
            <span className="text-xs">Site do Leva</span>
          </a>
        </div>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Vale-transporte e servidor: {LEVA.telefoneVT}</span>
          <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {LEVA.email}</span>
        </p>
      </section>

      <h2 className="eyebrow mb-3 mt-8">Apps recomendados</h2>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
        {APPS_CORRIDA.map((app) => (
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
