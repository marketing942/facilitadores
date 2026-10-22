"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOME_NAV, TOOLS } from "@/config/tools";

const items = [HOME_NAV, ...TOOLS];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-base/90 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="hidden shrink-0 font-ui text-sm font-bold uppercase tracking-[0.14em] text-gold-light lg:block"
          >
            Time Comercial
          </Link>

          <div className="flex min-w-0 items-center gap-2 overflow-x-auto py-1 lg:ml-auto">
            {items.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
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
  );
}
