"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Links", href: "/links" },
  { label: "Guru + Stone", href: "/calculadora" },
  { label: "TON", href: "/calculadora-ton" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-base/90 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="hidden shrink-0 font-ui text-sm font-bold uppercase tracking-[0.14em] text-gold-light sm:block">
            Time Comercial
          </Link>

          <div className="flex min-w-0 items-center gap-1 overflow-x-auto sm:ml-auto">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 font-ui text-sm font-bold uppercase tracking-wider transition-colors ${
                    active ? "bg-gold/10 text-gold-pale" : "text-ink-soft hover:bg-surface-3 hover:text-ink"
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
