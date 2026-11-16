// Tipos e constantes de Links de atendimento e suporte. Os links em si ficam no banco (tabela
// atendimento_links) e são editados em /admin/atendimento.

export const BUS = ["CPPEM", "Colégio", "Unicive"] as const;
export type Bu = (typeof BUS)[number];

export type Channel = "Humano" | "IA";
export type Kind = "Atendimento" | "Suporte";

export const CHANNELS: Channel[] = ["Humano", "IA"];
export const KINDS: Kind[] = ["Atendimento", "Suporte"];

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
  /** Foto do contato: caminho em /public/contatos ou endereço completo. */
  photo: string;
};
