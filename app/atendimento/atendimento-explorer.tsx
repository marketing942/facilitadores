"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Search } from "lucide-react";
import { BUS, type Channel, type Kind, type ServiceLink } from "@/config/atendimento";
import { chipClass, copyText, Highlight, normalize } from "@/components/explorer-kit";

const CHANNELS: Channel[] = ["Humano", "IA"];
const KINDS: Kind[] = ["Atendimento", "Suporte"];

/** Grupo de filtro de escolha única (clicar de novo no ativo volta para "Todos"). */
function FilterGroup<T extends string>({
  label,
  allLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  allLabel: string;
  options: readonly T[];
  value: T | null;
  onChange: (next: T | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="ui-label mr-1 w-full text-[11px] text-muted sm:w-auto">{label}</span>
      {[null, ...options].map((option) => (
        <button
          key={option ?? "todos"}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={chipClass(value === option)}
        >
          {option ?? allLabel}
        </button>
      ))}
    </div>
  );
}

export default function AtendimentoExplorer({ items }: { items: ServiceLink[] }) {
  const [query, setQuery] = useState("");
  const [bu, setBu] = useState<ServiceLink["bu"] | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [kind, setKind] = useState<Kind | null>(null);
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const haystacks = useMemo(
    () =>
      new Map(items.map((item) => [item.id, normalize(`${item.title} ${item.bu} ${item.kind} ${item.channel} ${item.url}`)])),
    [items],
  );

  const terms = useMemo(() => normalize(query).split(/\s+/).filter(Boolean), [query]);

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (bu && item.bu !== bu) return false;
        if (channel && item.channel !== channel) return false;
        if (kind && item.kind !== kind) return false;
        const hay = haystacks.get(item.id) ?? "";
        return terms.every((term) => hay.includes(term));
      }),
    [items, bu, channel, kind, terms, haystacks],
  );

  const filtering = terms.length > 0 || Boolean(bu || channel || kind);

  function resetSelection<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setSelected(0);
    };
  }

  function copy(item: ServiceLink) {
    copyText(item.url, () => {
      setCopied(item.id);
      setToast(`✓ Link copiado: ${item.title}`);
      setTimeout(() => setCopied((current) => (current === item.id ? null : current)), 1600);
    });
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((value) => Math.min(value + 1, visible.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = visible[selected];
      if (item) copy(item);
    } else if (event.key === "Escape") {
      setQuery("");
      setSelected(0);
    }
  }

  return (
    <>
      <div className="sticky top-16 z-10 -mx-4 bg-background/95 px-4 pb-3 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-light" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={onSearchKeyDown}
            placeholder="Digite o canal ou a empresa…"
            aria-label="Buscar link de atendimento"
            className="w-full rounded-lg border border-line bg-surface-2 py-4 pl-12 pr-4 text-base outline-none transition-colors placeholder:text-muted focus:border-gold sm:text-lg"
          />
        </div>

        <div className="mt-3 flex flex-col gap-2.5">
          <FilterGroup label="Empresa" allLabel="Todos" options={BUS} value={bu} onChange={resetSelection(setBu)} />
          <div className="flex flex-wrap gap-x-8 gap-y-2.5">
            <FilterGroup
              label="Tipo"
              allLabel="Todos"
              options={CHANNELS}
              value={channel}
              onChange={resetSelection(setChannel)}
            />
            <FilterGroup
              label="Finalidade"
              allLabel="Todas"
              options={KINDS}
              value={kind}
              onChange={resetSelection(setKind)}
            />
          </div>
        </div>
      </div>

      <p className="mt-3 hidden text-xs text-muted sm:block">
        <kbd className="rounded border border-line bg-surface px-1 text-soft">↑</kbd>{" "}
        <kbd className="rounded border border-line bg-surface px-1 text-soft">↓</kbd> para escolher ·{" "}
        <kbd className="rounded border border-line bg-surface px-1 text-soft">Enter</kbd> copia o link ·{" "}
        <kbd className="rounded border border-line bg-surface px-1 text-soft">Esc</kbd> limpa a busca
      </p>

      <h2 className="eyebrow mb-3 mt-7">
        {filtering
          ? `${visible.length} resultado${visible.length === 1 ? "" : "s"}`
          : `${items.length} links de atendimento e suporte`}
      </h2>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="ui-label hidden grid-cols-[minmax(0,1fr)_110px_100px_120px_150px] gap-4 border-b border-line bg-surface-2 px-4 py-3 text-[11px] text-gold-light md:grid">
          <div>Canal</div>
          <div>Empresa</div>
          <div>Tipo</div>
          <div>Finalidade</div>
          <div />
        </div>

        {visible.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            Nenhum link encontrado{query ? ` para “${query}”` : ""}.
          </p>
        )}

        {visible.map((item, index) => (
          <div
            key={item.id}
            onClick={() => copy(item)}
            className={`grid cursor-pointer grid-cols-2 items-center gap-x-4 gap-y-2 border-t border-line px-4 py-3 transition first:border-t-0 md:grid-cols-[minmax(0,1fr)_110px_100px_120px_150px] ${
              index === selected && terms.length > 0 ? "bg-gold/10" : "hover:bg-surface-2"
            }`}
          >
            <div className="col-span-2 min-w-0 md:col-span-1">
              <p className="font-display text-[0.95rem] font-bold uppercase leading-snug tracking-tight">
                <Highlight text={item.title} terms={terms} />
              </p>
              <p className="truncate text-xs text-muted">{item.url.replace("https://", "")}</p>
            </div>

            <div>
              <span className="ui-label rounded-full border border-line px-2.5 py-0.5 text-[10px] text-gold-light">
                {item.bu}
              </span>
            </div>

            <div>
              <span
                className={`ui-label rounded-full border px-2.5 py-0.5 text-[10px] ${
                  item.channel === "IA"
                    ? "border-violet-400/40 bg-violet-400/10 text-violet-300"
                    : "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                }`}
              >
                {item.channel}
              </span>
            </div>

            <div className="text-sm text-soft">{item.kind}</div>

            <div className="col-span-2 flex gap-2 md:col-span-1 md:justify-end">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  copy(item);
                }}
                className={`ui-label flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs transition md:flex-none ${
                  copied === item.id ? "bg-gold-pale text-[#16130c]" : "gold-button"
                }`}
              >
                {copied === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === item.id ? "Copiado" : "Copiar"}
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noopener"
                onClick={(event) => event.stopPropagation()}
                aria-label="Abrir link"
                className="ghost-button flex w-11 items-center justify-center rounded-md text-muted transition hover:text-gold-pale"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-8 border-t border-line pt-5 text-center text-xs text-muted">
        {items.length} links · clique na linha ou em “Copiar” para copiar
      </footer>

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-lg border border-line-active bg-surface-2 px-4 py-2.5 text-sm font-medium text-gold-pale shadow-[0_18px_45px_rgba(0,0,0,.45)] transition ${
          toast ? "opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        {toast}
      </div>
    </>
  );
}
