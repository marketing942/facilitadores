import Link from "next/link";
import { TOOLS } from "@/config/tools";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-16">
      <div className="mb-10 text-center">
        <div className="eyebrow mb-4 justify-center">Time Comercial</div>
        <h1 className="page-title mb-3 text-3xl sm:text-4xl">Ferramentas do Time Comercial</h1>
        <p className="text-base text-ink-soft">Escolha o que você precisa para o dia a dia de vendas</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <div className="h-full rounded-xl border border-line bg-surface p-6 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-line-active">
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${tool.bubble}`}
              >
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
