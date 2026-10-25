"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { BU_NAMES, BUS, type Channel, type Kind, type ServiceLink } from "@/config/atendimento";
import { copyText, Highlight, normalize } from "@/components/explorer-kit";
import { FilterAction, FilterPanel, FilterSearch, FilterSelect } from "@/components/filter-panel";

const CHANNELS: Channel[] = ["Humano", "IA"];
const KINDS: Kind[] = ["Atendimento", "Suporte"];

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
      new Map(items.map((item) => [item.id, normalize(`${item.title} ${item.bu} ${BU_NAMES[item.bu]} ${item.kind} ${item.channel} ${item.url}`)])),
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

  function copy(item: ServiceLink) {
    copyText(item.url, () => {
      setCopied(item.id);
      setToast(`✓ Link copiado: ${item.title} · ${item.bu}`);
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
      <FilterPanel
        activeCount={Number(Boolean(bu)) + Number(Boolean(channel)) + Number(Boolean(kind))}
        search={
          <FilterSearch
            autoFocus
            value={query}
            onChange={(value) => {
              setQuery(value);
              setSelected(0);
            }}
            onKeyDown={onSearchKeyDown}
            placeholder="Digite o canal ou a BU…"
            label="Buscar link de atendimento"
          />
        }
        filters={
          <>
            <FilterSelect
              label="BU"
              value={bu ?? ""}
              onChange={(value) => {
                setBu((value || null) as ServiceLink["bu"] | null);
                setSelected(0);
              }}
              options={[{ value: "", label: "Todas as BUs" }, ...BUS.map((value) => ({ value, label: value }))]}
            />
            <FilterSelect
              label="Tipo"
              value={channel ?? ""}
              onChange={(value) => {
                setChannel((value || null) as Channel | null);
                setSelected(0);
              }}
              options={[
                { value: "", label: "Todos os tipos" },
                ...CHANNELS.map((value) => ({ value, label: value === "IA" ? "IA" : "Humano" })),
              ]}
            />
            <FilterSelect
              label="Finalidade"
              value={kind ?? ""}
              onChange={(value) => {
                setKind((value || null) as Kind | null);
                setSelected(0);
              }}
              options={[{ value: "", label: "Todas as finalidades" }, ...KINDS.map((value) => ({ value, label: value }))]}
            />
          </>
        }
        actions={
          <FilterAction
            disabled={!query && !bu && !channel && !kind}
            onClick={() => {
              setQuery("");
              setBu(null);
              setChannel(null);
              setKind(null);
              setSelected(0);
            }}
          >
            Limpar filtros
          </FilterAction>
        }
      />

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
          <div>BU</div>
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
          <Fragment key={item.id}>
          {item.bu !== visible[index - 1]?.bu && (
            <div className="ui-label flex items-center justify-between border-t border-line bg-surface-2 px-3 py-2 text-[11px] text-gold-light first:border-t-0 md:px-4">
              <span>{BU_NAMES[item.bu]}</span>
              <span className="text-muted">{visible.filter((other) => other.bu === item.bu).length}</span>
            </div>
          )}
          <div
            onClick={() => copy(item)}
            className={`grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-t border-line px-3 py-2.5 transition md:grid-cols-[minmax(0,1fr)_110px_100px_120px_150px] md:gap-x-4 md:gap-y-2 md:px-4 md:py-3 ${
              index === selected && terms.length > 0 ? "bg-gold/10" : "hover:bg-surface-2"
            }`}
          >
            <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-3 md:col-auto md:row-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.photo}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                className="h-10 w-10 flex-none rounded-full border border-line object-cover md:h-12 md:w-12"
              />
              <div className="min-w-0">
              <p className="line-clamp-3 font-display text-[0.9rem] font-bold uppercase leading-snug tracking-tight md:line-clamp-none md:text-[0.95rem]">
                <Highlight text={item.title} terms={terms} />
              </p>
              <p className="truncate text-xs text-muted">{item.url.replace("https://", "")}</p>
              </div>
            </div>

            <div className="col-span-2 row-start-2 flex flex-wrap items-center gap-x-2 gap-y-1 md:contents">
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

            <div className="text-xs text-soft md:text-sm">{item.kind}</div>
            </div>

            <div className="col-start-2 row-start-1 flex gap-1.5 md:col-auto md:row-auto md:justify-end md:gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  copy(item);
                }}
                aria-label={`Copiar link: ${item.title} · ${item.bu}`}
                className={`ui-label flex flex-none items-center justify-center gap-1.5 rounded-md px-2.5 py-2 text-xs transition md:px-3 ${
                  copied === item.id ? "bg-gold-pale text-[#16130c]" : "gold-button"
                }`}
              >
                {copied === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="max-md:sr-only">{copied === item.id ? "Copiado" : "Copiar"}</span>
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noopener"
                onClick={(event) => event.stopPropagation()}
                aria-label={`Abrir link: ${item.title} · ${item.bu}`}
                className="ghost-button flex w-9 items-center justify-center rounded-md text-muted transition hover:text-gold-pale md:w-11"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          </Fragment>
        ))}
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-24 left-1/2 lg:bottom-6 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-lg border border-line-active bg-surface-2 px-4 py-2.5 text-sm font-medium text-gold-pale shadow-[0_18px_45px_rgba(0,0,0,.45)] transition ${
          toast ? "opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        {toast}
      </div>
    </>
  );
}
