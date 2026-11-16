"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { changePassword, checkPassword, login, logout, MIN_PASSWORD, requireAdmin } from "@/lib/auth";
import { query, setSetting } from "@/lib/db";
import { ENTITIES, SECOES, type Entity, type Field } from "@/lib/admin-schema";
import { TAGS } from "@/lib/tags";

// Ações do painel /admin. Todas conferem a sessão do painel; colunas e tabelas vêm só de lib/admin-schema.ts.
const NULLABLE = new Set(["whatsapp", "capa", "site_label", "site_url", "emoji", "descricao@trilha_cursos"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function voltar(back: FormDataEntryValue | null, tipo: "ok" | "erro", msg: string): never {
  const base = typeof back === "string" ? back.split("?")[0] : "";
  const path = /^\/admin(\/[a-z0-9-]*)?$/.test(base) ? base : "/admin";
  redirect(`${path}?${tipo}=${encodeURIComponent(msg)}`);
}

type Parsed = { values: Record<string, unknown> } | { erro: string };

function parseFields(fields: Field[], fd: FormData, table: string): Parsed {
  const values: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = fd.get(f.name);
    const text = typeof raw === "string" ? raw.trim() : "";
    switch (f.type) {
      case "bool":
        values[f.name] = fd.has(f.name);
        break;
      case "number":
        values[f.name] = text === "" || !Number.isFinite(Number(text)) ? null : Math.trunc(Number(text));
        break;
      case "tags":
        values[f.name] = text.split(",").map((t) => t.trim()).filter(Boolean);
        break;
      case "lines":
        values[f.name] = (typeof raw === "string" ? raw : "").split("\n").map((t) => t.trim()).filter(Boolean);
        break;
      case "checks":
        values[f.name] = fd.getAll(f.name).filter((v): v is string => typeof v === "string" && (f.options ?? []).includes(v));
        break;
      default: {
        if (f.required && !text) return { erro: `Preencha o campo "${f.label}".` };
        if (f.type === "select" && !(f.options ?? []).includes(text)) return { erro: `Escolha uma opção em "${f.label}".` };
        if (f.type === "url" && text && !/^https?:\/\/\S+$/i.test(text)) return { erro: `"${f.label}" precisa começar com http:// ou https://.` };
        if (f.name === "photo" && text && !/^(\/|https?:\/\/)\S+$/i.test(text)) {
          return { erro: `"${f.label}" precisa ser um caminho (/contatos/foto.jpg) ou um endereço http(s).` };
        }
        const vazioVaiNulo = NULLABLE.has(f.name) || NULLABLE.has(`${f.name}@${table}`);
        values[f.name] = !text && vazioVaiNulo ? null : text;
      }
    }
  }
  return { values };
}

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "item";

async function uniqueSlug(e: Entity, base: string): Promise<string> {
  const fixed = Object.entries(e.fixed ?? {});
  const where = fixed.map(([c], i) => ` and ${c} = $${i + 2}`).join("");
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const rows = await query(`select 1 from ${e.table} where slug = $1${where}`, [slug, ...fixed.map(([, v]) => v)]);
    if (rows.length === 0) return slug;
  }
}

function refresh(tag: string) {
  revalidateTag(tag, { expire: 0 });
}

export async function saveRow(fd: FormData) {
  await requireAdmin();
  const back = fd.get("__back");
  const e = ENTITIES[String(fd.get("__entity"))];
  if (!e) voltar(back, "erro", "Tabela desconhecida.");
  const id = String(fd.get("__id") ?? "");
  const parent = String(fd.get("__parent") ?? "");

  const parsed = parseFields(e.fields, fd, e.table);
  if ("erro" in parsed) voltar(back, "erro", parsed.erro);
  const values = parsed.values;
  const fixed = Object.entries(e.fixed ?? {});

  try {
    if (id) {
      if (e.pk === "id" && !UUID.test(id)) voltar(back, "erro", "Registro inválido.");
      // ordem em branco não mexe na posição atual
      const cols = Object.keys(values).filter((c) => !(c === "position" && values[c] === null));
      const where = [`${e.pk} = $${cols.length + 1}`, ...fixed.map(([c], i) => `${c} = $${cols.length + 2 + i}`)].join(" and ");
      await query(
        `update ${e.table} set ${cols.map((c, i) => `${c} = $${i + 1}`).join(", ")} where ${where}`,
        [...cols.map((c) => values[c]), id, ...fixed.map(([, v]) => v)],
      );
    } else {
      const all: Record<string, unknown> = { ...values, ...(e.fixed ?? {}) };
      if (e.parent) {
        if (!UUID.test(parent)) voltar(back, "erro", "Registro pai inválido.");
        all[e.parent] = parent;
      }
      if (e.slugFrom) all.slug = await uniqueSlug(e, slugify(String(values[e.slugFrom] ?? "")));
      if (all.position === null || all.position === undefined) {
        const scopeCol = e.parent ?? fixed[0]?.[0];
        const scopeVal = e.parent ? parent : fixed[0]?.[1];
        const max = await query<{ n: number }>(
          `select coalesce(max(position), -1) + 1 as n from ${e.table}${scopeCol ? ` where ${scopeCol} = $1` : ""}`,
          scopeCol ? [scopeVal] : [],
        );
        all.position = max[0].n;
      }
      const names = Object.keys(all);
      await query(
        `insert into ${e.table} (${names.join(", ")}) values (${names.map((_, i) => `$${i + 1}`).join(", ")})`,
        names.map((n) => all[n]),
      );
    }
  } catch (err) {
    console.error(err);
    voltar(back, "erro", "Não consegui salvar. Confira os campos e tente de novo.");
  }
  refresh(e.tag);
  voltar(back, "ok", id ? "Alterações salvas." : "Item criado.");
}

export async function deleteRow(fd: FormData) {
  await requireAdmin();
  const back = fd.get("__back");
  const e = ENTITIES[String(fd.get("__entity"))];
  const id = String(fd.get("__id") ?? "");
  if (!e || !id || (e.pk === "id" && !UUID.test(id))) voltar(back, "erro", "Registro inválido.");
  const fixed = Object.entries(e.fixed ?? {});
  const where = [`${e.pk} = $1`, ...fixed.map(([c], i) => `${c} = $${i + 2}`)].join(" and ");
  await query(`delete from ${e.table} where ${where}`, [id, ...fixed.map(([, v]) => v)]);
  refresh(e.tag);
  voltar(back, "ok", "Item excluído.");
}

export async function saveSetting(fd: FormData) {
  await requireAdmin();
  const back = fd.get("__back");
  const secao = SECOES.find((s) => s.setting?.key === fd.get("__key"));
  if (!secao?.setting) voltar(back, "erro", "Configuração desconhecida.");
  const parsed = parseFields(secao.setting.fields, fd, "settings");
  if ("erro" in parsed) voltar(back, "erro", parsed.erro);
  await setSetting(secao.setting.key, parsed.values);
  const wifi = secao.slug === "wifi";
  refresh(wifi ? TAGS.wifi : TAGS.empresa);
  revalidatePath(wifi ? "/wifi" : "/empresa");
  voltar(back, "ok", "Alterações salvas.");
}

export async function entrar(_: string | null, fd: FormData): Promise<string | null> {
  const erro = await login("admin", String(fd.get("senha") ?? ""));
  if (erro) return erro;
  redirect("/admin");
}

export async function sair() {
  await logout("admin");
  redirect("/admin/login");
}

export async function trocarSenha(fd: FormData) {
  await requireAdmin();
  const back = fd.get("__back");
  const qual = fd.get("__qual") === "equipe" ? "equipe" : "admin";
  const nova = String(fd.get("nova") ?? "");
  const confirma = String(fd.get("confirma") ?? "");
  if (nova.length < MIN_PASSWORD) voltar(back, "erro", `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`);
  if (nova !== confirma) voltar(back, "erro", "A confirmação não é igual à nova senha.");
  if (qual === "admin") {
    if (!(await checkPassword("admin", String(fd.get("atual") ?? "")))) voltar(back, "erro", "A senha atual do painel está incorreta.");
    await changePassword("admin", nova);
    redirect("/admin/login");
  }
  await changePassword("equipe", nova);
  voltar(back, "ok", "Senha da equipe trocada. Quem já tinha liberado o Wi-Fi interno precisará digitar a nova.");
}
