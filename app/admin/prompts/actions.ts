"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { TAGS } from "@/lib/tags";

// Ações do painel da Galeria de Prompts (/admin/prompts). Todas conferem a sessão do painel.
const BACK = "/admin/prompts";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_ARQUIVO = 300 * 1024;

function voltar(tipo: "ok" | "erro", msg: string): never {
  redirect(`${BACK}?${tipo}=${encodeURIComponent(msg)}`);
}

const texto = (fd: FormData, nome: string) => String(fd.get(nome) ?? "").trim();
const ids = (fd: FormData, nome: string) => fd.getAll(nome).filter((v): v is string => typeof v === "string" && UUID.test(v));
const atualizar = () => revalidateTag(TAGS.prompts, { expire: 0 });

async function proximaPosicao(tabela: "etiquetas" | "prompts") {
  const r = await query<{ n: number }>(`select coalesce(max(position), 0) + 1 as n from ${tabela}`);
  return r[0].n;
}

async function ligarEtiquetas(promptId: string, etiquetas: string[]) {
  await query("delete from prompt_etiquetas where prompt_id = $1", [promptId]);
  if (etiquetas.length) {
    await query(
      "insert into prompt_etiquetas (prompt_id, etiqueta_id) select $1, e.id from etiquetas e where e.id = any($2::uuid[]) on conflict do nothing",
      [promptId, etiquetas],
    );
  }
}

/** Lê um arquivo .md enviado: devolve título (1º "# Título" ou o nome do arquivo) e o conteúdo inteiro. */
async function lerMarkdown(file: File): Promise<{ titulo: string; conteudo: string } | string> {
  if (!/\.(md|markdown)$/i.test(file.name)) return `"${file.name}" não é um arquivo Markdown (.md).`;
  if (file.size > MAX_ARQUIVO) return `"${file.name}" é grande demais (máximo de 300 KB por arquivo).`;
  const conteudo = (await file.text()).replace(/^﻿/, "").replace(/\r\n/g, "\n").trim();
  if (!conteudo || conteudo.includes("\u0000")) return `"${file.name}" está vazio ou não é texto.`;
  const h1 = conteudo.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const doNome = file.name.replace(/\.(md|markdown)$/i, "").replace(/[-_]+/g, " ").trim();
  return { titulo: (h1 || doNome || "Prompt").slice(0, 120), conteudo };
}

const arquivosEnviados = (fd: FormData) => fd.getAll("arquivos").filter((v): v is File => v instanceof File && v.size > 0);

// ── Etiquetas ───────────────────────────────────────────────────────────────

export async function criarEtiqueta(fd: FormData) {
  await requireAdmin();
  const nome = texto(fd, "nome");
  if (!nome || nome.length > 40) voltar("erro", "Escreva o nome da etiqueta (até 40 caracteres).");
  const existe = await query("select 1 from etiquetas where lower(nome) = lower($1)", [nome]);
  if (existe.length) voltar("erro", `A etiqueta "${nome}" já existe.`);
  await query("insert into etiquetas (nome, position) values ($1, $2)", [nome, await proximaPosicao("etiquetas")]);
  atualizar();
  voltar("ok", `Etiqueta "${nome}" criada.`);
}

export async function salvarEtiqueta(fd: FormData) {
  await requireAdmin();
  const id = texto(fd, "id");
  const nome = texto(fd, "nome");
  if (!UUID.test(id)) voltar("erro", "Etiqueta inválida.");
  if (!nome || nome.length > 40) voltar("erro", "Escreva o nome da etiqueta (até 40 caracteres).");
  const outra = await query("select 1 from etiquetas where lower(nome) = lower($1) and id <> $2", [nome, id]);
  if (outra.length) voltar("erro", `Já existe outra etiqueta chamada "${nome}".`);
  await query("update etiquetas set nome = $1 where id = $2", [nome, id]);
  atualizar();
  voltar("ok", "Etiqueta renomeada.");
}

export async function excluirEtiqueta(fd: FormData) {
  await requireAdmin();
  const id = texto(fd, "id");
  if (!UUID.test(id)) voltar("erro", "Etiqueta inválida.");
  await query("delete from etiquetas where id = $1", [id]);
  atualizar();
  voltar("ok", "Etiqueta excluída. Os prompts continuam, só sem ela.");
}

// ── Prompts ─────────────────────────────────────────────────────────────────

export async function enviarPrompts(fd: FormData) {
  await requireAdmin();
  const arquivos = arquivosEnviados(fd);
  if (!arquivos.length) voltar("erro", "Escolha pelo menos um arquivo .md.");
  const etiquetas = ids(fd, "etiquetas");

  const lidos: { titulo: string; conteudo: string }[] = [];
  for (const f of arquivos) {
    const r = await lerMarkdown(f);
    if (typeof r === "string") voltar("erro", r);
    lidos.push(r);
  }

  let pos = await proximaPosicao("prompts");
  for (const l of lidos) {
    const [novo] = await query<{ id: string }>("insert into prompts (titulo, conteudo, position) values ($1, $2, $3) returning id", [l.titulo, l.conteudo, pos++]);
    await ligarEtiquetas(novo.id, etiquetas);
  }
  atualizar();
  voltar("ok", lidos.length === 1 ? `Prompt "${lidos[0].titulo}" adicionado.` : `${lidos.length} prompts adicionados.`);
}

export async function salvarPrompt(fd: FormData) {
  await requireAdmin();
  const id = texto(fd, "id");
  if (!UUID.test(id)) voltar("erro", "Prompt inválido.");
  let titulo = texto(fd, "titulo");
  let conteudo = String(fd.get("conteudo") ?? "").replace(/\r\n/g, "\n").trim();

  const [novoArquivo] = arquivosEnviados(fd);
  if (novoArquivo) {
    const r = await lerMarkdown(novoArquivo);
    if (typeof r === "string") voltar("erro", r);
    conteudo = r.conteudo;
    if (!titulo) titulo = r.titulo;
  }
  if (!titulo) voltar("erro", "Preencha o título do prompt.");
  if (!conteudo) voltar("erro", "O prompt não pode ficar vazio.");

  const posicao = texto(fd, "position");
  const pos = posicao !== "" && Number.isFinite(Number(posicao)) ? Math.trunc(Number(posicao)) : await proximaPosicao("prompts");
  await query("update prompts set titulo = $1, conteudo = $2, ativo = $3, position = $4, updated_at = now() where id = $5", [
    titulo.slice(0, 120),
    conteudo,
    fd.has("ativo"),
    pos,
    id,
  ]);
  await ligarEtiquetas(id, ids(fd, "etiquetas"));
  atualizar();
  voltar("ok", `Prompt "${titulo}" salvo.`);
}

export async function excluirPrompt(fd: FormData) {
  await requireAdmin();
  const id = texto(fd, "id");
  if (!UUID.test(id)) voltar("erro", "Prompt inválido.");
  await query("delete from prompts where id = $1", [id]);
  atualizar();
  voltar("ok", "Prompt excluído.");
}
