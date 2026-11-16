"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { liberarEquipe } from "@/app/wifi/actions";

/** Pede a senha da equipe para mostrar as senhas do Wi-Fi interno. */
export function EquipeForm() {
  const [erro, action, pendente] = useActionState(liberarEquipe, null);
  return (
    <form action={action} className="mt-4 flex flex-wrap items-start gap-2">
      <div className="min-w-0 flex-1 basis-56">
        <input
          type="password"
          name="senha"
          required
          autoComplete="off"
          placeholder="Senha da equipe"
          aria-label="Senha da equipe"
          className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-base text-ink placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold-light sm:text-sm"
        />
        {erro && <p role="alert" className="mt-1.5 text-sm text-danger">{erro}</p>}
      </div>
      <button type="submit" disabled={pendente} className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4 disabled:opacity-60">
        <Lock className="h-4 w-4" />
        <span className="text-xs">{pendente ? "Conferindo…" : "Ver senhas"}</span>
      </button>
    </form>
  );
}
