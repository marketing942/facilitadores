// Sistemas e links internos, numa aba só. As tags (setor) servem para organizar e filtrar.
// Para incluir um acesso novo, acrescente uma linha aqui. A tag "Todas" faz o item aparecer em qualquer filtro.

export const SETORES = ["Comercial", "Gestão", "Marketing", "Pedagógico", "Tecnologia"] as const;
export type Setor = (typeof SETORES)[number];
export type Tag = Setor | "Todas";

export type Acesso = { nome: string; descricao: string; url: string; tags: Tag[] };

export const ACESSOS: Acesso[] = [
  {
    nome: "Meu Hub Notion",
    descricao: "Hub pessoal de cada colaborador, no Notion.",
    url: "https://app.notion.com/p/cppem/379bbae8074c807e9a2fec244cdac258?v=68fbbae8074c832f9f5108cd861cc2f9&source=copy_link",
    tags: ["Todas"],
  },
  {
    nome: "G4 Skills vitalício",
    descricao: "Plataforma de cursos G4 Business (acesso vitalício).",
    url: "https://online.g4business.com/",
    tags: ["Todas"],
  },
  {
    nome: "Regras e processos",
    descricao: "Regras e processos da empresa, no Notion.",
    url: "https://app.notion.com/p/cppem/REGRAS-E-PROCESSOS-3abbbae8074c8048a8a3e95195e4144f?source=copy_link",
    tags: ["Todas"],
  },
  {
    nome: "Jarvis",
    descricao: "Sistema Jarvis da CPPEM.",
    url: "https://jarvis.cppem.com.br/",
    tags: ["Gestão"],
  },
  {
    nome: "Dashboard da meta de vendas",
    descricao: "Acompanhamento da meta de vendas do time.",
    url: "https://hub-comercial-v2.vercel.app/dashboard",
    tags: ["Comercial"],
  },
  {
    nome: "Criação de links de contato WhatsApp",
    descricao: "Gerador de link de WhatsApp do Kommo.",
    url: "https://www.kommo.com/br/gerar-link-do-whatsapp/",
    tags: ["Comercial", "Marketing"],
  },
  {
    nome: "Criação de links encurtados",
    descricao: "Painel do Short.io para criar links curtos.",
    url: "https://app.short.io/users/dashboard/1511602/links?folder=rAfrm7srfhL4F7XKW9uWW",
    tags: ["Tecnologia", "Marketing"],
  },
  {
    nome: "Registrador de números para API oficial",
    descricao: "Requisição do Postman (Meta WhatsApp Business Platform) para registrar números na API oficial.",
    url: "https://www.postman.com/meta/whatsapp-business-platform/http-request/create?example=13382743-7788cbd8-c64d-4e16-925a-058d6e3724f6&requestId=beb41216-3728-4dca-9c74-1763c85249be&sideView=agentMode",
    tags: ["Tecnologia", "Marketing"],
  },
  {
    nome: "Sistema de NPS",
    descricao: "Pesquisa de satisfação (NPS) do Colégio e Cursos.",
    url: "https://nps-cppem-colegio-e-cursos.vercel.app/",
    tags: ["Pedagógico"],
  },
  {
    nome: "Admin do site de vagas",
    descricao: "Login do painel de administração do site de vagas de trabalho.",
    url: "https://vagas.cppem.com.br/admin/login",
    tags: [],
  },
  {
    nome: "Livro dos Recordes",
    descricao: "Livro dos Recordes da equipe.",
    url: "https://links.cppem.com.br/recordes-equipe",
    tags: [],
  },
];
