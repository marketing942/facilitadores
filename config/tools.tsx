import type { ReactNode } from "react";

// As ferramentas do sistema: usadas na página inicial e na barra de navegação.
// Cada uma tem uma cor própria (botões da navbar e ícone dos cartões). As classes ficam
// escritas por extenso para o Tailwind enxergá-las.

export type Tool = {
  href: string;
  /** Texto curto, no menu */
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
  /** Botão do menu: parado, com o mouse e na aba aberta */
  nav: string;
  navActive: string;
  /** Fundo e cor do ícone no cartão da página inicial */
  bubble: string;
};

const stroke = { fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 } as const;

export const HOME_NAV = {
  href: "/",
  label: "Início",
  nav: "border-gold/35 bg-gold/10 text-gold-light hover:bg-gold/20",
  navActive: "border-gold-light bg-gold/25 text-gold-pale",
};

export const TOOLS: Tool[] = [
  {
    href: "/atendimento",
    label: "Atendimento",
    title: "Links de atendimento e suporte",
    description: "Todos os links de atendimento e suporte, por empresa e por tipo (humano ou IA), prontos para copiar",
    icon: (
      <svg className="h-6 w-6" {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    nav: "border-violet-400/35 bg-violet-400/10 text-violet-300 hover:bg-violet-400/20",
    navActive: "border-violet-300 bg-violet-400/25 text-violet-100",
    bubble: "bg-violet-400/10 text-violet-300 group-hover:bg-violet-400/20",
  },
  {
    href: "/links",
    label: "Links",
    title: "Links de pagamento Guru",
    description: "Busque o produto e copie o link de pagamento. As ofertas ativas da Guru aparecem sozinhas.",
    icon: (
      <svg className="h-6 w-6" {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    nav: "border-sky-400/35 bg-sky-400/10 text-sky-300 hover:bg-sky-400/20",
    navActive: "border-sky-300 bg-sky-400/25 text-sky-100",
    bubble: "bg-sky-400/10 text-sky-300 group-hover:bg-sky-400/20",
  },
  {
    href: "/calculadora",
    label: "Guru + Stone",
    title: "Calculadora Guru + Stone",
    description: "Simule juros, parcelas e o valor líquido recebido via Guru + Stone",
    icon: (
      <svg className="h-6 w-6" {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    nav: "border-emerald-400/35 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20",
    navActive: "border-emerald-300 bg-emerald-400/25 text-emerald-100",
    bubble: "bg-emerald-400/10 text-emerald-300 group-hover:bg-emerald-400/20",
  },
  {
    href: "/calculadora-ton",
    label: "TON",
    title: "Calculadora Maquineta TON",
    description: "Simule taxas da TON por plano (Super, Turbo, Max) em Pix, débito e crédito parcelado",
    icon: (
      <svg className="h-6 w-6" {...stroke}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    nav: "border-orange-400/35 bg-orange-400/10 text-orange-300 hover:bg-orange-400/20",
    navActive: "border-orange-300 bg-orange-400/25 text-orange-100",
    bubble: "bg-orange-400/10 text-orange-300 group-hover:bg-orange-400/20",
  },
];
