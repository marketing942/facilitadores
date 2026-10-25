"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { GROUPS, groupOf, linkProps } from "@/config/tools";
import { AiLinks } from "@/components/ai-links";


export default function Navbar() {
  const pathname = usePathname();
  // O menu aberto vale só para a página em que foi aberto: ao navegar, fecha sozinho.
  const [menu, setMenu] = useState<{ id: string | null; path: string }>({ id: null, path: pathname });
  const open = menu.path === pathname ? menu.id : null;
  const setOpen = (id: string | null) => setMenu({ id, path: pathname });
  const root = useRef<HTMLDivElement>(null);

  const active = groupOf(pathname);
  const onHome = pathname === "/";
  const toolActive = (href: string) => pathname.startsWith(href);

  // Fecha ao tocar fora e com Esc.
  useEffect(() => {
    if (!open) return;
    const close = () => setMenu({ id: null, path: pathname });
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, pathname]);

  const idle = "border-gold/35 bg-gold/10 text-gold-light hover:bg-gold/20";
  const current = "border-gold-light bg-gold/25 text-gold-pale";

  return (
    <div ref={root} className="print:hidden">
      {/* Topo: marca (leva ao início) + um botão por grupo, que abre a lista das páginas dele, + atalhos de IA. */}
      <nav className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-lg" aria-label="Principal">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-12 items-center justify-between gap-4 sm:h-16">
            <Link
              href="/"
              aria-current={onHome ? "page" : undefined}
              className="min-w-0 shrink py-3 font-ui text-xs font-bold uppercase tracking-[0.1em] text-gold-light min-[400px]:text-sm min-[400px]:tracking-[0.14em]"
            >
              <span className="max-[399px]:hidden">Utilitários </span>CPPEM
            </Link>

            <div className="ml-auto hidden items-center gap-1.5 lg:flex xl:gap-2">

              {GROUPS.map((group) => {
                const isOpen = open === group.id;
                const isActive = active?.id === group.id;
                return (
                  <div key={group.id} className="relative">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => setOpen(isOpen ? null : group.id)}
                      className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 transition-colors xl:gap-1.5 xl:px-3 ${
                        isActive || isOpen ? current : idle
                      }`}
                    >
                      <span className="font-ui text-sm font-bold uppercase tracking-wider">{group.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                      <ul className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-line-active bg-surface shadow-[0_18px_45px_rgba(0,0,0,.55)]">
                        {group.tools.map((tool) => (
                          <li key={tool.href} className="border-t border-line first:border-t-0">
                            <Link
                              href={tool.href}
                              {...linkProps(tool)}
                              aria-current={toolActive(tool.href) ? "page" : undefined}
                              className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2 ${
                                toolActive(tool.href) ? "bg-gold/10 text-gold-pale" : "text-ink"
                              }`}
                            >
                              <span className="text-gold-light [&_svg]:h-5 [&_svg]:w-5">{tool.icon}</span>
                              <span className="font-ui text-sm font-bold uppercase tracking-wider">{tool.label}</span>
                              {tool.externo && <ArrowUpRight aria-label="abre em nova aba" className="ml-auto h-4 w-4 text-muted" />}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
            <AiLinks className="shrink-0 border-l border-line pl-1.5 lg:pl-2" />
          </div>
        </div>
      </nav>

      {/* Celular e tablet: barra fixa embaixo com os grupos. Tocar num grupo abre a lista dele acima da barra. */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" aria-hidden />}
      {open && (
        <ul className="fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-50 overflow-hidden rounded-2xl border border-line-active bg-surface shadow-[0_18px_45px_rgba(0,0,0,.6)] lg:hidden">
          {GROUPS.find((group) => group.id === open)?.tools.map((tool) => (
            <li key={tool.href} className="border-t border-line first:border-t-0">
              <Link
                href={tool.href}
                              {...linkProps(tool)}
                aria-current={toolActive(tool.href) ? "page" : undefined}
                className={`flex min-h-[52px] items-center gap-3 px-4 py-2 ${
                  toolActive(tool.href) ? "bg-gold/10 text-gold-pale" : "text-ink"
                }`}
              >
                <span className="text-gold-light [&_svg]:h-5 [&_svg]:w-5">{tool.icon}</span>
                <span className="font-ui text-base font-bold uppercase tracking-wider">{tool.label}</span>
                {tool.externo && <ArrowUpRight aria-label="abre em nova aba" className="ml-auto h-4 w-4 text-muted" />}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <nav
        aria-label="Abas"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line-active bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
      >
        <ul className="grid grid-cols-5 gap-0.5 px-1 pt-1.5 pb-1.5 min-[390px]:gap-1 min-[390px]:px-2">
          {GROUPS.map((group) => {
            const isActive = active?.id === group.id || open === group.id;
            return (
              <li key={group.id}>
                <button
                  type="button"
                  aria-expanded={open === group.id}
                  onClick={() => setOpen(open === group.id ? null : group.id)}
                  className={`flex min-h-[54px] w-full flex-col items-center justify-center gap-0.5 rounded-xl border px-0 transition-colors min-[390px]:px-1 [&_svg]:h-5 [&_svg]:w-5 ${
                    isActive ? current : "border-transparent text-gold-light"
                  }`}
                >
                  {group.icon}
                  <span className="max-w-full text-[9.5px] font-semibold leading-tight tracking-tight min-[390px]:text-[11px] min-[390px]:tracking-normal">{group.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
