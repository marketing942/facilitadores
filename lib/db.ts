import "server-only";

import pg from "pg";

// Conexão com o Postgres do Supabase (pooler, modo transação). Só o servidor acessa o banco:
// as tabelas têm RLS ligado e nenhuma policy, então a chave pública não lê nem grava nada.
const globalForPg = globalThis as unknown as { __pool?: pg.Pool };

function pool() {
  if (!globalForPg.__pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurado.");
    globalForPg.__pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
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
