"use client";

import { MessageCircle } from "lucide-react";
import { LOCAIS } from "@/config/food";
import { statusAgora, useAgora } from "@/lib/horario";

// Cartões do restaurante e das cantinas com o selo "Provavelmente ativa" (horário de Recife, lib/horario.ts).
export default function Locais() {
  const agora = useAgora();

  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {LOCAIS.map((local) => {
        const status = agora === null ? null : statusAgora(local.janelas, agora);
        const inativo = status !== null && !status.aberto;
        return (
          <li
            key={local.id}
            className={`flex min-w-0 flex-col rounded-xl border p-4 transition sm:p-5 ${
              inativo ? "border-line bg-surface/60 opacity-70 grayscale-[.6]" : "border-line-active bg-surface"
            }`}
          >
            <div className="flex flex-wrap-reverse items-start justify-between gap-x-3 gap-y-2">
              <div className="min-w-0">
                <p className="ui-label text-[11px] text-gold">{local.tipo}</p>
                <h3 className="mt-1 font-display text-xl font-bold uppercase leading-tight tracking-tight text-ink">{local.nome}</h3>
              </div>
              {status && (
                <span
                  className={`ui-label flex flex-none items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] ${
                    status.aberto ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300" : "border-line bg-surface-2 text-muted"
                  }`}
                >
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${status.aberto ? "animate-pulse bg-emerald-400" : "bg-muted"}`} />
                  {status.aberto ? "Provavelmente ativa" : "Inativa agora"}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-soft">{local.descricao}</p>
            <p className="mt-3 text-sm font-semibold text-ink">{local.horarioTexto}</p>
            {status?.texto && <p className="text-xs text-muted">{status.aberto ? `Funcionando ${status.texto}` : status.texto[0].toUpperCase() + status.texto.slice(1)}</p>}
            {local.link && (
              <a
                href={local.link.url}
                target="_blank"
                rel="noopener"
                className="gold-button ui-label mt-4 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-md px-4"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{local.link.label}</span>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
