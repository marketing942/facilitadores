"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOME_NAV, TOOLS } from "@/config/tools";

const items = [HOME_NAV, ...TOOLS];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Topo: no computador traz os botões das abas; no celular só a marca (as abas ficam embaixo). */}
      <nav className="sticky top-0 z-50 border-b border-line bg-base/90 backdrop-blur-lg" aria-label="Principal">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-12 items-center justify-between gap-4 sm:h-16">
            <Link
              href="/"
              className="shrink-0 py-3 font-ui text-sm font-bold uppercase tracking-[0.14em] text-gold-light"
            >
              Time Comercial
            </Link>

            <div className="hidden min-w-0 items-center gap-2 overflow-x-auto py-1 sm:flex">
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`whitespace-nowrap rounded-md border px-3 py-1.5 font-ui text-sm font-bold uppercase tracking-wider transition-colors ${
                      active ? item.navActive : item.nav
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Celular: barra de abas fixa embaixo, ao alcance do polegar. */}
      <nav
        aria-label="Abas"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line-active bg-base/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg sm:hidden"
      >
        <ul className="grid grid-cols-5 gap-1 px-2 pt-1.5 pb-1.5">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[54px] flex-col items-center [&_svg]:h-5 [&_svg]:w-5 justify-center gap-0.5 rounded-xl border px-1 text-[11px] font-semibold leading-tight transition-colors ${
                    active ? item.navActive : `${item.nav} border-transparent bg-transparent`
                  }`}
                >
                  {item.icon}
                  <span className="max-w-full truncate">{item.shortLabel}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
