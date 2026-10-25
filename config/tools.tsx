import type { ReactNode } from "react";
import {
  Briefcase,
  Building2,
  Calculator,
  CreditCard,
  FileX2,
  Home,
  Link2,
  MessageCircle,
  Users,
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

export const HOME_NAV = {
  href: "/",
  label: "Início",
  icon: <Home className={icon} />,
};

export const GROUPS: Group[] = [
  {
    id: "geral",
    label: "Geral",
    description: "Wi-Fi e dados da empresa para o dia a dia",
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
  return GROUPS.find((group) => group.tools.some((tool) => pathname.startsWith(tool.href))) ?? null;
}
