"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, ExternalLink, RefreshCw, Star } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog";
import { copyText, Highlight, normalize } from "@/components/explorer-kit";
import { FilterAction, FilterPanel, FilterSearch, FilterSelect } from "@/components/filter-panel";
import { refreshCatalog } from "./actions";

// Lista dos Links Guru: busca, filtros, favoritos e cópia do link de pagamento. Os dados chegam prontos de lib/catalog.ts.
const BRANDS = ["CPPEM", "Colégio", "Unicive"] as const;
const FAVORITES_KEY = "links-cppem:favoritos";

const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/*
 * Favoritos de cada pessoa, guardados no navegador. Ficam num store externo (e não em
 * useState + useEffect) para que servidor e cliente rendereizem o mesmo HTML na primeira
 * pintura. localStorage pode falhar (aba anônima, storage bloqueado) e a página segue funcionando.
 */
const NO_FAVORITES: string[] = [];
let favoritesCache: string[] | null = null;
const favoritesListeners = new Set<() => void>();

function getFavorites(): string[] {
  if (favoritesCache) return favoritesCache;
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    favoritesCache = raw ? (JSON.parse(raw) as string[]) : NO_FAVORITES;
  } catch {
    favoritesCache = NO_FAVORITES;
  }
  return favoritesCache;
}

function saveFavorites(next: string[]) {
  favoritesCache = next;
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    // sem localStorage o favorito vale só para esta sessão
  }
  favoritesListeners.forEach((notify) => notify());
}

function subscribeFavorites(notify: () => void) {
  favoritesListeners.add(notify);
  return () => favoritesListeners.delete(notify);
}

export default function LinksExplorer({
  items,
  lastChangeAt,
}: {
  items: CatalogItem[];
  lastChangeAt: number;
}) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const favorites = useSyncExternalStore(subscribeFavorites, getFavorites, () => NO_FAVORITES);
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [isRefreshing, startRefresh] = useTransition();
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const haystacks = useMemo(
    () => new Map(items.map((item) => [item.id, normalize(`${item.name} ${item.product} ${item.brand}`)])),
    [items],
  );

  const terms = useMemo(() => normalize(query).split(/\s+/).filter(Boolean), [query]);

  const visible = useMemo(() => {
    const favoriteSet = new Set(favorites);
    let list = items.filter((item) => {
      if (brand && item.brand !== brand) return false;
      if (onlyFavorites && !favoriteSet.has(item.slug)) return false;
      const hay = haystacks.get(item.id) ?? "";
      return terms.every((term) => hay.includes(term));
    });

    if (terms.length) {
      const full = terms.join(" ");
      list = [...list].sort((a, b) => {
        const byPrefix =
          Number(!normalize(a.name).startsWith(full)) - Number(!normalize(b.name).startsWith(full));
        return byPrefix || Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, "pt-BR");
      });
    }
    return list;
  }, [items, brand, onlyFavorites, favorites, terms, haystacks]);

  const starred = useMemo(() => {
    const favoriteSet = new Set(favorites);
    return visible.filter((item) => item.featured || favoriteSet.has(item.slug));
  }, [visible, favorites]);

  const archivedCount = useMemo(() => items.filter((item) => item.archived).length, [items]);
  const searching = terms.length > 0 || onlyFavorites;
  const ordered = searching ? visible : [...starred, ...visible.filter((item) => !starred.includes(item))];

  function copy(item: CatalogItem) {
    copyText(item.url, () => {
      setCopied(item.id);
      setToast(`✓ Link copiado: ${item.name}`);
      setTimeout(() => setCopied((current) => (current === item.id ? null : current)), 1600);
    });
  }

  function toggleFavorite(item: CatalogItem) {
    const isFavorite = favorites.includes(item.slug);
    saveFavorites(
      isFavorite ? favorites.filter((slug) => slug !== item.slug) : [...favorites, item.slug],
    );
    setToast(isFavorite ? "Removido dos favoritos" : "⭐ Adicionado aos favoritos");
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((value) => Math.min(value + 1, ordered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = ordered[selected];
      if (item) copy(item);
    } else if (event.key === "Escape") {
      setQuery("");
      setSelected(0);
    }
  }

  const lastChangeLabel = lastChangeAt
    ? // fuso fixo: servidor (UTC) e navegador precisam gerar o mesmo texto, senão a hidratação quebra
      new Date(lastChangeAt * 1000).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "America/Recife",
      })
    : "—";

  return (
    <>
      <FilterPanel
        activeCount={Number(Boolean(brand)) + Number(onlyFavorites)}
        search={
          <FilterSearch
            inputRef={searchRef}
            autoFocus
            value={query}
            onChange={(value) => {
              setQuery(value);
              setSelected(0);
            }}
            onKeyDown={onSearchKeyDown}
            placeholder="Digite o nome do produto…"
            label="Buscar produto"
          />
        }
        filters={
          <>
            <FilterSelect
              label="Empresa"
              value={brand ?? ""}
              onChange={(value) => {
                setBrand(value || null);
                setSelected(0);
              }}
              options={[{ value: "", label: "Todas as empresas" }, ...BRANDS.map((value) => ({ value, label: value }))]}
            />
            <FilterSelect
              label="Favoritos"
              value={onlyFavorites ? "favoritos" : ""}
              onChange={(value) => {
                setOnlyFavorites(value === "favoritos");
                setSelected(0);
              }}
              options={[
                { value: "", label: "Todos os links" },
                { value: "favoritos", label: "Só meus favoritos" },
              ]}
            />
          </>
        }
        actions={
          <FilterAction
            disabled={!query && !brand && !onlyFavorites}
            onClick={() => {
              setQuery("");
              setBrand(null);
              setOnlyFavorites(false);
              setSelected(0);
            }}
          >
            Limpar filtros
          </FilterAction>
        }
        extra={
          <FilterAction
            disabled={isRefreshing}
            onClick={() =>
              // updateTag() derruba o cache; o router.refresh() dentro da mesma transição
              // mantém o botão em "Atualizando…" até a página voltar com os dados novos.
              startRefresh(async () => {
                await refreshCatalog();
                router.refresh();
              })
            }
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="max-sm:hidden">{isRefreshing ? "Atualizando… (até 2 min)" : "Atualizar agora"}</span>
            <span className="sm:hidden">{isRefreshing ? "Atualizando…" : "Atualizar"}</span>
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
        {searching
          ? `${ordered.length} resultado${ordered.length === 1 ? "" : "s"}`
          : `${ordered.length} ofertas ativas · ${starred.length} em destaque${archivedCount ? ` · ${archivedCount} arquivadas` : ""}`}
      </h2>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="ui-label hidden grid-cols-[minmax(0,1fr)_130px_150px_110px_150px] gap-4 border-b border-line bg-surface-2 px-4 py-3 text-[11px] text-gold-light md:grid">
          <div>Produto</div>
          <div className="text-right">Valor</div>
          <div className="text-right">Parcelado</div>
          <div>Empresa</div>
          <div />
        </div>

        {ordered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            Nenhuma oferta encontrada{query ? ` para “${query}”` : ""}.
          </p>
        )}

        {ordered.map((item, index) => {
          const isFavorite = favorites.includes(item.slug);
          return (
            <div
              key={item.id}
              onClick={() => copy(item)}
              className={`grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-t border-line px-3 py-2.5 transition first:border-t-0 md:grid-cols-[minmax(0,1fr)_130px_150px_110px_150px] md:gap-x-4 md:gap-y-2 md:px-4 md:py-3 ${
                index === selected && searching ? "bg-gold/10" : "hover:bg-surface-2"
              } ${item.featured || isFavorite ? "row-featured" : ""}`}
            >
              <div className="col-start-1 row-start-1 min-w-0 md:col-auto md:row-auto">
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(item);
                    }}
                    className="-m-2.5 mt-0 p-2.5 text-muted transition hover:text-gold-light"
                  >
                    <Star className={`h-4 w-4 ${isFavorite || item.featured ? "fill-gold text-gold" : ""}`} />
                  </button>
                  <div className="min-w-0">
                    <p className="line-clamp-3 font-display text-[0.9rem] font-bold uppercase leading-snug tracking-tight md:line-clamp-none md:text-[0.95rem]">
                      <Highlight text={item.name} terms={terms} />
                    </p>
                    {!item.name.toUpperCase().includes(item.product.toUpperCase()) && (
                      <p className="hidden truncate text-xs text-muted/80 md:block">{item.product}</p>
                    )}
                    <p className="hidden truncate text-xs text-muted md:block">{item.url.replace("https://", "")}</p>
                    {item.plan && (
                      <p className="text-xs text-gold-light">
                        Assinatura · cobrança por {item.plan.every}
                        {item.plan.cycles ? ` · ${item.plan.cycles} ciclos` : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-2 row-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 md:contents">
              <div className="font-display text-[0.95rem] font-bold tabular-nums text-gold-pale md:text-base md:text-right">
                {brl(item.value)}
              </div>

              <div className="text-xs tabular-nums text-soft md:text-sm md:text-right">
                {item.installments ? (
                  <>
                    {item.installments.count}x {brl(item.installments.value)}
                  </>
                ) : (
                  <span className="text-muted/50 md:inline">—</span>
                )}
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-1.5 md:ml-0">
                <span className="ui-label rounded-full border border-line px-2.5 py-0.5 text-[10px] text-gold-light">
                  {item.brand}
                </span>
                {item.archived && (
                  <span
                    className="ui-label rounded-full border border-line px-2 py-0.5 text-[10px] text-muted"
                    title="Produto oculto no catálogo da Guru — o link funciona, mas não é mais divulgado"
                  >
                    Arquivado
                  </span>
                )}
              </div>
              </div>

              <div className="col-start-2 row-start-1 flex gap-1.5 md:col-auto md:row-auto md:justify-end md:gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    copy(item);
                  }}
                  aria-label="Copiar link"
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
                  aria-label="Abrir checkout"
                  className="ghost-button flex w-9 items-center justify-center rounded-md text-muted transition hover:text-gold-pale md:w-11"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-8 border-t border-line pt-5 text-center text-xs text-muted">
        {items.length} ofertas · última alteração na Guru em {lastChangeLabel} · a página se atualiza sozinha a cada 10 minutos
      </footer>

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
