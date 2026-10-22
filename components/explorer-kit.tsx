import type { ReactNode } from "react";

// Peças compartilhadas pelas telas de busca e cópia de links (Guru e atendimento).

export const normalize = (value: string) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Destaca no texto os termos buscados (já normalizados, sem acento e em minúsculas). */
export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  const source = normalize(text);
  const marks: Array<[number, number]> = [];
  for (const term of terms) {
    let from = 0;
    let at = source.indexOf(term, from);
    while (at !== -1) {
      marks.push([at, at + term.length]);
      from = at + term.length;
      at = source.indexOf(term, from);
    }
  }
  if (!marks.length) return <>{text}</>;
  marks.sort((a, b) => a[0] - b[0]);

  const parts: ReactNode[] = [];
  let cursor = 0;
  marks.forEach(([start, end], i) => {
    if (start < cursor) return;
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      <mark key={i} className="rounded-sm bg-gold/25 px-0.5 text-gold-pale">
        {text.slice(start, end)}
      </mark>,
    );
    cursor = end;
  });
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function fallbackCopy(text: string, done: () => void) {
  const field = document.createElement("textarea");
  field.value = text;
  field.style.cssText = "position:fixed;top:0;left:0;opacity:0";
  document.body.appendChild(field);
  field.select();
  const ok = document.execCommand("copy");
  field.remove();
  if (ok) done();
  else window.prompt("Copie o link com Ctrl+C:", text);
}

/** Copia o texto; `done` roda quando a cópia deu certo. */
export function copyText(text: string, done: () => void) {
  // navigator.clipboard exige contexto seguro; execCommand cobre o resto
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

/** Visual dos botões de filtro (pílulas), igual ao da página de links da Guru. */
export const chipClass = (active: boolean) =>
  `ui-label rounded-full border px-4 py-1.5 text-xs transition ${
    active
      ? "border-transparent bg-linear-[145deg,var(--gold-pale),var(--gold)] text-[#17130b]"
      : "border-line bg-surface text-soft hover:border-line-active hover:text-gold-pale"
  }`;
