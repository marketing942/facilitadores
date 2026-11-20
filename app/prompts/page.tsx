import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getPrompts } from "@/lib/data";
import GaleriaPrompts from "./galeria-prompts";

// Galeria de Prompts (/prompts): prompts em Markdown enviados pelo painel (/admin/prompts), com filtro por etiqueta.
export const metadata: Metadata = {
  title: "Galeria de Prompts | Utilitários CPPEM",
  description: "Prompts prontos para a equipe comercial, com filtro por etiqueta e cópia em um clique.",
};

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  const { etiquetas, prompts } = await getPrompts();
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader
        crumb="Galeria de Prompts"
        eyebrow="Comercial · Grupo CPPEM"
        title={<>Galeria <span className="text-gold-light">de Prompts</span></>}
      />
      <GaleriaPrompts etiquetas={etiquetas.map((e) => e.nome)} prompts={prompts} />
    </main>
  );
}
