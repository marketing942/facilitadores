import type { Metadata } from "next";
import { trocarSenha } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/shell";
import { inputClass } from "@/components/admin/forms";
import { MIN_PASSWORD, requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Senhas | Utilitários CPPEM" };
export const dynamic = "force-dynamic";

function Campo({ name, label, autoComplete }: { name: string; label: string; autoComplete: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      <input type="password" name={name} required minLength={name === "atual" ? 1 : MIN_PASSWORD} autoComplete={autoComplete} className={inputClass} />
    </label>
  );
}

// Troca das duas senhas: a do painel (exige a atual) e a da equipe (libera o Wi-Fi interno no site).
export default async function SegurancaPage({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  await requireAdmin();
  const { ok, erro } = await searchParams;
  return (
    <AdminShell titulo="Senhas" descricao={`Mínimo de ${MIN_PASSWORD} caracteres. As senhas ficam guardadas só como hash no banco.`} ok={ok} erro={erro}>
      <div className="space-y-6">
        <form action={trocarSenha} className="space-y-3.5 rounded-xl border border-line bg-surface p-4 sm:p-5">
          <input type="hidden" name="__back" value="/admin/seguranca" />
          <input type="hidden" name="__qual" value="admin" />
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">Senha do painel</h2>
          <p className="text-sm text-soft">Depois de trocar, todos precisam entrar de novo no painel.</p>
          <Campo name="atual" label="Senha atual" autoComplete="current-password" />
          <Campo name="nova" label="Nova senha" autoComplete="new-password" />
          <Campo name="confirma" label="Repita a nova senha" autoComplete="new-password" />
          <button type="submit" className="gold-button ui-label inline-flex min-h-11 items-center rounded-md px-5">
            <span className="text-xs">Trocar senha do painel</span>
          </button>
        </form>

        <form action={trocarSenha} className="space-y-3.5 rounded-xl border border-line bg-surface p-4 sm:p-5">
          <input type="hidden" name="__back" value="/admin/seguranca" />
          <input type="hidden" name="__qual" value="equipe" />
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">Senha da equipe</h2>
          <p className="text-sm text-soft">É a senha que a equipe digita em Geral › Wi-Fi para ver as senhas das redes internas. Quem já liberou terá de digitar a nova.</p>
          <Campo name="nova" label="Nova senha da equipe" autoComplete="new-password" />
          <Campo name="confirma" label="Repita a nova senha" autoComplete="new-password" />
          <button type="submit" className="gold-button ui-label inline-flex min-h-11 items-center rounded-md px-5">
            <span className="text-xs">Trocar senha da equipe</span>
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
