import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getFerramentas } from "@/lib/data";
import FerramentasLista from "./ferramentas-lista";

// Aba Ferramentas (/ferramentas): sistemas e links internos com filtro por setor. Dados no banco (painel /admin/ferramentas).
export const metadata: Metadata = {
  title: "Sistemas e links | Utilitários CPPEM",
  description: "Sistemas e links internos da CPPEM.",
};

export const dynamic = "force-dynamic";

export default async function FerramentasPage() {
  const itens = await getFerramentas();
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader
        crumb="Sistemas e links"
        eyebrow="Ferramentas · Grupo CPPEM"
        title={<>Sistemas <span className="text-gold-light">e links</span></>}
      />

      <FerramentasLista itens={itens} />
    </main>
  );
}
