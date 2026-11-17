import { NextResponse, type NextRequest } from "next/server";
import { query } from "@/lib/db";
import { SITE_COOKIE, sha } from "@/lib/auth";

// Porta do site: sem a senha comum (cookie de sessão válido por 8 horas), tudo vai para /acesso.
// Ficam de fora: /acesso (o próprio login), /admin (tem login próprio), /api (usada por n8n, bots e planilhas),
// arquivos do Next e imagens/ícones públicos.
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SITE_COOKIE)?.value;
  if (token) {
    try {
      const rows = await query("select 1 from sessions where token_hash = $1 and kind = 'site' and expires_at > now()", [sha(token)]);
      if (rows.length > 0) return NextResponse.next();
    } catch {
      // banco fora do ar: trata como sem sessão
    }
  }
  const url = request.nextUrl.clone();
  const volta = request.nextUrl.pathname + request.nextUrl.search;
  url.pathname = "/acesso";
  url.search = volta !== "/" ? `?de=${encodeURIComponent(volta)}` : "";
  const res = NextResponse.redirect(url);
  if (token) res.cookies.delete(SITE_COOKIE);
  return res;
}

export const config = {
  matcher: ["/((?!acesso|admin|api|_next/|favicon\\.ico|icon\\.png|apple-icon\\.png|.*\\.(?:png|jpg|jpeg|webp|svg|gif|ico|pdf|txt|xml|webmanifest)$).*)"],
};
