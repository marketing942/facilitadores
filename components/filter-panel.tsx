import type { KeyboardEvent, ReactNode, Ref } from "react";
import { ChevronDown, Search } from "lucide-react";

// Barra de filtros das telas de busca (links da Guru e links de atendimento):
// painel com a busca em cima e filtros em listas (selects) logo abaixo.

/** Painel que gruda no topo (abaixo do menu) enquanto a lista rola; no celular fica solto, para não ocupar a tela. */
export function FilterPanel({ children }: { children: ReactNode }) {
  return (
    <div className="z-10 -mx-4 sm:sticky sm:top-16 bg-background/95 px-4 pb-3 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3 sm:p-4">{children}</div>
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

/** Linha dos filtros: listas à esquerda e ações (limpar, atualizar…) à direita. */
export function FilterRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>;
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
