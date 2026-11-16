import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Painel | Utilitários CPPEM" };
export const dynamic = "force-dynamic";

// Entrada do painel administrativo (/admin): senha única, trocada em /admin/seguranca.
export default async function LoginPage() {
  if (await hasSession("admin")) redirect("/admin");
  return (
    <main className="mx-auto w-full max-w-sm px-4 pb-4 pt-12 sm:pt-20">
      <p className="eyebrow">Painel · Grupo CPPEM</p>
      <h1 className="display-title mt-2 mb-6">
        Área <span className="text-gold-light">administrativa</span>
      </h1>
      <div className="rounded-2xl border border-line bg-surface p-5">
        <LoginForm />
      </div>
    </main>
  );
}
