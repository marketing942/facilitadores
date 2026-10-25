import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AREAS_INTERNAS, TRILHAS_INTERNAS } from "@/config/trilhas-internas";
import TrilhasExplorer from "@/components/trilhas-explorer";

// Aba Trilhas Internas (/trilhas-internas, grupo Estudo). Dados em config/trilhas-internas.ts; mesma lista das Trilhas G4.
export const metadata: Metadata = {
  title: "Trilhas Internas | Utilitários CPPEM",
  description: "Tutoriais e treinamentos feitos pelo time da CPPEM, por área.",
};

export default function TrilhasInternasPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Trilhas Internas" eyebrow="Estudo · Grupo CPPEM" title={<>Trilhas <span className="text-gold-light">internas</span></>} />
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-soft">
        Tutoriais e treinamentos feitos pelo nosso time. Escolha a trilha da sua área: cada treinamento abre a página
        dele no Notion, com os vídeos, PDFs e materiais.
      </p>
      <TrilhasExplorer
        trilhas={TRILHAS_INTERNAS}
        areas={AREAS_INTERNAS}
        item="treinamentos"
        aviso="Os treinamentos abrem no Notion da CPPEM: é preciso estar logado lá."
        rotuloLink="Abrir no Notion"
      />
    </main>
  );
}
