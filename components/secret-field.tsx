"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CopyButton } from "@/components/copy-button";

/** Senha escondida por padrão: só aparece quando a pessoa toca em "Mostrar". Copiar funciona sem mostrar. */
export function SecretField({ label, value }: { label: string; value: string }) {
  const [shown, setShown] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 p-4">
      <div className="min-w-0">
        <p className="ui-label text-[11px] text-gold-light">{label}</p>
        <p className="mt-1.5 break-all font-mono text-base text-ink">{shown ? value : "••••••••••••"}</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-pressed={shown}
          className="ghost-button ui-label inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-xs"
        >
          {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="text-xs">{shown ? "Ocultar" : "Mostrar"}</span>
        </button>
        <CopyButton value={value} label="Copiar senha" />
      </div>
    </div>
  );
}
