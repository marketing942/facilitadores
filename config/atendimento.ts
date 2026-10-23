// Links de atendimento e suporte do Grupo CPPEM. Para incluir, trocar ou remover um canal,
// basta editar esta lista: a página /atendimento e os filtros se montam sozinhos.

export const BUS = ["CPPEM", "Colégio", "Unicive"] as const;
export type Bu = (typeof BUS)[number];

export type Channel = "Humano" | "IA";
export type Kind = "Atendimento" | "Suporte";

/** Nome completo de cada BU (o filtro usa o nome curto, igual à página de links da Guru). */
export const BU_NAMES: Record<Bu, string> = {
  CPPEM: "Cppem Concursos",
  Colégio: "Colégio Cppem",
  Unicive: "Unicive Caruaru",
};

export type ServiceLink = {
  id: string;
  /** Ex.: "Atendimento Humano" (a BU aparece à parte, na etiqueta e no grupo) */
  title: string;
  bu: Bu;
  kind: Kind;
  channel: Channel;
  url: string;
  /** Foto do contato, em /public/contatos. */
  photo: string;
};

const PHOTOS: Record<string, string> = {
  "CPPEM Atendimento Humano": "cppem-humano",
  "CPPEM Atendimento IA": "cppem-atendimento-ia",
  "CPPEM Suporte Humano": "cppem-humano",
  "CPPEM Suporte IA": "cppem-suporte-ia",
  "Colégio Atendimento Humano": "colegio-humano",
  "Colégio Atendimento IA": "colegio-atendimento-ia",
  "Unicive Atendimento Humano": "unicive-humano",
  "Unicive Atendimento IA": "unicive-atendimento-ia",
};

function link(bu: Bu, kind: Kind, channel: Channel, url: string): ServiceLink {
  return {
    id: url.replace(/^https?:\/\//, ""),
    title: `${kind} ${channel}`,
    bu,
    kind,
    channel,
    url,
    photo: `/contatos/${PHOTOS[`${bu} ${kind} ${channel}`]}.jpg`,
  };
}

export const SERVICE_LINKS: ServiceLink[] = [
  link("CPPEM", "Atendimento", "Humano", "https://pxa.cppem.com.br/lt/cppem-contato"),
  link("CPPEM", "Atendimento", "IA", "https://links.cppem.com.br/contato-cppem-ass"),
  link("CPPEM", "Suporte", "Humano", "https://links.cppem.com.br/suporte-cppem-equipe"),
  link("CPPEM", "Suporte", "IA", "https://links.cppem.com.br/suporte-cppem-ass"),
  link("Colégio", "Atendimento", "Humano", "https://pxa.cppem.com.br/lt/colegio-contato"),
  link("Colégio", "Atendimento", "IA", "https://links.cppem.com.br/contato-colegio-ass"),
  link("Unicive", "Atendimento", "Humano", "https://pxa.cppem.com.br/lt/unicive-contato"),
  link("Unicive", "Atendimento", "IA", "https://links.cppem.com.br/contato-unicive-ass"),
];
