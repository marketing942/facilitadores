import Link from "next/link";
import type { ReactNode } from "react";

/** Trilha + título, igual em todas as páginas novas. */
export function PageHeader({ crumb, eyebrow, title }: { crumb: string; eyebrow: string; title: ReactNode }) {
  return (
    <>
      <nav className="mb-6 flex items-center gap-2 text-sm text-soft" aria-label="Você está em">
        <Link href="/" className="-my-2.5 py-2.5 transition-colors hover:text-foreground">
          Início
        </Link>
        <span aria-hidden className="text-muted">›</span>
        <span className="font-medium text-foreground">{crumb}</span>
      </nav>
      <header className="mb-6 sm:mb-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title mt-2">{title}</h1>
      </header>
    </>
  );
}
