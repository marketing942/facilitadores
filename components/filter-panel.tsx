"use client";

import { useState, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

// Barra de filtros das telas de busca (links da Guru e links de atendimento):
// painel com a busca em cima e filtros em listas (selects) logo abaixo.

/**
 * Painel de filtros. No computador mostra tudo (busca, listas e ações) e gruda no topo; no celular fica solto
 * e recolhe as listas atrás do botão "Filtros" para a lista de links aparecer logo.
 */
export function FilterPanel({
  search,
  filters,
  actions,
  extra,
  activeCount,
}: {
  /** Campo de busca (sempre visível) */
  search: ReactNode;
  /** As listas de filtro (recolhidas no celular) */
  filters: ReactNode;
  /** Ações dos filtros, como "Limpar filtros" (recolhidas no celular) */
  actions: ReactNode;
  /** Ação que fica sempre à vista no celular, ao lado do botão "Filtros" (ex.: Atualizar agora) */
  extra?: ReactNode;
  /** Quantos filtros estão ligados (mostrado no botão do celular) */
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="z-10 -mx-4 bg-background/95 px-4 pb-3 pt-4 backdrop-blur sm:sticky sm:top-16 sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-3 sm:gap-3 sm:p-4">
        {search}

        {/* Celular: botão que abre/fecha as listas + ação rápida */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={`flex h-11 flex-1 items-center justify-between rounded-xl border bg-surface-2 px-4 text-base transition-colors ${
              activeCount > 0 ? "border-gold/60 text-gold-pale" : "border-line text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gold-light" />
              Filtros
              {activeCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-[#17130b]">
                  {activeCount}
                </span>
              )}
            </span>
            <ChevronDown className={`h-4 w-4 text-gold-light transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {extra}
        </div>

        {/* Listas e ações: sempre no computador; no celular só com o botão aberto */}
        <div
          className={`${open ? "flex" : "hidden"} flex-col gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-center`}
        >
          {filters}
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {actions}
            <span className="hidden sm:contents">{extra}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FilterSearch({
  value,
  onChange,
  onKeyDown,
  placeholder,
  label,
  inputRef,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  inputRef?: Ref<HTMLInputElement>;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gold-light" />
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={label}
        className="h-11 w-full rounded-xl border border-line bg-surface-2 pl-11 pr-4 text-base outline-none sm:text-[15px] transition-colors placeholder:text-muted focus:border-gold"
      />
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** A primeira opção (valor vazio) é "Todos…" e representa o filtro desligado. */
  options: { value: string; label: string }[];
}) {
  const active = value !== "";
  return (
    <div className="relative w-full sm:w-56">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full cursor-pointer appearance-none rounded-xl border bg-surface-2 pl-4 pr-10 text-base outline-none sm:text-sm transition-colors focus:border-gold ${
          active ? "border-gold/60 text-gold-pale" : "border-line text-foreground"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-light" />
    </div>
  );
}

/** Botão em pílula das ações da barra. */
export function FilterAction({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 items-center gap-2 rounded-full sm:h-10 border border-line bg-surface-2 px-5 text-sm font-semibold text-foreground transition hover:border-line-active hover:text-gold-pale disabled:cursor-default disabled:opacity-40 disabled:hover:border-line disabled:hover:text-foreground"
    >
      {children}
    </button>
  );
}
