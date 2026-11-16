import Link from "next/link";
import type { ReactNode } from "react";
import { sair } from "@/app/admin/actions";

/** Casca das páginas do painel: trilha, título, aviso de sucesso/erro e botão Sair. */
export function AdminShell({
  titulo,
  descricao,
  ok,
  erro,
  voltar = true,
  children,
}: {
  titulo: string;
  descricao?: string;
  ok?: string;
  erro?: string;
  voltar?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <nav className="mb-6 flex items-center justify-between gap-3 text-sm text-soft" aria-label="Você está em">
        <span className="flex items-center gap-2">
          <Link href="/admin" className="-my-2.5 py-2.5 transition-colors hover:text-foreground">Painel</Link>
          {voltar && (
            <>
              <span aria-hidden className="text-muted">›</span>
              <span className="font-medium text-foreground">{titulo}</span>
            </>
          )}
        </span>
        <form action={sair}>
          <button type="submit" className="ghost-button ui-label inline-flex min-h-10 items-center rounded-md px-3">
            <span className="text-xs">Sair</span>
          </button>
        </form>
      </nav>

      <header className="mb-6">
        <p className="eyebrow">Painel · Grupo CPPEM</p>
        <h1 className="display-title mt-2">{titulo}</h1>
        {descricao && <p className="mt-2 text-sm text-soft">{descricao}</p>}
      </header>

      {ok && <p role="status" className="mb-4 rounded-lg border border-line-active bg-gold/10 px-4 py-3 text-sm text-gold-pale">{ok}</p>}
      {erro && <p role="alert" className="mb-4 rounded-lg border border-danger/40 bg-surface px-4 py-3 text-sm text-danger">{erro}</p>}

      {children}
    </main>
  );
}
