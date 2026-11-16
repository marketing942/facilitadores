import "server-only";

import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSetting, query, setSetting } from "@/lib/db";

// Senhas e sessões. Duas senhas: a do PAINEL (/admin) e a da EQUIPE (libera as senhas do Wi-Fi interno).
// Guardamos só o hash scrypt das senhas e o hash SHA-256 do token de sessão. O token fica num cookie httpOnly.
export type Kind = "admin" | "equipe";

const COOKIE: Record<Kind, string> = { admin: "cppem_admin", equipe: "cppem_equipe" };
const SETTING: Record<Kind, string> = { admin: "admin_password", equipe: "equipe_password" };
const TTL_DAYS: Record<Kind, number> = { admin: 7, equipe: 30 };
const MAX_FAILS = 5;
const WINDOW_MIN = 15;

export const MIN_PASSWORD = 8;

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `scrypt:${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyHash(password: string, stored: string) {
  const [, salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const a = crypto.scryptSync(password, salt, 64);
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const sha = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim();
}

/** Confere a senha e, se certa, abre a sessão (cookie). Devolve null se deu certo, ou a mensagem de erro. */
export async function login(kind: Kind, password: string): Promise<string | null> {
  const ip = await clientIp();
  const fails = await query<{ n: string }>(
    `select count(*) n from login_attempts where kind = $1 and ip = $2 and created_at > now() - interval '${WINDOW_MIN} minutes'`,
    [kind, ip],
  );
  if (Number(fails[0].n) >= MAX_FAILS) return `Muitas tentativas. Espere ${WINDOW_MIN} minutos e tente de novo.`;

  const stored = await getSetting<{ hash: string }>(SETTING[kind]);
  if (!stored || !password || !verifyHash(password, stored.hash)) {
    await query("insert into login_attempts (kind, ip) values ($1, $2)", [kind, ip]);
    return "Senha incorreta.";
  }

  const token = crypto.randomBytes(32).toString("base64url");
  await query("delete from sessions where expires_at < now()");
  await query("delete from login_attempts where created_at < now() - interval '1 day'");
  await query("insert into sessions (token_hash, kind, expires_at) values ($1, $2, now() + ($3 || ' days')::interval)", [sha(token), kind, String(TTL_DAYS[kind])]);
  (await cookies()).set(COOKIE[kind], token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_DAYS[kind] * 86400,
  });
  return null;
}

export async function hasSession(kind: Kind): Promise<boolean> {
  const token = (await cookies()).get(COOKIE[kind])?.value;
  if (!token) return false;
  const rows = await query("select 1 from sessions where token_hash = $1 and kind = $2 and expires_at > now()", [sha(token), kind]);
  return rows.length > 0;
}

/** Barra quem não abriu a sessão do painel. Chame no começo de toda página e ação do /admin. */
export async function requireAdmin() {
  if (!(await hasSession("admin"))) redirect("/admin/login");
}

export async function logout(kind: Kind) {
  const store = await cookies();
  const token = store.get(COOKIE[kind])?.value;
  if (token) await query("delete from sessions where token_hash = $1", [sha(token)]);
  store.delete(COOKIE[kind]);
}

/** Troca a senha. Encerra todas as sessões daquele tipo (a do painel mantém quem está trocando, que entra de novo). */
export async function changePassword(kind: Kind, newPassword: string) {
  await setSetting(SETTING[kind], { hash: hashPassword(newPassword) });
  await query("delete from sessions where kind = $1", [kind]);
}

export async function checkPassword(kind: Kind, password: string) {
  const stored = await getSetting<{ hash: string }>(SETTING[kind]);
  return Boolean(stored && verifyHash(password, stored.hash));
}
