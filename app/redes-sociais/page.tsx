import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { SocialIcon } from "@/components/social-icon";
import { REDES } from "@/config/redes";

// Aba Redes sociais (/redes-sociais, grupo Geral): redes de cada BU. Dados em config/redes.ts.
export const metadata: Metadata = {
  title: "Redes sociais | Utilitários CPPEM",
  description: "Todas as redes sociais de cada BU da CPPEM, prontas para abrir e copiar.",
};

export default function RedesSociaisPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Redes sociais" eyebrow="Geral · Grupo CPPEM" title={<>Redes <span className="text-gold-light">sociais</span></>} />

      <div className="space-y-6">
        {REDES.map((bu) => (
          <section key={bu.id} aria-labelledby={`bu-${bu.id}`} className="overflow-hidden rounded-xl border border-line bg-surface">
            <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line bg-surface-2 px-4 py-3 sm:px-5">
              <div>
                <h2 id={`bu-${bu.id}`} className="font-display text-lg font-bold uppercase tracking-tight text-ink">{bu.nome}</h2>
                <p className="text-xs text-muted">{bu.descricao}</p>
              </div>
              {bu.site && (
                <a href={bu.site.url} target="_blank" rel="noopener" className="ui-label -my-3 inline-flex items-center gap-1.5 py-3 text-xs text-gold-light hover:text-gold-pale">
                  {bu.site.label} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </header>
            <ul>
              {bu.redes.map((rede) => (
                <li key={rede.url} className="flex items-center gap-3 border-t border-line px-4 py-2.5 first:border-t-0 sm:px-5">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line-active bg-gold/10 text-gold-light">
                    <SocialIcon name={rede.key} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{rede.label}</span>
                    <span className="block truncate text-xs text-soft">{rede.perfil}</span>
                  </span>
                  <span className="flex flex-none gap-1.5">
                    <CopyButton value={rede.url} label="Copiar" compacto className="!px-3 max-sm:w-10 max-sm:!px-0" />
                    <a
                      href={rede.url}
                      target="_blank"
                      rel="noopener"
                      aria-label={`Abrir ${rede.label} de ${bu.nome}`}
                      className="ghost-button flex h-10 w-10 items-center justify-center rounded-md"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
