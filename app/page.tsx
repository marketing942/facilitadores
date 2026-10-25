import Link from "next/link";
import { GROUPS, linkProps } from "@/config/tools";

// Página inicial (/): os cartões de todas as abas, por grupo. Monta-se sozinha a partir de config/tools.tsx.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:py-16">
      <div className="mb-6 text-center sm:mb-10">
        <div className="eyebrow mb-3 justify-center sm:mb-4">Grupo CPPEM</div>
        <h1 className="page-title mb-2 text-2xl sm:mb-3 sm:text-4xl">Utilitários da equipe</h1>
        <p className="text-base text-ink-soft">Ferramentas e informações internas, num só lugar</p>
      </div>

      <div data-tour="home" className="space-y-7 sm:space-y-10">
        {GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={`g-${group.id}`}>
            <div className="mb-3 flex items-baseline justify-between gap-3 sm:mb-4">
              <h2 id={`g-${group.id}`} className="eyebrow">
                {group.label}
              </h2>
              <p className="hidden text-xs text-muted sm:block">{group.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
              {group.tools.map((tool) => (
                <Link key={tool.href} href={tool.href} {...linkProps(tool)} className="group">
                  <div className="flex h-full items-start gap-3.5 rounded-xl border border-line bg-surface p-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-line-active sm:block sm:p-6">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-gold/10 text-gold-light transition-colors group-hover:bg-gold/20 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-xl">
                      {tool.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="mb-0.5 font-display text-base font-bold uppercase leading-snug tracking-tight text-ink sm:mb-1 sm:text-lg">
                        {tool.title}
                      </h3>
                      <p className="line-clamp-2 text-[13px] leading-snug text-ink-soft sm:line-clamp-none sm:text-sm">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
