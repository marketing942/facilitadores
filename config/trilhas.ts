// Trilhas G4 Skills (acesso vitalício da CPPEM), vindas do Notion. Cada trilha é um passo a passo de cursos.
// Para mudar uma trilha, edite a lista de cursos dela aqui (a ordem da lista é a ordem do passo a passo).

export type Curso = {
  titulo: string;
  emoji?: string;
  url: string;
  /** Resumo curto (usado nas Trilhas Internas) */
  descricao?: string;
  /** Vídeo, Texto, PDF... (usado nas Trilhas Internas) */
  formatos?: string[];
};
export type Trilha = { slug: string; nome: string; area: string; cursos: Curso[] };

/** Entrada da plataforma G4 Skills */
export const G4_URL = "https://online.g4business.com/";

export const AREAS = ["Vendas e clientes", "Marketing", "Liderança e pessoas", "Gestão e finanças", "Tecnologia"];

export const TRILHAS: Trilha[] = [
  {
    slug: "vendedor",
    nome: "Vendedor",
    area: "Vendas e clientes",
    cursos: [
      { titulo: "Assumindo a posição do vendedor", url: "https://plataforma.g4business.com/g4-skills/courses/3fe86134-3b76-41b4-973f-1054e65011cf" },
      { titulo: "Comunicação de alta performance", url: "https://plataforma.g4business.com/g4-skills/courses/cfe14284-49ca-48b3-9b84-857735a1b331" },
      { titulo: "Habilidades e comportamento fundamental para vendedores", url: "https://plataforma.g4business.com/g4-skills/courses/757515f9-eda2-4bca-93a4-5d2c4f8d9817" },
      { titulo: "Comunicação em vendas", url: "https://plataforma.g4business.com/g4-skills/courses/7cfbb3c9-63a2-439d-a867-f7ac31ed1a4e?openModules=%5B%2223bbaeb9-0c2c-47b4-9a75-acc7c397621d%22%2C%225447b73c-0d4e-44b5-b97e-8fdf95f57d08%22%2C%2226c64c9a-d2e7-4d4e-ab0c-71f0db23ae2a%22%5D" },
      { titulo: "Vendas pelo WhatsApp", url: "https://plataforma.g4business.com/g4-skills/courses/6a5fafce-9e9b-4f75-b392-ab02a9975b69" },
      { titulo: "Como controlar a conversa com o cliente", url: "https://plataforma.g4business.com/g4-skills/courses/b9b54693-8b7b-4bec-8c7f-e7f0a9d639c6" },
    ],
  },
  {
    slug: "gestao-comercial",
    nome: "Gestão comercial",
    area: "Vendas e clientes",
    cursos: [
      { titulo: "Fundamentos em vendas", emoji: "🧱", url: "https://plataforma.g4business.com/courses/7050a58b-4755-4858-9441-6efcd2890fea" },
      { titulo: "Comunicação em vendas", emoji: "🗣️", url: "https://plataforma.g4business.com/courses/7cfbb3c9-63a2-439d-a867-f7ac31ed1a4e" },
      { titulo: "Ecossistema de vendas", emoji: "🧩", url: "https://plataforma.g4business.com/courses/4448b4fb-5452-4b64-a2d7-4c1d2de5486d" },
      { titulo: "Negociação comercial", emoji: "🤝", url: "https://plataforma.g4business.com/g4-skills/courses/09ee6946-5738-4c5a-afe5-a72e08544b2a?openModules=%5B%2251cb4670-02c3-4007-a6fa-660fe89ca221%22%2C%224e67427e-72e1-423a-b68f-1aebc3f72b5d%22%2C%2291c53cdd-0e86-4ada-aacb-abba0618b90d%22%5D" },
      { titulo: "G4 Digital Commerce", emoji: "🛒", url: "https://plataforma.g4business.com/g4-skills/courses/c95b896e-93ac-417c-9143-c2fd13f4dd19" },
    ],
  },
  {
    slug: "analista-de-crm",
    nome: "Analista de CRM",
    area: "Vendas e clientes",
    cursos: [
      { titulo: "Fundamentos em vendas pelo WhatsApp", emoji: "💬", url: "https://plataforma.g4business.com/g4-skills/courses/56d6c5f6-bb5f-47c9-a15c-c76218264e3c?openModules=%5B%22782b56ea-e057-4212-971d-7dab735840de%22%2C%2212b44103-8252-46b1-9df1-2beb12cddae5%22%2C%22793cf398-f1dc-4b50-b3f6-dbf144d4fa46%22%5D" },
      { titulo: "Qualificação de leads", emoji: "🎯", url: "https://plataforma.g4business.com/courses/f2514a01-6fce-497f-9ca6-a1dc0632db5c" },
      { titulo: "Gatilhos mentais", emoji: "🧠", url: "https://plataforma.g4business.com/courses/3f4b8c4d-abe1-4a52-993a-81a1a84718c9" },
      { titulo: "Automações de marketing", emoji: "⚙️", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/92972df1-08c8-477f-a018-33517f9b7c23/" },
      { titulo: "Aumentando sua taxa de recompra", url: "https://plataforma.g4business.com/courses/38c8cd59-5d94-421b-97f7-d61f668c7d7e" },
      { titulo: "Email marketing", emoji: "⚙️", url: "https://plataforma.g4business.com/courses/eb6e58a8-8c17-4fdc-8ddf-945231f9e0c5" },
      { titulo: "Vendas pelo WhatsApp", emoji: "📲", url: "https://plataforma.g4business.com/g4-skills/courses/6a5fafce-9e9b-4f75-b392-ab02a9975b69?openModules=%5B%220f956276-9f7a-45ca-b766-a5eaed451ed9%22%2C%22713453a1-da66-451a-898b-455fa3b087ab%22%2C%221ea6e951-c987-4d69-a782-285e75e78900%22%5D" },
    ],
  },
  {
    slug: "experiencia-do-cliente",
    nome: "Experiência do cliente",
    area: "Vendas e clientes",
    cursos: [
      { titulo: "Fundamentos em experiência do cliente", emoji: "⭐", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/d1794d5b-e291-48e1-8b8c-a13d504e0e13" },
      { titulo: "Atendimento ao cliente", emoji: "🤝", url: "https://plataforma.g4business.com/courses/a49b05b7-b11e-4db9-806a-7d7bd8a534d9" },
      { titulo: "Introdução à gestão de produtos", emoji: "💼", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/be432c1c-1209-4d53-a5e1-2c2c1fad9d6d" },
      { titulo: "Product Discovery: da pesquisa à implementação de novos produtos", emoji: "🔎", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/31ea457b-c0cd-4c60-9082-9e8eb11a2b17" },
      { titulo: "Product Analytics: decisões de produtos baseado em dados", emoji: "📊", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/691dd8f5-9c74-499b-b313-607ab2aa4923" },
      { titulo: "Product Management", emoji: "🧭", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/7c6a6b2f-7c82-44de-9071-23c3460acfff" },
      { titulo: "Princípios da fidelização e retenção de clientes", emoji: "🔁", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/82db9884-7f25-4f53-b288-1f1c927d2cc4" },
      { titulo: "Princípios da resolução de conflitos", emoji: "🧩", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/354b38b8-edc2-41df-a651-8621e7624ff7" },
      { titulo: "Fundamentos em finanças", emoji: "💰", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/7720f2b4-deb4-4b43-9dd7-2179358cb0bc" },
    ],
  },
  {
    slug: "marketing",
    nome: "Marketing",
    area: "Marketing",
    cursos: [
      { titulo: "Como criar experiências de marca", emoji: "🎨", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/77db40aa-64d4-4766-93df-f00d1ec95922" },
      { titulo: "Planejamento de conteúdo para mídias sociais", emoji: "🗓️", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/fc622acf-e4cc-47fd-989b-966ff3f04331" },
      { titulo: "Automações de marketing", emoji: "⚙️", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/92972df1-08c8-477f-a018-33517f9b7c23" },
      { titulo: "Fundamentos em copywriting", emoji: "📝", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/0fbda32a-faa2-41a3-a997-978428935c5a" },
      { titulo: "Inbound marketing", emoji: "📥", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/a823d7cb-625f-4a0d-b3ed-b8ec41e72628" },
    ],
  },
  {
    slug: "canal-de-aquisicao",
    nome: "Canal de aquisição",
    area: "Marketing",
    cursos: [
      { titulo: "Inbound marketing", emoji: "📥", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/a823d7cb-625f-4a0d-b3ed-b8ec41e72628" },
      { titulo: "Google Ads", emoji: "🔎", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/4f776cfa-04fd-437f-9e62-0cfa18e66363" },
      { titulo: "Meta Ads", emoji: "♾️", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/9223544e-b89d-40fa-af3b-a616e67d041a" },
      { titulo: "Como criar um podcast na sua empresa", emoji: "🎙️", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/4d9c4ddb-e126-49dc-81a8-5425b3556d56" },
      { titulo: "SEO na prática", emoji: "🌐", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/701f6c2e-bb8e-45fa-bd15-31154249cbaf" },
      { titulo: "Email marketing", emoji: "✉️", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/eb6e58a8-8c17-4fdc-8ddf-945231f9e0c5" },
      { titulo: "Construindo um programa de indicação", emoji: "🤝", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/e3f7a799-f568-4383-a7d4-7d9cb725eee8" },
    ],
  },
  {
    slug: "lideranca-e-gestao-de-pessoas",
    nome: "Liderança e gestão de pessoas",
    area: "Liderança e pessoas",
    cursos: [
      { titulo: "Como liderar o desenvolvimento de pessoas", url: "https://plataforma.g4business.com/g4-skills/courses/8c711377-4936-4164-a062-8b14fa66f635" },
      { titulo: "Assumindo a posição de liderança", url: "https://plataforma.g4business.com/g4-skills/courses/0faeb567-9317-44a0-be55-8438a27d7288?openModules=%5B%226d8b64d1-62e6-445f-845a-0dfd10a33b5f%22%2C%228935ac7a-3894-4b97-82a6-3af51949df38%22%5D" },
      { titulo: "Liderança de alta performance", url: "https://plataforma.g4business.com/g4-skills/courses/c1fc53f2-6033-45e5-87c4-2c3e0974b7ed" },
      { titulo: "Comunicação de alta performance", url: "https://plataforma.g4business.com/g4-skills/courses/cfe14284-49ca-48b3-9b84-857735a1b331" },
      { titulo: "Cultura de feedback", url: "https://plataforma.g4business.com/g4-skills/courses/f5c55cee-0e98-488f-9005-7a0ce6fc6684" },
      { titulo: "Pensamento crítico", url: "https://plataforma.g4business.com/g4-skills/courses/1b0f82a1-8624-47d7-98d3-62ac7e2de613?openModules=%5B%22d9da2843-3819-4518-99da-459d9a8d6470%22%2C%224b895dd6-e2a0-43aa-9569-2fda44b362ec%22%2C%22d19a5f37-8758-4fc4-a1d5-39371ae8e332%22%5D" },
    ],
  },
  {
    slug: "cultura-e-lideranca",
    nome: "Cultura e liderança",
    area: "Liderança e pessoas",
    cursos: [
      { titulo: "Como tomar decisões difíceis", emoji: "💼", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/35f41603-6530-4954-b7f3-7cf9d3e736af" },
      { titulo: "Como liderar o desenvolvimento das pessoas", emoji: "💼", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/8c711377-4936-4164-a062-8b14fa66f635" },
      { titulo: "Assumindo a posição de liderança", emoji: "💼", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/0faeb567-9317-44a0-be55-8438a27d7288" },
      { titulo: "Liderança de alta performance", emoji: "💼", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/c1fc53f2-6033-45e5-87c4-2c3e0974b7ed" },
      { titulo: "Cultura e liderança", emoji: "💼", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/b826d2b1-fdc4-44d5-a125-90e22018e240" },
      { titulo: "Networking estratégico", emoji: "💼", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/16451a48-67c9-400b-ba93-e15b9de901bf" },
    ],
  },
  {
    slug: "rh-e-pessoas",
    nome: "RH e pessoas",
    area: "Liderança e pessoas",
    cursos: [
      { titulo: "Integrando o RH com sua estratégia de negócio", emoji: "👷‍♀️", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/9fd45de9-0691-44ad-913d-6b55c6f98985" },
      { titulo: "Fundamentos em recrutamento e seleção", emoji: "♻️", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/2d5b27a8-77b9-40f8-8148-07015c70233e" },
      { titulo: "Gestão da jornada do colaborador", emoji: "🤝", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/35dfb24c-5c6c-49d7-86f2-29db81493720" },
    ],
  },
  {
    slug: "gestao-e-negocio",
    nome: "Gestão e negócio",
    area: "Gestão e finanças",
    cursos: [
      { titulo: "Como fazer sua empresa crescer de forma sustentável", emoji: "🌱", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/8100b6ec-497d-4d1f-bf05-11fd8d1afcd6" },
      { titulo: "Como resolver dores de negócio com método", emoji: "🧩", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/b943bd42-a59a-4793-9bbf-37dbeb490e2a" },
      // ⚠️ no Notion, o link deste curso é o mesmo de "Como resolver dores de negócio com método": confira o link certo
      { titulo: "Reforma tributária na prática", emoji: "🧾", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/b943bd42-a59a-4793-9bbf-37dbeb490e2a" },
      { titulo: "Fundamentos em gestão por OKRs", emoji: "🎯", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/728e03b8-942c-45aa-9161-9dd2c7083dc6" },
      { titulo: "Arquitetura de receita", emoji: "🧱", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/0b295d92-85ab-440e-b01f-7fe8bf3c7933" },
      { titulo: "Construindo metas realistas e desafiadoras", emoji: "🏁", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/8545dd86-0e9b-4cdb-a651-cc2318d5403a" },
      { titulo: "Indicadores e métricas", emoji: "📊", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/19550e0e-bacf-42d4-9cd9-ace51e1b24a2" },
    ],
  },
  {
    slug: "gestao-financeira",
    nome: "Gestão financeira",
    area: "Gestão e finanças",
    cursos: [
      { titulo: "Como tomar decisões com base no cenário econômico", emoji: "📈", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/50b28610-8785-4cf5-8578-c190fb479a00" },
      { titulo: "Como se preparar para a reforma tributária", emoji: "🧾", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/8507eaec-12bc-4889-9a90-4f7d75b5109b" },
      { titulo: "Tomada de decisões com demonstrativos financeiros", emoji: "📊", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/ae48fb62-9c23-453c-91f9-7877b8f6ff94" },
      { titulo: "Estratégia e precificação", emoji: "🏷️", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/1505434f-678e-470c-b0e2-f552f2599fc2" },
    ],
  },
  {
    slug: "financas",
    nome: "Finanças",
    area: "Gestão e finanças",
    cursos: [
      { titulo: "Fundamentos em finanças", emoji: "💼", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/7720f2b4-deb4-4b43-9dd7-2179358cb0bc/lessons/9affad37-6fb4-46c8-a150-4bf95d7b9984?openModules=%5B%22f11e632f-b9c8-4487-b1bb-dddd8dcec4c3%22%5D" },
      // ⚠️ no Notion, o link deste curso é o mesmo de "Fundamentos em finanças": confira o link certo
      { titulo: "Contabilidade estratégica para empresas", emoji: "📊", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/7720f2b4-deb4-4b43-9dd7-2179358cb0bc" },
    ],
  },
  {
    slug: "tecnologia",
    nome: "Tecnologia",
    area: "Tecnologia",
    cursos: [
      { titulo: "Introdução à IA para negócios", emoji: "🤖", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/4268061e-9c27-431d-bd50-fbb9cabb9b78/lessons/fc024882-9865-4ab1-aa7b-cc909cf288e7?openModules=%5B%22c419f0ba-31ed-4e5d-a766-f66a63562bd6%22%5D" },
      { titulo: "Introdução à IA para finanças", emoji: "💰", url: "https://plataforma.g4business.com/g4-pass---vitalicio/courses/1b3ae197-e278-45cc-ac20-c0b213d24e23" },
      { titulo: "N8N para agentes", url: "https://plataforma.g4business.com/courses/91a332b0-c155-4acf-8444-a14b5bcb3d48" },
    ],
  },
];
