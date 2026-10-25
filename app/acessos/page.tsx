import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import AcessosLista from "./acessos-lista";

export const metadata: Metadata = {
  title: "Sistemas e links | Utilitários CPPEM",
  description: "Sistemas e links internos da CPPEM.",
};

export default function AcessosPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader
        crumb="Sistemas e links"
        eyebrow="Acessos · Grupo CPPEM"
        title={<>Sistemas <span className="text-gold-light">e links</span></>}
      />

      <AcessosLista />
    </main>
  );
}
