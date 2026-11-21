import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/shell";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { inputClass } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { criarEtiqueta, enviarPrompts, excluirEtiqueta, excluirPrompt, salvarEtiqueta, salvarPrompt } from "./actions";

export const metadata: Metadata = { title: "Galeria de Prompts | Utilitários CPPEM" };
export const dynamic = "force-dynamic";

type Etiqueta = { id: string; nome: string };
type Prompt = { id: string; titulo: string; conteudo: string; ativo: boolean; position: number; etiquetas: string[] };

const botao = "gold-button ui-label inline-flex min-h-11 items-center rounded-md px-5";
const botaoFantasma = "ghost-button ui-label inline-flex min-h-11 items-center rounded-md px-4";

/** Marcas de etiqueta (várias por prompt). */
function Marcas({ etiquetas, marcadas }: { etiquetas: Etiqueta[]; marcadas: string[] }) {
  if (etiquetas.length === 0) return <p className="text-xs text-muted">Crie etiquetas acima para poder marcar.</p>;
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold text-ink">Etiquetas</legend>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {etiquetas.map((e) => (
          <label key={e.id} className="flex min-h-10 items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="etiquetas" value={e.id} defaultChecked={marcadas.includes(e.id)} className="h-5 w-5 accent-[var(--gold)]" />
            {e.nome}
          </label>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">Pode marcar quantas quiser: um prompt aparece em todos os filtros das etiquetas marcadas.</p>
    </fieldset>
  );
}

// Painel da Galeria de Prompts: etiquetas, envio de arquivos .md e edição dos prompts.
export default async function PromptsAdminPage({ searchParams }: { searchParams: Promise<{ ok?: string; erro?: string }> }) {
  await requireAdmin();
  const { ok, erro } = await searchParams;

  const etiquetas = await query<Etiqueta>("select id, nome from etiquetas order by position, nome");
  const prompts = await query<Prompt & { etiqueta_ids: string[] }>(
    `select p.id, p.titulo, p.conteudo, p.ativo, p.position,
            coalesce(array_agg(pe.etiqueta_id::text) filter (where pe.etiqueta_id is not null), '{}') as etiquetas
       from prompts p left join prompt_etiquetas pe on pe.prompt_id = p.id
      group by p.id order by p.position, p.created_at desc`,
  );
  const nomeDe = new Map(etiquetas.map((e) => [e.id, e.nome]));

  return (
    <AdminShell titulo="Galeria de Prompts" descricao="Envie arquivos Markdown (.md) e organize os prompts por etiqueta. Aparece em Comercial › Prompts." ok={ok} erro={erro}>
      <div className="space-y-8">
        <section aria-labelledby="enviar">
          <h2 id="enviar" className="eyebrow mb-3">Enviar prompts</h2>
          <form action={enviarPrompts} encType="multipart/form-data" className="space-y-4 rounded-xl border border-line-active bg-gold/5 p-4 sm:p-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">Arquivos Markdown (.md)</span>
              <input type="file" name="arquivos" accept=".md,.markdown,text/markdown" multiple required className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-gold/20 file:px-3 file:py-1.5 file:text-sm file:text-gold-pale`} />
              <span className="mt-1 block text-xs text-muted">Cada arquivo vira um prompt. Sem nome digitado abaixo, o nome é a primeira linha começada por # (ou o nome do arquivo). Até 300 KB por arquivo.</span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink">Nome do prompt</span>
              <input name="nome" maxLength={120} placeholder="Ex.: Follow-up pós-reunião" className={inputClass} />
              <span className="mt-1 block text-xs text-muted">É o nome que a equipe vê. Vazio: usa o título do arquivo. Com vários arquivos de uma vez, deixe vazio e renomeie depois.</span>
            </label>
            <Marcas etiquetas={etiquetas} marcadas={[]} />
            <button type="submit" className={botao}><span className="text-xs">Enviar para a galeria</span></button>
          </form>
        </section>

        <section aria-labelledby="etiquetas">
          <h2 id="etiquetas" className="eyebrow mb-3">Etiquetas</h2>
          <div className="space-y-2.5">
            {etiquetas.map((e) => (
              <form key={e.id} action={salvarEtiqueta} className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface p-3">
                <input type="hidden" name="id" value={e.id} />
                <input name="nome" defaultValue={e.nome} required maxLength={40} aria-label={`Nome da etiqueta ${e.nome}`} className={`${inputClass} min-w-0 flex-1 basis-40`} />
                <button type="submit" className={botaoFantasma}><span className="text-xs">Renomear</span></button>
                <ConfirmButton formAction={excluirEtiqueta} message={`Excluir a etiqueta "${e.nome}"? Os prompts continuam, só sem ela.`} className={`${botaoFantasma} text-danger`}>
                  <span className="text-xs">Excluir</span>
                </ConfirmButton>
              </form>
            ))}
            <form action={criarEtiqueta} className="flex flex-wrap items-center gap-2 rounded-xl border border-line-active bg-gold/5 p-3">
              <input name="nome" required maxLength={40} placeholder="Nova etiqueta" aria-label="Nome da nova etiqueta" className={`${inputClass} min-w-0 flex-1 basis-40`} />
              <button type="submit" className={botao}><span className="text-xs">Criar etiqueta</span></button>
            </form>
          </div>
        </section>

        <section aria-labelledby="lista">
          <h2 id="lista" className="eyebrow mb-3">Prompts ({prompts.length})</h2>
          <div className="space-y-3">
            {prompts.length === 0 && <p className="text-sm text-muted">Nenhum prompt ainda. Envie um arquivo .md acima.</p>}
            {prompts.map((p) => (
              <details key={p.id} className="group rounded-xl border border-line bg-surface">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-5 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">
                    <span className="block truncate font-display text-base font-bold uppercase tracking-tight text-ink">{p.titulo}</span>
                    <span className="block truncate text-xs text-soft">
                      {p.etiquetas.map((id) => nomeDe.get(id)).filter(Boolean).join(", ") || "Sem etiqueta"}
                      {p.ativo ? "" : " · oculto"}
                    </span>
                  </span>
                  <span className="ui-label flex-none text-xs text-gold-light group-open:hidden">Editar</span>
                  <span className="ui-label hidden flex-none text-xs text-gold-light group-open:inline">Fechar</span>
                </summary>
                <form action={salvarPrompt} encType="multipart/form-data" className="space-y-4 border-t border-line p-4 sm:p-5">
                  <input type="hidden" name="id" value={p.id} />
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-ink">Nome do prompt <span className="text-gold-light">*</span></span>
                    <input name="titulo" defaultValue={p.titulo} required maxLength={120} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-ink">Prompt (Markdown) <span className="text-gold-light">*</span></span>
                    <textarea name="conteudo" defaultValue={p.conteudo} required rows={12} className={`${inputClass} font-mono`} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-ink">Trocar pelo conteúdo de um arquivo .md</span>
                    <input type="file" name="arquivos" accept=".md,.markdown,text/markdown" className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-gold/20 file:px-3 file:py-1.5 file:text-sm file:text-gold-pale`} />
                    <span className="mt-1 block text-xs text-muted">Opcional. Se escolher um arquivo, ele substitui o texto acima ao salvar.</span>
                  </label>
                  <Marcas etiquetas={etiquetas} marcadas={p.etiquetas} />
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <label className="flex min-h-10 items-center gap-2.5 text-sm font-semibold text-ink">
                      <input type="checkbox" name="ativo" defaultChecked={p.ativo} className="h-5 w-5 accent-[var(--gold)]" />
                      Aparece no site
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-ink">Ordem</span>
                      <input type="number" name="position" inputMode="numeric" step={1} defaultValue={p.position} className={inputClass} />
                      <span className="mt-1 block text-xs text-muted">Número menor aparece primeiro.</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="submit" className={botao}><span className="text-xs">Salvar alterações</span></button>
                    <ConfirmButton formAction={excluirPrompt} message={`Excluir o prompt "${p.titulo}"? Isso não pode ser desfeito.`} className={`${botaoFantasma} text-danger`}>
                      <span className="text-xs">Excluir</span>
                    </ConfirmButton>
                  </div>
                </form>
              </details>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
