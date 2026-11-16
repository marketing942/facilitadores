import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveSetting } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/shell";
import { Fields, ItemCard, NewCard } from "@/components/admin/forms";
import { requireAdmin } from "@/lib/auth";
import { getSetting, query } from "@/lib/db";
import { ENTITIES, SECOES, type Entity } from "@/lib/admin-schema";

export const dynamic = "force-dynamic";

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export async function generateMetadata({ params }: { params: Promise<{ secao: string }> }): Promise<Metadata> {
  const { secao: slug } = await params;
  const secao = SECOES.find((s) => s.slug === slug);
  return { title: `${secao?.titulo ?? "Painel"} | Utilitários CPPEM` };
}

async function loadRows(e: Entity): Promise<Row[]> {
  const fixed = Object.entries(e.fixed ?? {});
  const where = fixed.length ? ` where ${fixed.map(([c], i) => `${c} = $${i + 1}`).join(" and ")}` : "";
  return query(`select * from ${e.table}${where} order by position, ${e.pk}`, fixed.map(([, v]) => v));
}

/** Lista de itens de uma tabela, com o bloco "Adicionar". Se a tabela tem filhos, cada item mostra os dele. */
async function Lista({ entity, back }: { entity: Entity; back: string }) {
  const rows = await loadRows(entity);
  const child = entity.child ? ENTITIES[entity.child] : null;
  const childRows = child ? await query<Row>(`select * from ${child.table} order by position, id`) : [];

  return (
    <div className="space-y-3">
      <NewCard entity={entity} back={back} />
      {rows.length === 0 && <p className="text-sm text-muted">Nada cadastrado ainda.</p>}
      {rows.map((row) => (
        <ItemCard key={String(row[entity.pk])} entity={entity} row={row} back={back}>
          {child && (
            <div className="space-y-3 border-t border-line pt-5">
              <h3 className="eyebrow">{child.titulo} desta {entity.singular}</h3>
              {childRows
                .filter((c) => c[child.parent as string] === row.id)
                .map((c) => (
                  <ItemCard key={c.id} entity={child} row={c} parentId={row.id} back={back} />
                ))}
              <NewCard entity={child} parentId={row.id} back={back} />
            </div>
          )}
        </ItemCard>
      ))}
    </div>
  );
}

export default async function SecaoPage({
  params,
  searchParams,
}: {
  params: Promise<{ secao: string }>;
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await requireAdmin();
  const { secao: slug } = await params;
  const secao = SECOES.find((s) => s.slug === slug);
  if (!secao) notFound();
  const { ok, erro } = await searchParams;
  const back = `/admin/${secao.slug}`;
  const valor = secao.setting ? await getSetting<Row>(secao.setting.key) : null;

  return (
    <AdminShell titulo={secao.titulo} descricao={secao.descricao} ok={ok} erro={erro}>
      <div className="space-y-8">
        {secao.setting && (
          <section aria-labelledby="config">
            <h2 id="config" className="eyebrow mb-3">{secao.setting.titulo}</h2>
            <form action={saveSetting} className="space-y-4 rounded-xl border border-line bg-surface p-4 sm:p-5">
              <input type="hidden" name="__key" value={secao.setting.key} />
              <input type="hidden" name="__back" value={back} />
              <Fields fields={secao.setting.fields} row={valor ?? {}} />
              <button type="submit" className="gold-button ui-label inline-flex min-h-11 items-center rounded-md px-5">
                <span className="text-xs">Salvar alterações</span>
              </button>
            </form>
          </section>
        )}

        {secao.entity && <Lista entity={ENTITIES[secao.entity]} back={back} />}

        {secao.extra && (
          <section aria-labelledby="extra">
            <h2 id="extra" className="eyebrow mb-3">{ENTITIES[secao.extra].titulo}</h2>
            <Lista entity={ENTITIES[secao.extra]} back={back} />
          </section>
        )}
      </div>
    </AdminShell>
  );
}
