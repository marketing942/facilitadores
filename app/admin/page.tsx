import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, Pencil } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth";
import { SECOES } from "@/lib/admin-schema";

export const metadata: Metadata = { title: "Painel | Utilitários CPPEM" };
export const dynamic = "force-dynamic";

// Início do painel: uma entrada para cada aba editável. Food Service, Guru e calculadoras não são editadas aqui.
export default async function AdminHome({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  await requireAdmin();
  const { ok, erro } = await searchParams;
  return (
    <AdminShell titulo="Painel administrativo" descricao="Escolha o que editar. As mudanças aparecem no site na hora." ok={ok} erro={erro} voltar={false}>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {SECOES.map((s) => (
          <Link key={s.slug} href={`/admin/${s.slug}`} className="group">
            <div className="flex h-full items-start gap-3.5 rounded-xl border border-line bg-surface p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-line-active">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-gold/10 text-gold-light">
                <Pencil className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base font-bold uppercase tracking-tight text-ink">{s.titulo}</span>
                <span className="block text-sm text-ink-soft">{s.descricao}</span>
              </span>
            </div>
          </Link>
        ))}
        <Link href="/admin/seguranca" className="group">
          <div className="flex h-full items-start gap-3.5 rounded-xl border border-line bg-surface p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-line-active">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-gold/10 text-gold-light">
              <KeyRound className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-base font-bold uppercase tracking-tight text-ink">Senhas</span>
              <span className="block text-sm text-ink-soft">Trocar a senha do painel e a senha da equipe (Wi-Fi interno)</span>
            </span>
          </div>
        </Link>
      </div>
    </AdminShell>
  );
}
