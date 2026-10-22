import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_LINKS } from "@/config/atendimento";
import AtendimentoExplorer from "./atendimento-explorer";

export const metadata: Metadata = {
  title: "Links de atendimento e suporte | Time Comercial",
  description: "Todos os links de atendimento e suporte do Grupo CPPEM, por empresa e por tipo, prontos para copiar.",
};

export default function AtendimentoPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-24 pt-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-soft" aria-label="Você está em">
        <Link href="/" className="transition-colors hover:text-foreground">
          Início
        </Link>
        <span aria-hidden className="text-muted">›</span>
        <span className="font-medium text-foreground">Links de Atendimento</span>
      </nav>

      <header>
        <p className="eyebrow">Uso interno · Grupo CPPEM</p>
        <h1 className="display-title mt-2">
          Links de <span className="text-gold-light">Atendimento e Suporte</span>
        </h1>
      </header>

      <p className="mt-3 text-sm text-soft">
        Escolha o canal certo — atendimento ou suporte, humano ou IA — e copie o link para enviar.
      </p>

      <AtendimentoExplorer items={SERVICE_LINKS} />
    </main>
  );
}
