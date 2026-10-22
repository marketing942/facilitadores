import { getCatalog } from "@/lib/catalog";

// Mesmo catálogo da página, em JSON, para outras ferramentas internas (n8n, bots, planilhas).
// force-dynamic mantém a rota fora do pré-render do build: ela lê o cache em tempo de
// execução, em vez de disparar um segundo sync da Guru em paralelo com o da página.
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  const catalog = await getCatalog();
  return Response.json(catalog, {
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
