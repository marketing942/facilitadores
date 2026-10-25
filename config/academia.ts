// Parceria Selfit: Plano Plus Corporativo. A lista completa de unidades (com coordenadas) fica em
// public/selfit-unidades.json, baixada do site da Selfit; refaça o download quando abrirem unidades novas.

export const SELFIT_SITE = "https://www.selfitacademias.com.br/unidades";

export const BENEFICIO = {
  plano: "Plano Plus Corporativo Selfit",
  quem: "Alunos e colaboradores do CPPEM e, conforme as regras da Selfit, dependentes legais dos colaboradores.",
  mensalidade: "R$ 119,90",
  isencoes: ["Matrícula", "Anuidade", "Multa de cancelamento"],
  inclui: ["Musculação", "Funcional", "Alta intensidade", "Aulas coletivas", "Cardio"],
  abrangencia: "Vale em todas as unidades Selfit do Brasil.",
};

export type Unidade = {
  nome: string;
  endereco: string;
  cidade: string;
  uf: string;
  lat: number;
  lng: number;
  url: string;
  emBreve: boolean;
};

/** Unidades de Caruaru (site da Selfit, outubro de 2026). */
export const CARUARU: Unidade[] = [
  { nome: "Caruaru", endereco: "Av. Oswaldo Cruz, 217 · Empresarial Maurício de Nassau Trade Center, Maurício de Nassau", cidade: "Caruaru", uf: "PE", lat: -8.28067, lng: -35.97102, url: "https://www.selfitacademias.com.br/academias/pernambuco/caruaru/selfit-caruaru", emBreve: false },
  { nome: "Indianópolis", endereco: "Av. José Rodrigues de Jesus, 120, Indianópolis", cidade: "Caruaru", uf: "PE", lat: -8.28771, lng: -35.96331, url: "https://www.selfitacademias.com.br/academias/pernambuco/caruaru/indianopolis", emBreve: false },
  { nome: "Leão Dourado", endereco: "Av. Leão Dourado, 1664, Kennedy", cidade: "Caruaru", uf: "PE", lat: -8.28621, lng: -35.99656, url: "https://www.selfitacademias.com.br/academias/pernambuco/caruaru/leao-dourado", emBreve: false },
  { nome: "Life Center", endereco: "R. Cleto Campelo, 119, Nossa Sra. das Dores", cidade: "Caruaru", uf: "PE", lat: -8.2832, lng: -35.9689, url: "https://www.selfitacademias.com.br/academias/pernambuco/caruaru/life-center", emBreve: true },
];

export const rotaUrl = (u: Pick<Unidade, "lat" | "lng">) =>
  `https://www.google.com/maps/dir/?api=1&destination=${u.lat},${u.lng}`;
