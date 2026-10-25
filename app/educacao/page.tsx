import type { Metadata } from "next";
import { BookOpenCheck, ExternalLink, GraduationCap, School } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Educação | Utilitários CPPEM",
  description: "Supletivo, faculdade EAD com bolsa para colaboradores e colégio para os filhos.",
};

const OPCOES = [
  {
    Icone: BookOpenCheck,
    tipo: "Supletivo",
    nome: "Supletivo CPPEM",
    texto: "Para quem ainda não concluiu o ensino fundamental ou o médio.",
    url: "https://supletivo.cppem.com.br",
    destaque: "",
  },
  {
    Icone: GraduationCap,
    tipo: "Faculdade EAD",
    nome: "Unicive Caruaru",
    texto: "Graduação a distância, com bolsa de desconto para colaboradores.",
    url: "https://unicive.cppem.com.br/",
    destaque: "Bolsa para colaboradores",
  },
  {
    Icone: School,
    tipo: "Ensino fundamental e médio",
    nome: "Colégio CPPEM",
    texto: "Para apoiar a formação dos seus filhos, do fundamental ao médio.",
    url: "https://colegio.cppem.com.br/",
    destaque: "",
  },
];

export default function EducacaoPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Educação" eyebrow="Serviços · Grupo CPPEM" title={<>Educação <span className="text-gold-light">para você e sua família</span></>} />

      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-3">
        {OPCOES.map(({ Icone, tipo, nome, texto, url, destaque }) => (
          <li key={url} className="flex min-w-0 flex-col rounded-xl border border-line bg-surface p-4 sm:p-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-light">
              <Icone className="h-6 w-6" />
            </span>
            <p className="ui-label mt-4 text-[11px] text-gold">{tipo}</p>
            <h2 className="mt-1 font-display text-xl font-bold uppercase leading-tight tracking-tight text-ink">{nome}</h2>
            {destaque && (
              <span className="ui-label mt-2 self-start rounded-full border border-emerald-400/50 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] text-emerald-300">
                {destaque}
              </span>
            )}
            <p className="mt-2 flex-1 text-sm leading-relaxed text-soft">{texto}</p>
            <a href={url} target="_blank" rel="noopener" className="gold-button ui-label mt-4 inline-flex min-h-11 items-center gap-2 self-start rounded-md px-4">
              <ExternalLink className="h-4 w-4" />
              <span className="text-xs">Conhecer</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
