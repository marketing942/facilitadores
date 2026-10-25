import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { LIVROS } from "@/config/biblioteca";
import BibliotecaExplorer from "./biblioteca-explorer";

export const metadata: Metadata = {
  title: "Biblioteca | Utilitários CPPEM",
  description: "Livros de estudo do time, com capa, resumo e para quem cada um é indicado.",
};

export default function BibliotecaPage() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader
        crumb="Biblioteca"
        eyebrow="Estudo · Grupo CPPEM"
        title={<>Biblioteca <span className="text-gold-light">do time</span></>}
      />
      <BibliotecaExplorer livros={LIVROS} />
    </main>
  );
}
