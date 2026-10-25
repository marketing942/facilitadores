import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import FerramentasLista from "./ferramentas-lista";

// Aba Ferramentas (/ferramentas): sistemas e links internos com filtro por setor. Dados em config/ferramentas.ts.
export const metadata: Metadata = {
  title: "Sistemas e links | Utilitários CPPEM",
  description: "Sistemas e links internos da CPPEM.",
};

export default function FerramentasPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader
        crumb="Sistemas e links"
        eyebrow="Ferramentas · Grupo CPPEM"
        title={<>Sistemas <span className="text-gold-light">e links</span></>}
      />

      <FerramentasLista />
    </main>
  );
}
