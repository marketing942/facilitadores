import type { Metadata } from "next";
import { AcessoForm } from "./acesso-form";

export const metadata: Metadata = { title: "Acesso | Utilitários CPPEM" };
export const dynamic = "force-dynamic";

// Tela de entrada do site: senha comum, acesso válido por 8 horas. Cobre o menu, que só vale depois de entrar.
export default async function AcessoPage({ searchParams }: { searchParams: Promise<{ de?: string }> }) {
  const { de } = await searchParams;
  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-background">
      <main className="mx-auto w-full max-w-sm px-4 pb-8 pt-16 sm:pt-24">
        <p className="eyebrow">Grupo CPPEM</p>
        <h1 className="display-title mt-2 mb-2">
          Utilitários <span className="text-gold-light">CPPEM</span>
        </h1>
        <p className="mb-6 text-sm text-soft">Digite a senha da equipe para entrar. O acesso vale por 8 horas.</p>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <AcessoForm de={de ?? "/"} />
        </div>
      </main>
    </div>
  );
}
