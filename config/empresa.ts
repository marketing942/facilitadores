// Dados da empresa. Endereço conferido pelo CEP (ViaCEP): o CEP é de uma praça, então não traz número.

export const EMPRESA = {
  cnpj: "57.347.872/0001-48",
  /** A chave Pix é o próprio CNPJ; o app do banco pede só os números. */
  pixCnpj: "57347872000148",
  cep: "55002-150",
  logradouro: "Praça Presidente Getúlio Vargas",
  bairro: "Nossa Senhora das Dores",
  cidade: "Caruaru",
  uf: "PE",
};

export const ENDERECO_COMPLETO = `${EMPRESA.logradouro}, ${EMPRESA.bairro}, ${EMPRESA.cidade} - ${EMPRESA.uf}, CEP ${EMPRESA.cep}`;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENDERECO_COMPLETO)}`;

/** Telefones. `whatsapp` = número com DDI, para o link wa.me (só nos números de atendimento). */
export const TELEFONES = [
  { nome: "Atendimento Colégio", exibicao: "(81) 99408-6174", digitos: "81994086174", whatsapp: "5581994086174" },
  { nome: "Atendimento CPPEM", exibicao: "(81) 97310-5354", digitos: "81973105354", whatsapp: "5581973105354" },
  { nome: "Atendimento Unicive", exibicao: "(81) 99264-0766", digitos: "81992640766", whatsapp: "5581992640766" },
  { nome: "Telefone fixo", exibicao: "(81) 3789-0371", digitos: "8137890371", whatsapp: null },
];
