"use server";

import { revalidatePath } from "next/cache";
import { login } from "@/lib/auth";

// Senha da equipe: libera as senhas do Wi-Fi interno neste navegador (cookie httpOnly, 30 dias).
export async function liberarEquipe(_: string | null, formData: FormData): Promise<string | null> {
  const erro = await login("equipe", String(formData.get("senha") ?? ""));
  if (!erro) revalidatePath("/wifi");
  return erro;
}
