// Tipos e montagem do endereço dos Dados da empresa. Os valores ficam no banco (settings 'empresa' e
// tabela telefones) e são editados em /admin/empresa.

export type Empresa = {
  cnpj: string;
  /** A chave Pix é o próprio CNPJ; o app do banco pede só os números. */
  pix_cnpj: string;
  pix_banco: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export const EMPRESA_VAZIA: Empresa = { cnpj: "", pix_cnpj: "", pix_banco: "", cep: "", logradouro: "", bairro: "", cidade: "", uf: "" };

/** Telefones. `whatsapp` = número com DDI, para o link wa.me (só nos números de atendimento). */
export type Telefone = { id: string; nome: string; exibicao: string; digitos: string; whatsapp: string | null };

export const enderecoCompleto = (e: Empresa) => `${e.logradouro}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}`;

export const mapsUrl = (e: Empresa) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto(e))}`;
