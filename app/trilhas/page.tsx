import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { AREAS, G4_URL, TRILHAS } from "@/config/trilhas";
import TrilhasExplorer from "@/components/trilhas-explorer";

// Aba Trilhas G4 Skills (/trilhas, grupo Estudo). Dados em config/trilhas.ts; a lista é components/trilhas-explorer.tsx.
export const metadata: Metadata = {
  title: "Trilhas G4 Skills | Utilitários CPPEM",
  description: "Trilhas de cursos do G4 Skills por área, com o passo a passo e o link de cada curso.",
};

export default function TrilhasPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Trilhas G4 Skills" eyebrow="Estudo · Grupo CPPEM" title={<>Trilhas <span className="text-gold-light">G4 Skills</span></>} />

      <section className="relative mb-6 overflow-hidden rounded-2xl border border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/estudo/g4-skills.jpg" alt="G4 Skills: capacita seu time, desenvolve seu negócio" width={1400} height={587} className="h-40 w-full object-cover sm:h-56 md:h-64" />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-4 py-3 sm:px-5">
          <p className="text-sm text-soft">
            Escolha a trilha da sua área e siga os cursos na ordem. O acesso é o vitalício da CPPEM no G4 Skills.
          </p>
          <a href={G4_URL} target="_blank" rel="noopener" className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <ExternalLink className="h-4 w-4" />
            <span className="text-xs">Entrar no G4 Skills</span>
          </a>
        </div>
      </section>

      <TrilhasExplorer trilhas={TRILHAS} areas={AREAS} />
    </main>
  );
}
