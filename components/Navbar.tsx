"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GROUPS, HOME_NAV, groupOf } from "@/config/tools";

const BRAND = "Utilitários CPPEM";

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
    <div ref={root}>
      {/* Topo: marca + Início + um botão por grupo, que abre a lista das páginas dele. */}
      <nav className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-lg" aria-label="Principal">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-12 items-center justify-between gap-4 sm:h-16">
            <Link
              href="/"
              className="shrink-0 py-3 font-ui text-sm font-bold uppercase tracking-[0.14em] text-gold-light"
            >
              {BRAND}
            </Link>

            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/"
                aria-current={onHome ? "page" : undefined}
                className={`rounded-md border px-3 py-1.5 font-ui text-sm font-bold uppercase tracking-wider transition-colors ${
                  onHome ? current : idle
                }`}
              >
                {HOME_NAV.label}
              </Link>

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
                      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 transition-colors ${
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
                              aria-current={toolActive(tool.href) ? "page" : undefined}
                              className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2 ${
                                toolActive(tool.href) ? "bg-gold/10 text-gold-pale" : "text-ink"
                              }`}
                            >
                              <span className="text-gold-light [&_svg]:h-5 [&_svg]:w-5">{tool.icon}</span>
                              <span className="font-ui text-sm font-bold uppercase tracking-wider">{tool.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Celular: barra fixa embaixo (Início + grupos). Tocar num grupo abre a lista dele acima da barra. */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" aria-hidden />}
      {open && (
        <ul className="fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-50 overflow-hidden rounded-2xl border border-line-active bg-surface shadow-[0_18px_45px_rgba(0,0,0,.6)] sm:hidden">
          {GROUPS.find((group) => group.id === open)?.tools.map((tool) => (
            <li key={tool.href} className="border-t border-line first:border-t-0">
              <Link
                href={tool.href}
                aria-current={toolActive(tool.href) ? "page" : undefined}
                className={`flex min-h-[52px] items-center gap-3 px-4 py-2 ${
                  toolActive(tool.href) ? "bg-gold/10 text-gold-pale" : "text-ink"
                }`}
              >
                <span className="text-gold-light [&_svg]:h-5 [&_svg]:w-5">{tool.icon}</span>
                <span className="font-ui text-base font-bold uppercase tracking-wider">{tool.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <nav
        aria-label="Abas"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line-active bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg sm:hidden"
      >
        <ul className="grid grid-cols-4 gap-1 px-2 pt-1.5 pb-1.5">
          <li>
            <Link
              href="/"
              aria-current={onHome ? "page" : undefined}
              className={`flex min-h-[54px] flex-col items-center justify-center gap-0.5 rounded-xl border px-1 text-[11px] font-semibold leading-tight transition-colors [&_svg]:h-5 [&_svg]:w-5 ${
                onHome ? current : "border-transparent text-gold-light"
              }`}
            >
              {HOME_NAV.icon}
              {HOME_NAV.label}
            </Link>
          </li>
          {GROUPS.map((group) => {
            const isActive = active?.id === group.id || open === group.id;
            return (
              <li key={group.id}>
                <button
                  type="button"
                  aria-expanded={open === group.id}
                  onClick={() => setOpen(open === group.id ? null : group.id)}
                  className={`flex min-h-[54px] w-full flex-col items-center justify-center gap-0.5 rounded-xl border px-1 transition-colors [&_svg]:h-5 [&_svg]:w-5 ${
                    isActive ? current : "border-transparent text-gold-light"
                  }`}
                >
                  {group.icon}
                  <span className="text-[11px] font-semibold leading-tight">{group.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
