import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getLivros } from "@/lib/data";
import BibliotecaExplorer from "./biblioteca-explorer";

// Aba Biblioteca (/biblioteca, grupo Estudo). Dados no banco (painel /admin/biblioteca); capas em public/biblioteca/ ou por endereço.
export const metadata: Metadata = {
  title: "Biblioteca | Utilitários CPPEM",
  description: "Livros de estudo do time, com capa, resumo e para quem cada um é indicado.",
};

export const dynamic = "force-dynamic";

export default async function BibliotecaPage() {
  const { livros, categorias } = await getLivros();
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader
        crumb="Biblioteca"
        eyebrow="Estudo · Grupo CPPEM"
        title={<>Biblioteca <span className="text-gold-light">do time</span></>}
      />
      <BibliotecaExplorer livros={livros} categorias={categorias} />
    </main>
  );
}
