"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ExternalLink, X } from "lucide-react";
import { CATEGORIAS, type Livro } from "@/config/biblioteca";
import { Highlight, normalize } from "@/components/explorer-kit";
import { FilterAction, FilterPanel, FilterSearch, FilterSelect } from "@/components/filter-panel";

// Prateleira da Biblioteca: busca, filtro por tema e a ficha de cada livro (modal).
function Capa({ livro, className = "" }: { livro: Livro; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/biblioteca/${livro.slug}.jpg`}
      alt={`Capa de ${livro.titulo}`}
      loading="lazy"
      className={`aspect-[2/3] w-full rounded-sm bg-surface-2 object-cover ${className}`}
    />
  );
}

function Lista({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <section>
      <h3 className="eyebrow mb-2">{titulo}</h3>
      {itens.length === 1 ? (
        <p className="text-sm leading-relaxed text-soft">{itens[0]}</p>
      ) : (
        <ul className="space-y-1.5 text-sm leading-relaxed text-soft">
          {itens.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="mt-2 h-1 w-1 flex-none rounded-full bg-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Detalhe({ livro, onClose }: { livro: Livro; onClose: () => void }) {
  const fechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fechar.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={livro.titulo}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-line-active bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,.6)] sm:rounded-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-ink sm:text-2xl">{livro.titulo}</h2>
            <p className="mt-1 text-sm text-soft">{livro.autor}</p>
          </div>
          <button
            ref={fechar}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="ghost-button flex h-10 w-10 flex-none items-center justify-center rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-7">
          <div className="mx-auto w-32 sm:w-full">
            <Capa livro={livro} className="shadow-[0_12px_30px_rgba(0,0,0,.55)]" />
          </div>
          <div className="space-y-5">
            <p className="flex flex-wrap gap-1.5">
              {livro.categorias.map((c) => (
                <span key={c} className="ui-label rounded-full border border-line px-2.5 py-0.5 text-[10px] text-gold-light">
                  {c}
                </span>
              ))}
            </p>
            <Lista titulo="O que o livro entrega" itens={livro.objetivos} />
            <Lista titulo="Para quem é" itens={livro.publico} />
            <div className="flex flex-wrap gap-2">
              <a
                href={livro.notion}
                target="_blank"
                rel="noopener"
                className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4"
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-xs">Ler no Notion</span>
              </a>
              <a
                href={livro.compra}
                target="_blank"
                rel="noopener"
                className="ghost-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-xs">Ver na Amazon</span>
              </a>
            </div>
            <p className="text-xs text-muted">O PDF fica na Biblioteca Gratuita do Notion da CPPEM: é preciso estar logado lá.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BibliotecaExplorer({ livros }: { livros: Livro[] }) {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("");
  const [aberto, setAberto] = useState<Livro | null>(null);

  const haystacks = useMemo(
    () => new Map(livros.map((l) => [l.slug, normalize(`${l.titulo} ${l.autor} ${l.categorias.join(" ")}`)])),
    [livros],
  );
  const terms = useMemo(() => normalize(query).split(/\s+/).filter(Boolean), [query]);

  const visiveis = useMemo(
    () =>
      livros.filter(
        (l) => (!categoria || l.categorias.includes(categoria)) && terms.every((t) => (haystacks.get(l.slug) ?? "").includes(t)),
      ),
    [livros, categoria, terms, haystacks],
  );

  return (
    <>
      <FilterPanel
        activeCount={Number(Boolean(categoria))}
        search={
          <FilterSearch
            value={query}
            onChange={setQuery}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Busque por título, autor ou tema…"
            label="Buscar livro"
          />
        }
        filters={
          <FilterSelect
            label="Tema"
            value={categoria}
            onChange={setCategoria}
            options={[{ value: "", label: "Todos os temas" }, ...CATEGORIAS.map((c) => ({ value: c, label: c }))]}
          />
        }
        actions={
          <FilterAction
            disabled={!query && !categoria}
            onClick={() => {
              setQuery("");
              setCategoria("");
            }}
          >
            Limpar filtros
          </FilterAction>
        }
      />

      <h2 className="eyebrow mb-4 mt-6">
        {query || categoria ? `${visiveis.length} livro${visiveis.length === 1 ? "" : "s"}` : `${livros.length} livros na prateleira`}
      </h2>

      {visiveis.length === 0 && <p className="py-10 text-center text-sm text-muted">Nenhum livro encontrado.</p>}

      <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-5 md:grid-cols-5 lg:grid-cols-6">
        {visiveis.map((livro) => (
          <li key={livro.slug}>
            <button
              type="button"
              onClick={() => setAberto(livro)}
              aria-label={`${livro.titulo}, de ${livro.autor}. Abrir detalhes`}
              className="group block w-full text-left"
            >
              {/* A "prateleira": a capa apoiada numa tábua dourada */}
              <span className="block border-b-[5px] border-gold-dark/70 pb-0 [box-shadow:0_8px_10px_-8px_rgba(0,0,0,.8)]">
                <Capa livro={livro} className="transition duration-200 group-hover:-translate-y-1.5 group-hover:shadow-[0_14px_26px_rgba(0,0,0,.6)]" />
              </span>
              <span className="mt-2 block text-[13px] font-semibold leading-snug text-ink line-clamp-2">
                <Highlight text={livro.titulo} terms={terms} />
              </span>
              <span className="block truncate text-xs text-muted">{livro.autor}</span>
            </button>
          </li>
        ))}
      </ul>

      {aberto && <Detalhe livro={aberto} onClose={() => setAberto(null)} />}
    </>
  );
}
