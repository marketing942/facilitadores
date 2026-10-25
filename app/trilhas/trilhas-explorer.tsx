"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, ExternalLink, X } from "lucide-react";
import type { Trilha } from "@/config/trilhas";

function Detalhe({ trilha, onClose, item, aviso, rotuloLink }: { trilha: Trilha; onClose: () => void; item: string; aviso: string; rotuloLink: string }) {
  const fechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fechar.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Trilha ${trilha.nome}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-line-active bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,.6)] sm:rounded-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="ui-label text-[11px] text-gold">{trilha.area}</p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase leading-tight tracking-tight text-ink">{trilha.nome}</h2>
            <p className="mt-1 text-sm text-soft">Passo a passo · {trilha.cursos.length} {item}</p>
          </div>
          <button ref={fechar} type="button" onClick={onClose} aria-label="Fechar" className="ghost-button flex h-10 w-10 flex-none items-center justify-center rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        <ol className="relative mt-6 space-y-3 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:bg-line-active">
          {trilha.cursos.map((curso, i) => (
            <li key={`${curso.url}-${i}`} className="relative flex items-center gap-3">
              <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line-active bg-surface-2 font-display text-sm font-bold text-gold-pale">
                {i + 1}
              </span>
              <a
                href={curso.url}
                target="_blank"
                rel="noopener"
                className="group flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 transition hover:border-line-active hover:bg-gold/10"
              >
                {curso.emoji && <span aria-hidden className="text-lg leading-none">{curso.emoji}</span>}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-snug text-ink">{curso.titulo}</span>
                  {curso.descricao && <span className="mt-0.5 block text-xs leading-snug text-soft">{curso.descricao}</span>}
                  {curso.formatos && curso.formatos.length > 0 && (
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {curso.formatos.map((f) => (
                        <span key={f} className="ui-label rounded-full border border-line px-2 py-px text-[9px] text-gold-light">{f}</span>
                      ))}
                    </span>
                  )}
                </span>
                <span className="sr-only">{rotuloLink}</span>
                <ExternalLink className="h-4 w-4 flex-none text-gold-light opacity-70 group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted">{aviso}</p>
      </div>
    </div>
  );
}

type Props = {
  trilhas: Trilha[];
  areas: string[];
  /** "cursos", "treinamentos"... */
  item?: string;
  aviso?: string;
  rotuloLink?: string;
};

export default function TrilhasExplorer({
  trilhas,
  areas,
  item = "cursos",
  aviso = "Os cursos abrem na plataforma do G4: é preciso estar logado com o acesso da CPPEM.",
  rotuloLink = "Abrir curso",
}: Props) {
  const [area, setArea] = useState("");
  const [aberta, setAberta] = useState<Trilha | null>(null);

  const chip = (ativo: boolean) =>
    `min-h-10 rounded-md border px-4 py-2 transition ${
      ativo ? "border-gold-light bg-gold/25 text-gold-pale" : "border-gold/35 bg-gold/10 text-gold-light hover:bg-gold/20"
    }`;

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por área">
        <button type="button" aria-pressed={!area} onClick={() => setArea("")} className={chip(!area)}>
          <span className="ui-label text-xs">Todas</span>
        </button>
        {areas.map((nome) => (
          <button key={nome} type="button" aria-pressed={area === nome} onClick={() => setArea(nome)} className={chip(area === nome)}>
            <span className="ui-label text-xs">{nome}</span>
          </button>
        ))}
      </div>

      <div className="space-y-7">
        {areas.filter((a) => !area || a === area).map((nome) => (
          <section key={nome} aria-label={nome}>
            <h2 className="eyebrow mb-3">{nome}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trilhas
                .filter((t) => t.area === nome)
                .map((trilha) => (
                  <li key={trilha.slug}>
                    <button
                      type="button"
                      onClick={() => setAberta(trilha)}
                      className="group flex h-full w-full flex-col rounded-xl border border-line bg-surface p-4 text-left transition hover:-translate-y-0.5 hover:border-line-active sm:p-5"
                    >
                      <span className="flex w-full items-start justify-between gap-3">
                        <span className="font-display text-lg font-bold uppercase leading-snug tracking-tight text-ink">{trilha.nome}</span>
                        <span className="ui-label flex-none rounded-full border border-line px-2.5 py-0.5 text-[10px] text-gold-light">
                          {trilha.cursos.length} {item}
                        </span>
                      </span>
                      <span className="mt-3 block space-y-1 text-[13px] leading-snug text-soft">
                        {trilha.cursos.slice(0, 3).map((c, i) => (
                          <span key={`${c.url}-${i}`} className="flex gap-2">
                            <span className="w-4 flex-none text-right text-muted">{i + 1}.</span>
                            <span className="truncate">{c.titulo}</span>
                          </span>
                        ))}
                        {trilha.cursos.length > 3 && <span className="block pl-6 text-muted">+ {trilha.cursos.length - 3} {item}</span>}
                      </span>
                      <span className="ui-label mt-auto flex items-center gap-1 pt-4 text-xs text-gold-light">
                        Ver passo a passo <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      {aberta && <Detalhe trilha={aberta} onClose={() => setAberta(null)} item={item} aviso={aviso} rotuloLink={rotuloLink} />}
    </>
  );
}
