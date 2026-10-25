"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { ACESSOS, SETORES, type Setor } from "@/config/acessos";

export default function AcessosLista() {
  const [setor, setSetor] = useState<Setor | null>(null);

  const visiveis = ACESSOS.filter(
    (acesso) => !setor || acesso.tags.includes(setor) || acesso.tags.includes("Todas"),
  );

  const chip = (ativo: boolean) =>
    `ui-label min-h-10 rounded-md border px-4 py-2 text-xs transition ${
      ativo ? "border-gold-light bg-gold/25 text-gold-pale" : "border-gold/35 bg-gold/10 text-gold-light hover:bg-gold/20"
    }`;

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por setor">
        <button type="button" aria-pressed={!setor} onClick={() => setSetor(null)} className={chip(!setor)}>
          <span className="text-xs">Todos</span>
        </button>
        {SETORES.map((nome) => (
          <button key={nome} type="button" aria-pressed={setor === nome} onClick={() => setSetor(nome)} className={chip(setor === nome)}>
            <span className="text-xs">{nome}</span>
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {visiveis.map((acesso) => (
          <li
            key={acesso.url}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 sm:p-5"
          >
            <div className="min-w-0">
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">{acesso.nome}</h2>
              <p className="mt-1 text-sm text-soft">{acesso.descricao}</p>
              {acesso.tags.length > 0 && (
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {acesso.tags.map((tag) => (
                    <span key={tag} className="ui-label rounded-full border border-line px-2.5 py-0.5 text-[10px] text-gold-light">
                      {tag}
                    </span>
                  ))}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <a
                href={acesso.url}
                target="_blank"
                rel="noopener"
                className="gold-button ui-label inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-xs"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir
              </a>
              <CopyButton value={acesso.url} label="Copiar link" variant="ghost" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
