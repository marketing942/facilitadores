// Aba Autoescola (/autoescola, grupo Serviços): parceria CPPEM × Autoescola Dirija+ para a CNH AB. Dados em config/autoescola.ts.
import type { Metadata } from "next";
import { ExternalLink, MapPin, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SocialIcon } from "@/components/social-icon";
import {
  AUTOESCOLA as A,
  AVULSOS,
  DETRAN,
  DETRAN_TOTAL,
  NOTA_AULAS,
  NOTA_DETRAN,
  NOTA_RESUMO,
  PACOTE,
  RESUMO,
  SO_AULAS,
  type Item,
} from "@/config/autoescola";

export const metadata: Metadata = {
  title: "Autoescola Dirija+ | Utilitários CPPEM",
  description: "Parceria CPPEM e Autoescola Dirija+ para tirar a CNH AB (carro e moto), com os valores da autoescola e do Detran-PE.",
};

function Linha({ item }: { item: Item }) {
  return (
    <li className="flex items-start justify-between gap-4 border-t border-line px-4 py-3 first:border-t-0 sm:px-5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">
          {item.nome}
          {item.oficial && <span className="ui-label ml-2 rounded-full border border-line px-2 py-px align-middle text-[9px] text-gold-light">oficial</span>}
        </p>
        {item.detalhe && <p className="mt-0.5 text-xs leading-relaxed text-soft">{item.detalhe}</p>}
      </div>
      <p className="flex-none whitespace-nowrap font-display text-base font-bold text-gold-pale">{item.valor}</p>
    </li>
  );
}

function Bloco({ titulo, descricao, children }: { titulo: string; descricao?: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
      <header className="border-b border-line bg-surface-2 px-4 py-3 sm:px-5">
        <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">{titulo}</h2>
        {descricao && <p className="text-xs text-muted">{descricao}</p>}
      </header>
      {children}
    </section>
  );
}

const Nota = ({ children }: { children: React.ReactNode }) => (
  <p className="border-t border-line bg-gold/5 px-4 py-3 text-xs leading-relaxed text-soft sm:px-5">{children}</p>
);

export default function AutoescolaPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Autoescola" eyebrow="Serviços · Grupo CPPEM" title={<>CNH AB com a <span className="text-gold-light">Dirija+</span></>} />

      <section className="overflow-hidden rounded-2xl border border-line-active bg-surface">
        <div className="flex flex-col items-center gap-4 bg-[radial-gradient(120%_90%_at_50%_0%,#3a2a0a_0%,#17110a_55%,#0b0908_100%)] p-5 text-center sm:flex-row sm:p-7 sm:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/servicos/dirija-logo.jpg" alt="Logomarca da Autoescola Dirija+" width={150} height={150} className="h-24 w-24 flex-none rounded-2xl border border-line-active sm:h-28 sm:w-28" />
          <div className="min-w-0">
            <p className="ui-label text-[11px] text-gold-light">Parceria CPPEM × Autoescola Dirija+</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-gold-pale sm:text-3xl">Tire sua CNH de carro e moto</h2>
            <p className="mt-2 text-sm leading-relaxed text-soft">
              Benefício para colaboradores e alunos do CPPEM: a Autoescola Dirija+ cuida do processo da sua CNH AB, em Caruaru, com
              pacote completo ou só as aulas práticas.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line p-4 sm:px-5">
          <a href={A.whatsapp.url} target="_blank" rel="noopener" className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">Falar no WhatsApp</span>
          </a>
          <a href={A.instagram.url} target="_blank" rel="noopener" className="ghost-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <SocialIcon name="instagram" className="h-4 w-4" />
            <span className="text-xs">{A.instagram.label}</span>
          </a>
          <a href={A.mapa} target="_blank" rel="noopener" className="ghost-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">Ver no mapa</span>
          </a>
        </div>
        <p className="border-t border-line px-4 py-3 text-xs text-muted sm:px-5">
          {A.nome} · {A.endereco} · WhatsApp {A.whatsapp.label}
        </p>
      </section>

      <Bloco titulo="Autoescola Dirija+" descricao={`Valores da proposta da autoescola. ${A.aulaDuracao}`}>
        <ul>
          <li className="border-b border-line bg-gold/5 px-4 py-2 sm:px-5">
            <span className="ui-label text-[11px] text-gold-light">Pacote completo</span>
          </li>
          <Linha item={PACOTE} />
          <li className="border-y border-line bg-gold/5 px-4 py-2 sm:px-5">
            <span className="ui-label text-[11px] text-gold-light">Serviços avulsos</span>
          </li>
          {AVULSOS.map((item) => <Linha key={item.nome} item={item} />)}
          <li className="border-y border-line bg-gold/5 px-4 py-2 sm:px-5">
            <span className="ui-label text-[11px] text-gold-light">Só aulas práticas</span>
          </li>
          <Linha item={SO_AULAS} />
        </ul>
        <Nota>{NOTA_AULAS}</Nota>
      </Bloco>

      <Bloco titulo="Detran-PE" descricao="Primeira habilitação AB. Valores pagos por fora da autoescola.">
        <ul>
          {DETRAN.map((item) => <Linha key={item.nome} item={item} />)}
          <Linha item={{ nome: "Total dos itens acima", valor: DETRAN_TOTAL }} />
        </ul>
        <Nota>{NOTA_DETRAN}</Nota>
      </Bloco>

      <Bloco titulo="Quanto você paga no total" descricao="Soma da autoescola com os itens do Detran-PE.">
        <ul>
          {RESUMO.map((r) => (
            <li key={r.opcao} className="border-t border-line px-4 py-3 first:border-t-0 sm:px-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-semibold text-ink">{r.opcao}</p>
                <p className="font-display text-xl font-extrabold text-gold-pale">{r.total}</p>
              </div>
              <p className="mt-0.5 text-xs text-soft">
                Autoescola {r.autoescola} + Detran-PE {r.detran}
              </p>
            </li>
          ))}
        </ul>
        <Nota>{NOTA_RESUMO}</Nota>
      </Bloco>

      <div className="mt-6 flex flex-wrap gap-2">
        <a href={A.whatsapp.url} target="_blank" rel="noopener" className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
          <ExternalLink className="h-4 w-4" />
          <span className="text-xs">Quero saber mais</span>
        </a>
      </div>
    </main>
  );
}
