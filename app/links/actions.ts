"use server";

import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/catalog";

// Ação do botão "Atualizar agora" dos Links Guru: limpa o cache do catálogo (lib/catalog.ts) para buscar a Guru de novo.
/** "Atualizar agora": expira o catálogo para que esta requisição já traga dados novos da Guru. */
export async function refreshCatalog() {
  revalidateTag(CATALOG_TAG, { expire: 0 });
}
