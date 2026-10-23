import Link from "next/link";
import { TOOLS } from "@/config/tools";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:py-16">
      <div className="mb-6 text-center sm:mb-10">
        <div className="eyebrow mb-3 justify-center sm:mb-4">Time Comercial</div>
        <h1 className="page-title mb-2 text-2xl sm:mb-3 sm:text-4xl">Ferramentas do Time Comercial</h1>
        <p className="text-base text-ink-soft">Escolha o que você precisa para o dia a dia de vendas</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <div className="flex h-full items-start gap-3.5 rounded-xl border border-line bg-surface p-4 transition-all sm:block sm:p-6 duration-200 group-hover:-translate-y-0.5 group-hover:border-line-active">
              <div
                className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg transition-colors sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl ${tool.bubble}`}
              >
                {tool.icon}
              </div>
              <div className="min-w-0">
              <h2 className="mb-0.5 font-display text-base font-bold uppercase leading-snug tracking-tight text-ink sm:mb-1 sm:text-lg">{tool.title}</h2>
              <p className="line-clamp-2 text-[13px] leading-snug text-ink-soft sm:line-clamp-none sm:text-sm">{tool.description}</p>
              <span className="mt-4 hidden sm:inline-block rounded-full bg-gold/10 px-2 py-1 text-xs font-medium text-gold-light">
                Disponível
              </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
