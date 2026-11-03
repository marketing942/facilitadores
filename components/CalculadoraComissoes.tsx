"use client";

// Tela da Calculadora de Comissões. Quatro categorias, cada uma com quantos colaboradores forem preciso; cada
// colaborador tem seu cálculo próprio. Os números vêm de lib/comissoes.ts (as mesmas funções montam a tela e o relatório).
// Os dados ficam só na memória desta aba do navegador: recarregar a página começa do zero.

import { useRef, useState } from "react";
import { Calculator, Check, Copy, Plus, Printer, Trash2 } from "lucide-react";
import { CATEGORIAS, REGRAS, type Categoria } from "@/config/comissoes";
import {
  calcularColegio,
  calcularSuporte,
  calcularTudo,
  comissaoPercentual,
  formatarReais,
  montarRelatorio,
  paraCentavos,
  paraInteiro,
  paraPercentual,
  type ColabColegio,
  type ColabPercentual,
  type ColabSuporte,
  type Estado,
} from "@/lib/comissoes";
import { copyText } from "@/components/explorer-kit";

const inputClass =
  "w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-base font-medium text-ink placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold-light sm:text-sm";

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

function Afixo({ antes, depois, children }: { antes?: string; depois?: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      {antes && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">{antes}</span>}
      <div className={antes ? "[&_input]:pl-10" : depois ? "[&_input]:pr-9" : ""}>{children}</div>
      {depois && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">{depois}</span>}
    </div>
  );
}

/** Cartão de um colaborador: campos à esquerda, resultado e botão Remover. */
function Cartao({ titulo, onRemover, children, resultado }: { titulo: string; onRemover: () => void; children: React.ReactNode; resultado: React.ReactNode }) {
  return (
    <li className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3.5 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3.5">
        <div className="min-w-0 text-sm text-soft">{resultado}</div>
        <button
          type="button"
          onClick={onRemover}
          aria-label={`Remover ${titulo}`}
          className="ghost-button ui-label inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-xs"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-xs">Remover</span>
        </button>
      </div>
    </li>
  );
}

const Destaque = ({ children }: { children: React.ReactNode }) => <strong className="font-display text-xl font-extrabold text-gold-pale">{children}</strong>;

const estadoInicial = (): Estado => ({
  periodo: "",
  cppem: [{ id: "i1", nome: "", vendido: "", percentual: "" }],
  colegio: [{ id: "i2", nome: "", matriculas: "" }],
  suporte: [{ id: "i3", nome: "", alunos: "", valorAluno: "" }],
  unicive: [{ id: "i4", nome: "", vendido: "", percentual: "" }],
});

export default function CalculadoraComissoes() {
  const [e, setE] = useState<Estado>(estadoInicial);
  const [copiado, setCopiado] = useState(false);
  const [atualizado, setAtualizado] = useState(false);
  const contador = useRef(4);
  const relatorioRef = useRef<HTMLElement>(null);

  const totais = calcularTudo(e);
  const relatorio = montarRelatorio(e);
  const novoId = () => `n${++contador.current}`;

  /* ---- adicionar, alterar e remover (funções reutilizadas pelas 4 categorias) ---- */
  function adicionar(cat: Categoria) {
    const id = novoId();
    setE((s) => {
      switch (cat) {
        case "cppem": return { ...s, cppem: [...s.cppem, { id, nome: "", vendido: "", percentual: "" }] };
        case "unicive": return { ...s, unicive: [...s.unicive, { id, nome: "", vendido: "", percentual: "" }] };
        case "colegio": return { ...s, colegio: [...s.colegio, { id, nome: "", matriculas: "" }] };
        case "suporte": return { ...s, suporte: [...s.suporte, { id, nome: "", alunos: "", valorAluno: "" }] };
      }
    });
  }
  function alterar(cat: Categoria, id: string, campo: string, valor: string) {
    setE((s) => ({ ...s, [cat]: (s[cat] as { id: string }[]).map((c) => (c.id === id ? { ...c, [campo]: valor } : c)) }));
  }
  function remover(cat: Categoria, id: string) {
    setE((s) => ({ ...s, [cat]: (s[cat] as { id: string }[]).filter((c) => c.id !== id) }));
  }

  /* ---- botões ---- */
  function calcular() {
    // os valores já atualizam enquanto se digita; o botão leva ao relatório e confirma
    relatorioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setAtualizado(true);
    setTimeout(() => setAtualizado(false), 2200);
  }
  function copiar() {
    copyText(relatorio, () => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    });
  }
  function limpar() {
    if (!window.confirm("Apagar todos os colaboradores e valores e começar do zero?")) return;
    setE(estadoInicial());
    contador.current = 4;
  }

  const secao = <T extends { id: string }>(cat: Categoria, lista: T[], renderCartao: (c: T) => React.ReactNode) => {
    const info = CATEGORIAS.find((c) => c.id === cat)!;
    return (
      <section key={cat} aria-labelledby={`cat-${cat}`} className="mt-7">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id={`cat-${cat}`} className="font-display text-xl font-bold uppercase tracking-tight text-ink">
            {info.titulo}
          </h2>
          <p className="ui-label rounded-full border border-line-active bg-gold/10 px-3 py-1 text-[11px] text-gold-pale">
            Subtotal: {formatarReais(totais.totais[cat])}
          </p>
        </div>
        {cat === "colegio" && (
          <p className="mb-3 text-sm text-soft">
            {formatarReais(REGRAS.colegio.porMatriculaCentavos)} por matrícula, mais bônus de {formatarReais(REGRAS.colegio.bonusCentavos)} a cada{" "}
            {REGRAS.colegio.matriculasPorBonus} matrículas completas.
          </p>
        )}
        {cat === "suporte" && <p className="mb-3 text-sm text-soft">{formatarReais(REGRAS.suporte.porAlunoCentavos)} por aluno recuperado (o valor pode ser alterado em cada colaborador).</p>}
        <ul className="space-y-3">{lista.map((c) => renderCartao(c))}</ul>
        <button type="button" onClick={() => adicionar(cat)} className="ghost-button ui-label mt-3 inline-flex min-h-11 items-center gap-2 rounded-md px-4">
          <Plus className="h-4 w-4" />
          <span className="text-xs">{info.botao.replace(/^\+\s*/, "")}</span>
        </button>
      </section>
    );
  };

  const cartaoPercentual = (cat: "cppem" | "unicive", c: ColabPercentual) => {
    const vendido = paraCentavos(c.vendido);
    const pct = paraPercentual(c.percentual);
    return (
      <Cartao
        key={c.id}
        titulo={c.nome || "colaborador"}
        onRemover={() => remover(cat, c.id)}
        resultado={<>Valor da comissão: <Destaque>{formatarReais(comissaoPercentual(vendido, pct))}</Destaque></>}
      >
        <Campo label="Colaborador">
          <input className={inputClass} autoComplete="off" value={c.nome} onChange={(ev) => alterar(cat, c.id, "nome", ev.target.value)} />
        </Campo>
        <Campo label="Valor total vendido">
          <Afixo antes="R$">
            <input className={inputClass} inputMode="decimal" placeholder="0,00" value={c.vendido} onChange={(ev) => alterar(cat, c.id, "vendido", ev.target.value)} />
          </Afixo>
        </Campo>
        <Campo label="Comissão (%)">
          <Afixo depois="%">
            <input className={inputClass} inputMode="decimal" placeholder="0" value={c.percentual} onChange={(ev) => alterar(cat, c.id, "percentual", ev.target.value)} />
          </Afixo>
        </Campo>
      </Cartao>
    );
  };

  const cartaoColegio = (c: ColabColegio) => {
    const r = calcularColegio(paraInteiro(c.matriculas));
    return (
      <Cartao
        key={c.id}
        titulo={c.nome || "colaborador"}
        onRemover={() => remover("colegio", c.id)}
        resultado={
          <>
            <span className="block">Matrículas: {formatarReais(r.valorMatriculas)} · Bônus: {r.bonus} × {formatarReais(REGRAS.colegio.bonusCentavos)} = {formatarReais(r.valorBonus)}</span>
            Total da comissão: <Destaque>{formatarReais(r.total)}</Destaque>
          </>
        }
      >
        <Campo label="Nome">
          <input className={inputClass} autoComplete="off" value={c.nome} onChange={(ev) => alterar("colegio", c.id, "nome", ev.target.value)} />
        </Campo>
        <Campo label="Quantidade de matrículas">
          <input className={inputClass} inputMode="numeric" placeholder="0" value={c.matriculas} onChange={(ev) => alterar("colegio", c.id, "matriculas", ev.target.value)} />
        </Campo>
      </Cartao>
    );
  };

  const cartaoSuporte = (c: ColabSuporte) => {
    const valorAluno = c.valorAluno.trim() === "" ? REGRAS.suporte.porAlunoCentavos : paraCentavos(c.valorAluno);
    return (
      <Cartao
        key={c.id}
        titulo={c.nome || "colaborador"}
        onRemover={() => remover("suporte", c.id)}
        resultado={<>Valor total da comissão: <Destaque>{formatarReais(calcularSuporte(paraInteiro(c.alunos), valorAluno))}</Destaque></>}
      >
        <Campo label="Colaborador">
          <input className={inputClass} autoComplete="off" value={c.nome} onChange={(ev) => alterar("suporte", c.id, "nome", ev.target.value)} />
        </Campo>
        <Campo label="Alunos recuperados">
          <input className={inputClass} inputMode="numeric" placeholder="0" value={c.alunos} onChange={(ev) => alterar("suporte", c.id, "alunos", ev.target.value)} />
        </Campo>
        <Campo label="Valor por aluno">
          <Afixo antes="R$">
            <input
              className={inputClass}
              inputMode="decimal"
              placeholder={(REGRAS.suporte.porAlunoCentavos / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              value={c.valorAluno}
              onChange={(ev) => alterar("suporte", c.id, "valorAluno", ev.target.value)}
            />
          </Afixo>
        </Campo>
      </Cartao>
    );
  };

  return (
    <>
      {/* ---------- Edição (não sai na impressão) ---------- */}
      <div className="print:hidden">
        <div className="max-w-sm">
          <Campo label="Período">
            <input className={inputClass} placeholder="Ex.: Outubro/2026" value={e.periodo} onChange={(ev) => setE((s) => ({ ...s, periodo: ev.target.value }))} />
          </Campo>
        </div>

        {secao("cppem", e.cppem, (c) => cartaoPercentual("cppem", c))}
        {secao("colegio", e.colegio, cartaoColegio)}
        {secao("suporte", e.suporte, cartaoSuporte)}
        {secao("unicive", e.unicive, (c) => cartaoPercentual("unicive", c))}

        <h2 className="eyebrow mb-3 mt-9">Resumo por empresa</h2>
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {CATEGORIAS.map((c) => (
            <div key={c.id} className="rounded-xl border border-line bg-surface p-3.5">
              <dt className="ui-label text-[10px] text-gold-light">{c.id === "suporte" ? "SUPORTE" : c.titulo}</dt>
              <dd className="mt-1 break-words font-display text-lg font-bold text-ink">{formatarReais(totais.totais[c.id])}</dd>
            </div>
          ))}
          <div className="col-span-2 rounded-xl border border-line-active bg-gold/10 p-3.5 lg:col-span-1">
            <dt className="ui-label text-[10px] text-gold-pale">TOTAL GERAL</dt>
            <dd className="mt-1 break-words font-display text-lg font-extrabold text-gold-pale">{formatarReais(totais.geral)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Ações">
          <button type="button" onClick={calcular} className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            {atualizado ? <Check className="h-4 w-4" /> : <Calculator className="h-4 w-4" />}
            <span className="text-xs">{atualizado ? "Cálculos atualizados" : "Calcular"}</span>
          </button>
          <button type="button" onClick={copiar} className="ghost-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="text-xs">{copiado ? "Relatório copiado" : "Copiar relatório"}</span>
          </button>
          <button type="button" onClick={() => window.print()} className="ghost-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <Printer className="h-4 w-4" />
            <span className="text-xs">Imprimir / Salvar PDF</span>
          </button>
          <button type="button" onClick={limpar} className="ghost-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
            <Trash2 className="h-4 w-4" />
            <span className="text-xs">Limpar</span>
          </button>
        </div>
      </div>

      {/* ---------- Relatório (é o que sai na impressão) ---------- */}
      <section ref={relatorioRef} aria-labelledby="relatorio-titulo" className="mt-9 scroll-mt-20 print:mt-0">
        <h2 id="relatorio-titulo" className="mb-3 font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl print:text-xl">
          Relatório total das comissões
        </h2>
        <pre
          data-testid="relatorio"
          className="whitespace-pre-wrap break-words rounded-xl border border-line-active bg-surface p-4 font-mono text-[13px] leading-relaxed text-ink sm:p-6 sm:text-sm print:border-0 print:p-0 print:text-[12px]"
        >
          {relatorio}
        </pre>
      </section>
    </>
  );
}
