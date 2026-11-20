"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { normalize } from "@/components/explorer-kit";
import type { PromptItem } from "@/lib/data";

// Galeria: busca + filtro por etiquetas (marcar mais de uma mostra os prompts que têm qualquer uma delas).
// Cada cartão mostra o início do prompt; "Ler prompt" abre o texto inteiro e "Copiar" leva o prompt todo.
export default function GaleriaPrompts({ etiquetas, prompts }: { etiquetas: string[]; prompts: PromptItem[] }) {
  const [busca, setBusca] = useState("");
  const [ativas, setAtivas] = useState<string[]>([]);
  const [abertos, setAbertos] = useState<Set<string>>(new Set());

  const termos = normalize(busca).split(/\s+/).filter(Boolean);
  const visiveis = prompts.filter((p) => {
    if (ativas.length && !ativas.some((e) => p.etiquetas.includes(e))) return false;
    const texto = normalize(`${p.titulo} ${p.conteudo} ${p.etiquetas.join(" ")}`);
    return termos.every((t) => texto.includes(t));
  });

  const alternar = (nome: string) => setAtivas((a) => (a.includes(nome) ? a.filter((x) => x !== nome) : [...a, nome]));
  const alternarAberto = (id: string) =>
    setAbertos((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const chip = (ativo: boolean) =>
    `ui-label min-h-10 rounded-md border px-4 py-2 text-xs transition ${
      ativo ? "border-gold-light bg-gold/25 text-gold-pale" : "border-gold/35 bg-gold/10 text-gold-light hover:bg-gold/20"
    }`;

  return (
    <>
      <div className="relative mb-4">
        <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar prompt…"
          aria-label="Buscar prompt"
          className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-3 text-base text-ink placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold-light sm:text-sm"
        />
      </div>

      {etiquetas.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por etiqueta">
          <button type="button" aria-pressed={ativas.length === 0} onClick={() => setAtivas([])} className={chip(ativas.length === 0)}>
            <span className="text-xs">Todos</span>
          </button>
          {etiquetas.map((nome) => (
            <button key={nome} type="button" aria-pressed={ativas.includes(nome)} onClick={() => alternar(nome)} className={chip(ativas.includes(nome))}>
              <span className="text-xs">{nome}</span>
            </button>
          ))}
        </div>
      )}

      {visiveis.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface p-5 text-sm text-soft">
          {prompts.length === 0 ? "Ainda não há prompts na galeria." : "Nenhum prompt encontrado com esses filtros."}
        </p>
      ) : (
        <ul className="space-y-3">
          {visiveis.map((p) => {
            const aberto = abertos.has(p.id);
            return (
              <li key={p.id} className="rounded-xl border border-line bg-surface p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 basis-60">
                    <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">{p.titulo}</h2>
                    {p.etiquetas.length > 0 && (
                      <p className="mt-2 flex flex-wrap gap-1.5">
                        {p.etiquetas.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => alternar(tag)}
                            aria-label={`Filtrar por ${tag}`}
                            className={`ui-label rounded-full border px-2.5 py-0.5 text-[10px] transition ${
                              ativas.includes(tag) ? "border-gold-light bg-gold/25 text-gold-pale" : "border-line text-gold-light hover:border-gold/50"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </p>
                    )}
                  </div>
                  <CopyButton value={p.conteudo} label="Copiar prompt" />
                </div>

                <div
                  className={`mt-4 whitespace-pre-wrap break-words rounded-lg border border-line bg-surface-2 p-3.5 text-sm leading-relaxed text-ink-soft ${
                    aberto ? "" : "line-clamp-4"
                  }`}
                >
                  {p.conteudo}
                </div>

                <button
                  type="button"
                  aria-expanded={aberto}
                  onClick={() => alternarAberto(p.id)}
                  className="ui-label mt-3 inline-flex min-h-10 items-center gap-1.5 text-xs text-gold-light transition hover:text-gold-pale"
                >
                  {aberto ? "Mostrar menos" : "Ler prompt e ver mais"}
                  <ChevronDown className={`h-4 w-4 transition-transform ${aberto ? "rotate-180" : ""}`} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
