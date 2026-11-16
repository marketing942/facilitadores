"use client";

import { useActionState } from "react";
import { entrar } from "@/app/admin/actions";

export function LoginForm() {
  const [erro, action, pendente] = useActionState(entrar, null);
  return (
    <form action={action} className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">Senha do painel</span>
        <input
          type="password"
          name="senha"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-base text-ink focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold-light sm:text-sm"
        />
      </label>
      {erro && <p role="alert" className="text-sm text-danger">{erro}</p>}
      <button type="submit" disabled={pendente} className="gold-button ui-label inline-flex min-h-11 w-full items-center justify-center rounded-md px-4 disabled:opacity-60">
        <span className="text-xs">{pendente ? "Entrando…" : "Entrar"}</span>
      </button>
    </form>
  );
}
