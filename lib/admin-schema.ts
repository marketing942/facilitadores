import { BUS, CHANNELS, KINDS } from "@/config/atendimento";
import { SETORES } from "@/config/ferramentas";
import { SOCIAL_KEYS } from "@/config/redes";
import { TAGS } from "@/lib/tags";

// O que cada tabela tem de editável no painel /admin. Os formulários e as ações (app/admin/actions.ts)
// saem desta lista: para um campo novo, crie a coluna numa migração e acrescente aqui.
export type FieldType = "text" | "textarea" | "url" | "select" | "tags" | "lines" | "bool" | "checks" | "number";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly string[];
  hint?: string;
  placeholder?: string;
};

export type Entity = {
  key: string;
  table: string;
  /** Coluna da chave: "id" (uuid) ou "slug" (livros) */
  pk: "id" | "slug";
  titulo: string;
  singular: string;
  fields: Field[];
  /** Linha de resumo e linha de apoio na lista */
  summary: (row: Record<string, any>) => string; // eslint-disable-line @typescript-eslint/no-explicit-any
  sub?: (row: Record<string, any>) => string; // eslint-disable-line @typescript-eslint/no-explicit-any
  /** Colunas com valor fixo nesta tabela (ex.: tipo da trilha) */
  fixed?: Record<string, string>;
  /** Coluna que liga ao registro pai (tabelas filhas) */
  parent?: string;
  /** Gera a coluna slug a partir deste campo, quando a tabela tem slug que não é a chave */
  slugFrom?: string;
  tag: string;
  child?: string;
};

const ordem: Field = { name: "position", label: "Ordem", type: "number", hint: "Número menor aparece primeiro. Vazio: vai para o fim." };

export const ENTITIES: Record<string, Entity> = {
  atendimento: {
    key: "atendimento", table: "atendimento_links", pk: "id", titulo: "Links de atendimento", singular: "link", tag: TAGS.atendimento,
    summary: (r) => `${r.bu} · ${r.kind} ${r.channel}`,
    sub: (r) => `${r.url}${r.ativo ? "" : " (oculto)"}`,
    fields: [
      { name: "bu", label: "Empresa (BU)", type: "select", options: BUS, required: true },
      { name: "kind", label: "Tipo", type: "select", options: KINDS, required: true },
      { name: "channel", label: "Canal", type: "select", options: CHANNELS, required: true },
      { name: "url", label: "Link", type: "url", required: true },
      { name: "photo", label: "Foto do contato", type: "text", hint: "Caminho em /public (ex.: /contatos/cppem-humano.jpg) ou endereço completo da imagem." },
      { name: "ativo", label: "Aparece no site", type: "bool" },
      ordem,
    ],
  },
  telefones: {
    key: "telefones", table: "telefones", pk: "id", titulo: "Telefones", singular: "telefone", tag: TAGS.empresa,
    summary: (r) => r.nome, sub: (r) => r.exibicao,
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true, placeholder: "Atendimento CPPEM" },
      { name: "exibicao", label: "Como aparece", type: "text", required: true, placeholder: "(81) 99999-9999" },
      { name: "digitos", label: "Só os números (para copiar)", type: "text", required: true, placeholder: "81999999999" },
      { name: "whatsapp", label: "WhatsApp com DDI", type: "text", hint: "Ex.: 5581999999999. Vazio: sem botão de WhatsApp.", placeholder: "5581999999999" },
      ordem,
    ],
  },
  wifi: {
    key: "wifi", table: "wifi_redes", pk: "id", titulo: "Redes internas", singular: "rede interna", tag: TAGS.wifi,
    summary: (r) => r.nome, sub: () => "Senha só aparece para quem digitou a senha da equipe",
    fields: [
      { name: "nome", label: "Nome da rede", type: "text", required: true },
      { name: "senha", label: "Senha", type: "text", required: true },
      ordem,
    ],
  },
  ferramentas: {
    key: "ferramentas", table: "ferramentas", pk: "id", titulo: "Sistemas e links", singular: "sistema", tag: TAGS.ferramentas,
    summary: (r) => r.nome, sub: (r) => (r.tags as string[]).join(", "),
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "descricao", label: "Descrição", type: "textarea" },
      { name: "url", label: "Link", type: "url", required: true },
      { name: "tags", label: "Setores", type: "checks", options: ["Todas", ...SETORES], hint: "\"Todas\" faz o item aparecer em qualquer filtro." },
      ordem,
    ],
  },
  livros: {
    key: "livros", table: "livros", pk: "slug", titulo: "Livros", singular: "livro", tag: TAGS.biblioteca, slugFrom: "titulo",
    summary: (r) => r.titulo, sub: (r) => r.autor,
    fields: [
      { name: "titulo", label: "Título", type: "text", required: true },
      { name: "autor", label: "Autor", type: "text" },
      { name: "categorias", label: "Temas", type: "tags", hint: "Separe por vírgula. Ex.: Mindset, Vendas" },
      { name: "objetivos", label: "O que o livro entrega", type: "lines", hint: "Um item por linha." },
      { name: "publico", label: "Para quem é", type: "lines", hint: "Um item por linha." },
      { name: "notion", label: "Página no Notion", type: "url" },
      { name: "compra", label: "Link de compra", type: "url" },
      { name: "capa", label: "Endereço da capa", type: "url", hint: "Vazio: usa /biblioteca/<slug>.jpg." },
      { name: "preenchido", label: "Ficha completada pela CPPEM", type: "bool" },
      ordem,
    ],
  },
  redes_bus: {
    key: "redes_bus", table: "redes_bus", pk: "id", titulo: "Empresas e redes sociais", singular: "empresa", tag: TAGS.redes, slugFrom: "nome", child: "redes",
    summary: (r) => r.nome, sub: (r) => r.descricao,
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "descricao", label: "Descrição", type: "text" },
      { name: "site_label", label: "Site (texto)", type: "text", placeholder: "cppem.com.br" },
      { name: "site_url", label: "Site (link)", type: "url" },
      ordem,
    ],
  },
  redes: {
    key: "redes", table: "redes", pk: "id", titulo: "Redes", singular: "rede", tag: TAGS.redes, parent: "bu_id",
    summary: (r) => r.label, sub: (r) => r.perfil,
    fields: [
      { name: "key", label: "Ícone", type: "select", options: SOCIAL_KEYS, required: true },
      { name: "label", label: "Nome", type: "text", required: true, placeholder: "Instagram" },
      { name: "perfil", label: "Perfil", type: "text", placeholder: "@cppemconcursos" },
      { name: "url", label: "Link", type: "url", required: true },
      ordem,
    ],
  },
  trilhas_g4: {
    key: "trilhas_g4", table: "trilhas", pk: "id", titulo: "Trilhas G4 Skills", singular: "trilha", tag: TAGS.trilhas, fixed: { tipo: "g4" }, slugFrom: "nome", child: "cursos_g4",
    summary: (r) => r.nome, sub: (r) => r.area,
    fields: [
      { name: "nome", label: "Nome da trilha", type: "text", required: true },
      { name: "area", label: "Área", type: "text", required: true, hint: "As áreas do filtro vêm daqui. Use o mesmo texto para agrupar." },
      ordem,
    ],
  },
  trilhas_interna: {
    key: "trilhas_interna", table: "trilhas", pk: "id", titulo: "Trilhas Internas", singular: "trilha", tag: TAGS.trilhas, fixed: { tipo: "interna" }, slugFrom: "nome", child: "cursos_interna",
    summary: (r) => r.nome, sub: (r) => r.area,
    fields: [
      { name: "nome", label: "Nome da trilha", type: "text", required: true },
      { name: "area", label: "Área", type: "text", required: true, hint: "As áreas do filtro vêm daqui. Use o mesmo texto para agrupar." },
      ordem,
    ],
  },
  cursos_g4: undefined as never,
  cursos_interna: undefined as never,
};

const cursoFields = (interna: boolean): Field[] => [
  { name: "titulo", label: "Título", type: "text", required: true },
  { name: "url", label: "Link", type: "url", required: true },
  ...(interna
    ? ([
        { name: "descricao", label: "Resumo", type: "textarea" },
        { name: "formatos", label: "Formatos", type: "tags", hint: "Separe por vírgula. Ex.: Vídeo, Texto" },
      ] as Field[])
    : ([{ name: "emoji", label: "Emoji", type: "text" }] as Field[])),
  ordem,
];

for (const [key, interna] of [["cursos_g4", false], ["cursos_interna", true]] as const) {
  ENTITIES[key] = {
    key, table: "trilha_cursos", pk: "id", titulo: "Cursos", singular: "curso", tag: TAGS.trilhas, parent: "trilha_id",
    summary: (r) => r.titulo, sub: (r) => r.url, fields: cursoFields(interna),
  };
}

export type Secao = {
  slug: string;
  titulo: string;
  descricao: string;
  entity?: string;
  setting?: { key: string; titulo: string; fields: Field[] };
  /** Seção extra (lista) abaixo do formulário */
  extra?: string;
};

export const SECOES: Secao[] = [
  { slug: "atendimento", titulo: "Atendimento", descricao: "Links de atendimento e suporte por empresa", entity: "atendimento" },
  {
    slug: "empresa", titulo: "Dados da empresa", descricao: "CNPJ, Pix, endereço e telefones", extra: "telefones",
    setting: {
      key: "empresa", titulo: "Dados principais",
      fields: [
        { name: "cnpj", label: "CNPJ", type: "text", required: true },
        { name: "pix_cnpj", label: "Chave Pix (só números)", type: "text", required: true },
        { name: "pix_banco", label: "Banco da chave Pix", type: "text", placeholder: "Banco BTG Pactual" },
        { name: "cep", label: "CEP", type: "text" },
        { name: "logradouro", label: "Logradouro", type: "text" },
        { name: "bairro", label: "Bairro", type: "text" },
        { name: "cidade", label: "Cidade", type: "text" },
        { name: "uf", label: "UF", type: "text" },
      ],
    },
  },
  {
    slug: "wifi", titulo: "Wi-Fi", descricao: "Rede de visitantes (com QR Code) e redes internas", extra: "wifi",
    setting: {
      key: "wifi_visitantes", titulo: "Rede de visitantes (pública, vai no QR Code)",
      fields: [
        { name: "nome", label: "Nome da rede", type: "text", required: true },
        { name: "senha", label: "Senha", type: "text", required: true },
      ],
    },
  },
  { slug: "redes", titulo: "Redes sociais", descricao: "Redes de cada empresa", entity: "redes_bus" },
  { slug: "ferramentas", titulo: "Sistemas e links", descricao: "Sistemas e links internos por setor", entity: "ferramentas" },
  { slug: "biblioteca", titulo: "Biblioteca", descricao: "Livros do time", entity: "livros" },
  { slug: "trilhas-g4", titulo: "Trilhas G4 Skills", descricao: "Trilhas e cursos do G4", entity: "trilhas_g4" },
  { slug: "trilhas-internas", titulo: "Trilhas Internas", descricao: "Treinamentos feitos pelo time", entity: "trilhas_interna" },
];
