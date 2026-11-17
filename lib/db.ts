import "server-only";

import pg from "pg";

// Conexão com o Postgres do Supabase (pooler, modo transação). Só o servidor acessa o banco:
// as tabelas têm RLS ligado e nenhuma policy, então a chave pública não lê nem grava nada.
const globalForPg = globalThis as unknown as { __pool?: pg.Pool };

// Lê a DATABASE_URL de forma tolerante: a senha pode ter @ # ? / sem codificação, ou vir entre [colchetes]
// (como o Supabase mostra no modelo). Divide no ÚLTIMO "@" e usa os campos separados.
function config(): pg.PoolConfig {
  let url = (process.env.DATABASE_URL ?? "").trim();
  // tolera "DATABASE_URL=...", aspas e "psql '...'" colados por engano
  const ini = url.search(/postgres(?:ql)?:\/\//);
  if (ini > 0) url = url.slice(ini);
  url = url.replace(/["'\s]+$/, "").replace(/^["']/, "");
  const m = url.match(/^postgres(?:ql)?:\/\/([^:/@]+):([\s\S]*)@([^@/?#\s]+)(?:\/([^?\s]*))?(?:\?[\s\S]*)?$/);
  if (!m) {
    const dica = `tamanho ${url.length}, começa com "${url.slice(0, 11)}", ${(url.match(/@/g) ?? []).length} "@", termina com "${url.slice(-6).replace(/[^\/.:\w]/g, "*")}"`;
    throw new Error(`DATABASE_URL em formato inválido (${dica}).`);
  }
  const [, user, rawPass, hostPort, database] = m;
  let pass = rawPass;
  if (pass.startsWith("[") && pass.endsWith("]")) pass = pass.slice(1, -1);
  try {
    if (/%[0-9a-f]{2}/i.test(pass)) pass = decodeURIComponent(pass);
  } catch {}
  const [host, port] = hostPort.split(":");
  return { user: decodeURIComponent(user), password: pass, host, port: port ? Number(port) : 5432, database: database || "postgres" };
}

function pool() {
  if (!globalForPg.__pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurado.");
    globalForPg.__pool = new pg.Pool({
      ...config(),
      ssl: { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 20_000,
    });
  }
  return globalForPg.__pool;
}

export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const res = await pool().query(text, params);
  return res.rows as T[];
}

export async function getSetting<T>(key: string): Promise<T | null> {
  const rows = await query<{ value: T }>("select value from settings where key = $1", [key]);
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: unknown) {
  await query(
    "insert into settings (key, value) values ($1, $2) on conflict (key) do update set value = excluded.value, updated_at = now()",
    [key, JSON.stringify(value)],
  );
}
