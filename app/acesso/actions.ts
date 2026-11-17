"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/auth";

// Senha comum do site: abre a sessão de 8 horas e volta para a página que a pessoa queria.
export async function entrarNoSite(_: string | null, fd: FormData): Promise<string | null> {
  const erro = await login("site", String(fd.get("senha") ?? ""));
  if (erro) return erro;
  const de = String(fd.get("de") ?? "");
  redirect(de.startsWith("/") && !de.startsWith("//") && !de.startsWith("/\\") ? de : "/");
}
