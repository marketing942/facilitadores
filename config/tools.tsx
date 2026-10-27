import type { ReactNode } from "react";
import {
  BookOpen,
  Briefcase,
  CarFront,
  Building2,
  Bus,
  Calculator,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  FileX2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Lightbulb,
  Link2,
  MessageCircle,
  Route,
  School,
  Share2,
  Store,
  Trophy,
  Users,
  UtensilsCrossed,
  Wallet,
  Wifi,
  Wrench,
} from "lucide-react";

// O sistema de utilitários da equipe. Cada ferramenta pertence a um GRUPO; o menu do topo (desktop),
// a barra de baixo (celular) e a página inicial se montam sozinhos a partir desta lista. Para criar
// uma aba nova: acrescente a ferramenta no grupo certo (ou crie um grupo, se for um assunto novo).

export type Tool = {
  href: string;
  /** Texto do menu */
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
  /** Abre um site de fora em nova aba (o href é a URL completa) */
  externo?: boolean;
};

export type Group = {
  id: string;
  /** Nome do grupo no menu */
  label: string;
  /** Resumo, na página inicial */
  description: string;
  icon: ReactNode;
  tools: Tool[];
};

const icon = "h-6 w-6";

export const GROUPS: Group[] = [
  {
    id: "geral",
    label: "Geral",
    description: "Wi-Fi, dados da empresa, redes sociais e o Livro dos Recordes",
    icon: <Users className={icon} />,
    tools: [
      {
        href: "/wifi",
        label: "Wi-Fi",
        title: "Wi-Fi",
        description: "Rede e QR Code para visitantes e senhas das redes internas",
        icon: <Wifi className={icon} />,
      },
      {
        href: "/empresa",
        label: "Dados da empresa",
        title: "Dados da empresa",
        description: "CNPJ, chave Pix, endereço e telefones, prontos para copiar",
        icon: <Building2 className={icon} />,
      },
      {
        href: "https://links.cppem.com.br/recordes-equipe",
        label: "Livro dos Recordes",
        title: "Livro dos Recordes",
        description: "Os recordes e conquistas da equipe",
        icon: <Trophy className={icon} />,
        externo: true,
      },
      {
        href: "/redes-sociais",
        label: "Redes sociais",
        title: "Redes sociais",
        description: "Todas as redes de cada BU, prontas para abrir e copiar",
        icon: <Share2 className={icon} />,
      },
    ],
  },
  {
    id: "comercial",
    label: "Comercial",
    description: "Atendimento, links de pagamento e calculadoras de venda",
    icon: <Briefcase className={icon} />,
    tools: [
      {
        href: "/atendimento",
        label: "Atendimento",
        title: "Links de atendimento e suporte",
        description: "Todos os links de atendimento e suporte, por BU e por tipo (humano ou IA), prontos para copiar",
        icon: <MessageCircle className={icon} />,
      },
      {
        href: "/links",
        label: "Links Guru",
        title: "Links de pagamento Guru",
        description: "Busque o produto e copie o link de pagamento. As ofertas ativas da Guru aparecem sozinhas.",
        icon: <Link2 className={icon} />,
      },
      {
        href: "/calculadora",
        label: "Guru + Stone",
        title: "Calculadora Guru + Stone",
        description: "Simule juros, parcelas e o valor líquido recebido via Guru + Stone",
        icon: <Calculator className={icon} />,
      },
      {
        href: "/calculadora-ton",
        label: "TON",
        title: "Calculadora Maquineta TON",
        description: "Simule taxas da TON por plano (Super, Turbo, Max) em Pix, débito e crédito parcelado",
        icon: <CreditCard className={icon} />,
      },
      {
        href: "/cancelamento",
        label: "Cancelamento",
        title: "Cancelamento e multa rescisória",
        description: "Multa rescisória, orçamento de restituição, modelo de demonstrativo, sistemas e tutoriais",
        icon: <FileX2 className={icon} />,
      },
    ],
  },
  {
    id: "estudo",
    label: "Estudo",
    description: "Como estudar, trilhas de cursos, treinamentos internos e a biblioteca do time",
    icon: <BookOpen className={icon} />,
    tools: [
      {
        href: "/como-estudar",
        label: "Como estudar",
        title: "Como estudar",
        description: "A pirâmide de aprendizagem: quanto mais ativo o estudo, mais você guarda",
        icon: <Lightbulb className={icon} />,
      },
      {
        href: "/trilhas",
        label: "Trilhas G4 Skills",
        title: "Trilhas G4 Skills",
        description: "Trilhas de cursos do G4 por área, com o passo a passo e o link de cada curso",
        icon: <GraduationCap className={icon} />,
      },
      {
        href: "/trilhas-internas",
        label: "Trilhas Internas",
        title: "Trilhas Internas",
        description: "Tutoriais e treinamentos feitos pelo nosso time, por área",
        icon: <Route className={icon} />,
      },
      {
        href: "/biblioteca",
        label: "Biblioteca",
        title: "Biblioteca",
        description: "Livros de estudo do time, com capa, resumo e para quem cada um é indicado",
        icon: <BookOpen className={icon} />,
      },
    ],
  },
  {
    id: "servicos",
    label: "Serviços",
    description: "Comida, academia, saúde, transporte, finanças, metas, educação e benefícios",
    icon: <Store className={icon} />,
    tools: [
      {
        href: "/food-service",
        label: "Food Service",
        title: "Food Service",
        description: "Restaurante parceiro, cantinas do prédio e apps de delivery",
        icon: <UtensilsCrossed className={icon} />,
      },
      {
        href: "/academia",
        label: "Academia",
        title: "Academia: Selfit",
        description: "Plano corporativo Selfit e a unidade mais perto de você",
        icon: <Dumbbell className={icon} />,
      },
      {
        href: "https://saude.cppem.com.br/login",
        label: "Saúde",
        title: "CPPEM Saúde",
        description: "Nosso app de saúde, bem-estar e conquistas",
        icon: <HeartPulse className={icon} />,
        externo: true,
      },
      {
        href: "/autoescola",
        label: "Autoescola",
        title: "Autoescola Dirija+",
        description: "Tire sua CNH de carro e moto com a parceria da Autoescola Dirija+",
        icon: <CarFront className={icon} />,
      },
      {
        href: "/transporte",
        label: "Transporte",
        title: "Transporte",
        description: "Cartão Leva para ônibus e apps de corrida",
        icon: <Bus className={icon} />,
      },
      {
        href: "/financas",
        label: "Finanças",
        title: "Finanças",
        description: "App Domínio Financeiro e o e-book de educação financeira",
        icon: <Wallet className={icon} />,
      },
      {
        href: "/metas",
        label: "Metas e organização",
        title: "Metas e organização pessoal",
        description: "App Life Board: metas do ano, rotina de treino, anotações e evolução",
        icon: <CalendarCheck className={icon} />,
      },
      {
        href: "/educacao",
        label: "Educação",
        title: "Educação",
        description: "Supletivo, faculdade EAD com bolsa e colégio para os filhos",
        icon: <School className={icon} />,
      },
      {
        href: "https://cppem.com.br/parceiros",
        label: "Parceiros",
        title: "Parceiros",
        description: "Rede de parceiros com benefícios e descontos para a equipe",
        icon: <Handshake className={icon} />,
        externo: true,
      },
    ],
  },
  {
    id: "ferramentas",
    label: "Ferramentas",
    description: "Sistemas e links internos, por setor",
    icon: <Wrench className={icon} />,
    tools: [
      {
        href: "/ferramentas",
        label: "Sistemas e links",
        title: "Sistemas e links",
        description: "Todos os sistemas e links internos, organizados por setor",
        icon: <Wrench className={icon} />,
      },
    ],
  },
];

/** Grupo ao qual o endereço pertence (null na página inicial). */
export function groupOf(pathname: string): Group | null {
  return GROUPS.find((group) => group.tools.some((tool) => !tool.externo && pathname.startsWith(tool.href))) ?? null;
}

/** Atributos de link: as abas externas abrem em nova aba. */
export function linkProps(tool: Tool) {
  return tool.externo ? { target: "_blank", rel: "noopener" } : {};
}
