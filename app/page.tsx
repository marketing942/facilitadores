import Link from "next/link";

const tools = [
  {
    href: "/links",
    title: "Links de pagamento Guru",
    description: "Busque o produto e copie o link de pagamento. As ofertas ativas da Guru aparecem sozinhas.",
    icon: (
      <svg className="h-6 w-6 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    href: "/calculadora",
    title: "Calculadora Guru + Stone",
    description: "Simule juros, parcelas e o valor líquido recebido via Guru + Stone",
    icon: (
      <svg className="h-6 w-6 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/calculadora-ton",
    title: "Calculadora Maquineta TON",
    description: "Simule taxas da TON por plano (Super, Turbo, Max) em Pix, débito e crédito parcelado",
    icon: (
      <svg className="h-6 w-6 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-16">
      <div className="mb-10 text-center">
        <div className="eyebrow mb-4 justify-center">Time Comercial</div>
        <h1 className="page-title mb-3 text-3xl sm:text-4xl">Ferramentas do Time Comercial</h1>
        <p className="text-base text-ink-soft">Escolha o que você precisa para o dia a dia de vendas</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <div className="h-full rounded-xl border border-line bg-surface p-6 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-line-active">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/20">
                {tool.icon}
              </div>
              <h2 className="mb-1 font-display text-lg font-bold uppercase tracking-tight text-ink">{tool.title}</h2>
              <p className="text-sm text-ink-soft">{tool.description}</p>
              <span className="mt-4 inline-block rounded-full bg-gold/10 px-2 py-1 text-xs font-medium text-gold-light">
                Disponível
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
