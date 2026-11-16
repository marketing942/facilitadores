import type { Entity, Field } from "@/lib/admin-schema";
import { deleteRow, saveRow } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";

// Peças dos formulários do painel /admin (componentes de servidor: sem JavaScript no navegador).
export const inputClass =
  "w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-base font-medium text-ink placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold-light sm:text-sm";

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export function FieldInput({ field, value }: { field: Field; value?: unknown }) {
  const common = { name: field.name, id: undefined, placeholder: field.placeholder, className: inputClass };
  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = <textarea {...common} rows={3} defaultValue={(value as string) ?? ""} />;
      break;
    case "lines":
      control = <textarea {...common} rows={4} defaultValue={((value as string[]) ?? []).join("\n")} />;
      break;
    case "tags":
      control = <input {...common} type="text" defaultValue={((value as string[]) ?? []).join(", ")} />;
      break;
    case "number":
      control = <input {...common} type="number" inputMode="numeric" step={1} defaultValue={(value as number | null) ?? ""} />;
      break;
    case "select":
      control = (
        <select {...common} defaultValue={(value as string) ?? field.options?.[0]}>
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
      break;
    case "bool":
      return (
        <label className="flex min-h-10 items-center gap-2.5 text-sm font-semibold text-ink">
          <input type="checkbox" name={field.name} defaultChecked={value === undefined ? true : Boolean(value)} className="h-5 w-5 accent-[var(--gold)]" />
          {field.label}
        </label>
      );
    case "checks":
      return (
        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 text-sm font-semibold text-ink">{field.label}</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {field.options?.map((o) => (
              <label key={o} className="flex min-h-10 items-center gap-2 text-sm text-ink">
                <input type="checkbox" name={field.name} value={o} defaultChecked={((value as string[]) ?? []).includes(o)} className="h-5 w-5 accent-[var(--gold)]" />
                {o}
              </label>
            ))}
          </div>
          {field.hint && <p className="mt-1 text-xs text-muted">{field.hint}</p>}
        </fieldset>
      );
    default:
      control = <input {...common} type={field.type === "url" ? "url" : "text"} defaultValue={(value as string) ?? ""} />;
  }
  const wide = field.type === "textarea" || field.type === "lines" || field.type === "url";
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {field.label}
        {field.required && <span className="text-gold-light"> *</span>}
      </span>
      {control}
      {field.hint && <span className="mt-1 block text-xs text-muted">{field.hint}</span>}
    </label>
  );
}

export function Fields({ fields, row }: { fields: Field[]; row?: Row }) {
  return (
    <div className="grid gap-3.5 sm:grid-cols-2">
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} value={row?.[f.name]} />
      ))}
    </div>
  );
}

/** Formulário de um item: criar (sem row) ou editar/excluir (com row). */
export function RowForm({ entity, row, parentId, back }: { entity: Entity; row?: Row; parentId?: string; back: string }) {
  const id = row ? String(row[entity.pk]) : "";
  return (
    <form action={saveRow} className="space-y-4">
      <input type="hidden" name="__entity" value={entity.key} />
      <input type="hidden" name="__id" value={id} />
      <input type="hidden" name="__parent" value={parentId ?? ""} />
      <input type="hidden" name="__back" value={back} />
      <Fields fields={entity.fields} row={row} />
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className="gold-button ui-label inline-flex min-h-11 items-center rounded-md px-5">
          <span className="text-xs">{row ? "Salvar alterações" : `Adicionar ${entity.singular}`}</span>
        </button>
        {row && (
          <ConfirmButton
            formAction={deleteRow}
            message={`Excluir "${entity.summary(row)}"? Isso não pode ser desfeito.`}
            className="ghost-button ui-label inline-flex min-h-11 items-center rounded-md px-4 text-danger"
          >
            <span className="text-xs">Excluir</span>
          </ConfirmButton>
        )}
      </div>
    </form>
  );
}

/** Cartão recolhível de um item existente. */
export function ItemCard({ entity, row, parentId, back, children }: { entity: Entity; row: Row; parentId?: string; back: string; children?: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-line bg-surface">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block truncate font-display text-base font-bold uppercase tracking-tight text-ink">{entity.summary(row)}</span>
          {entity.sub && <span className="block truncate text-xs text-soft">{entity.sub(row)}</span>}
        </span>
        <span className="ui-label flex-none text-xs text-gold-light group-open:hidden">Editar</span>
        <span className="ui-label hidden flex-none text-xs text-gold-light group-open:inline">Fechar</span>
      </summary>
      <div className="space-y-6 border-t border-line p-4 sm:p-5">
        <RowForm entity={entity} row={row} parentId={parentId} back={back} />
        {children}
      </div>
    </details>
  );
}

/** Bloco "Adicionar", recolhido por padrão. */
export function NewCard({ entity, parentId, back }: { entity: Entity; parentId?: string; back: string }) {
  return (
    <details className="group rounded-xl border border-line-active bg-gold/5">
      <summary className="ui-label flex min-h-12 cursor-pointer list-none items-center px-4 text-sm text-gold-pale sm:px-5 [&::-webkit-details-marker]:hidden">
        + Adicionar {entity.singular}
      </summary>
      <div className="border-t border-line p-4 sm:p-5">
        <RowForm entity={entity} parentId={parentId} back={back} />
      </div>
    </details>
  );
}
