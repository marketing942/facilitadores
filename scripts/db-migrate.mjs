// Aplica supabase/migrations/*.sql no banco, na ordem, uma vez cada. Uso: npm run db:migrate
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { loadEnv } from "./env.mjs";

loadEnv();
const dir = path.resolve("supabase/migrations");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
await client.query("create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())");
const done = new Set((await client.query("select name from schema_migrations")).rows.map((r) => r.name));
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (done.has(file)) continue;
  console.log("aplicando", file);
  await client.query("begin");
  try {
    await client.query(fs.readFileSync(path.join(dir, file), "utf8"));
    await client.query("insert into schema_migrations (name) values ($1)", [file]);
    await client.query("commit");
  } catch (e) {
    await client.query("rollback");
    throw e;
  }
}
await client.query("alter table schema_migrations enable row level security");
console.log("ok");
await client.end();
