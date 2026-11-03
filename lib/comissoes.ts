// Cálculos e texto do relatório da Calculadora de Comissões. Sem React: só funções puras, fáceis de testar.
// Todo dinheiro aqui é em CENTAVOS (número inteiro).

import { REGRAS } from "@/config/comissoes";

/* ---------- Tipos: o que a pessoa digita (sempre texto) ---------- */

export type ColabPercentual = { id: string; nome: string; vendido: string; percentual: string };
export type ColabColegio = { id: string; nome: string; matriculas: string };
export type ColabSuporte = { id: string; nome: string; alunos: string; valorAluno: string };

export type Estado = {
  periodo: string;
  cppem: ColabPercentual[];
  colegio: ColabColegio[];
  suporte: ColabSuporte[];
  unicive: ColabPercentual[];
};

/* ---------- Leitura e formatação ---------- */

/** "33.102,55" → 3310255 (centavos). Aceita "33102,55", "33102.55" e "R$ 1.000". */
export function paraCentavos(texto: string): number {
  let t = texto.trim().replace(/[^0-9,.-]/g, "");
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  else if (/\.\d{3}(\.|$)/.test(t)) t = t.replace(/\./g, ""); // "1.000" = mil
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
}

/** "3", "3,5" ou "3.5" → 3.5 (percentual). */
export function paraPercentual(texto: string): number {
  const n = Number(texto.trim().replace(/[^0-9,.]/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** "27" → 27. Só inteiros, nunca negativos. */
export function paraInteiro(texto: string): number {
  const n = Math.floor(Number(texto.trim().replace(/[^0-9]/g, "")));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
/** 99308 → "R$ 993,08" (o espaço é um espaço comum, para colar bem no WhatsApp). */
export const formatarReais = (centavos: number) => brl.format(centavos / 100).replace(/\s/g, " ");
export const formatarPercentual = (p: number) => `${p.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

/* ---------- Cálculos ---------- */

/** vendido × percentual / 100, arredondado ao centavo. */
export function comissaoPercentual(vendidoCentavos: number, percentual: number): number {
  return Math.round((vendidoCentavos * percentual) / 100);
}

export function calcularColegio(matriculas: number) {
  const { porMatriculaCentavos, bonusCentavos, matriculasPorBonus } = REGRAS.colegio;
  const valorMatriculas = matriculas * porMatriculaCentavos;
  const bonus = Math.floor(matriculas / matriculasPorBonus); // só grupos completos
  const valorBonus = bonus * bonusCentavos;
  return { valorMatriculas, bonus, valorBonus, total: valorMatriculas + valorBonus };
}

export const calcularSuporte = (alunos: number, valorAlunoCentavos: number) => alunos * valorAlunoCentavos;

/* ---------- Linhas calculadas (a tela e o relatório usam as mesmas) ---------- */

/** Um cartão sem nome e sem valores não entra no relatório. */
const preenchido = (nome: string, ...valores: number[]) => nome.trim() !== "" || valores.some((v) => v > 0);
const nomeDe = (nome: string) => nome.trim() || "(sem nome)";

export function linhasPercentual(lista: ColabPercentual[]) {
  return lista
    .map((c) => {
      const vendido = paraCentavos(c.vendido);
      const percentual = paraPercentual(c.percentual);
      return { id: c.id, nome: nomeDe(c.nome), vendido, percentual, comissao: comissaoPercentual(vendido, percentual), vazio: !preenchido(c.nome, vendido, percentual) };
    })
    .filter((l) => !l.vazio);
}

export function linhasColegio(lista: ColabColegio[]) {
  return lista
    .map((c) => {
      const matriculas = paraInteiro(c.matriculas);
      return { id: c.id, nome: nomeDe(c.nome), matriculas, ...calcularColegio(matriculas), vazio: !preenchido(c.nome, matriculas) };
    })
    .filter((l) => !l.vazio);
}

export function linhasSuporte(lista: ColabSuporte[]) {
  return lista
    .map((c) => {
      const alunos = paraInteiro(c.alunos);
      const valorAluno = c.valorAluno.trim() === "" ? REGRAS.suporte.porAlunoCentavos : paraCentavos(c.valorAluno);
      return { id: c.id, nome: nomeDe(c.nome), alunos, valorAluno, total: calcularSuporte(alunos, valorAluno), vazio: !preenchido(c.nome, alunos) };
    })
    .filter((l) => !l.vazio);
}

/** Total e subtotais, somando os valores já arredondados de cada colaborador (o relatório sempre fecha). */
export function calcularTudo(e: Estado) {
  const cppem = linhasPercentual(e.cppem);
  const colegio = linhasColegio(e.colegio);
  const suporte = linhasSuporte(e.suporte);
  const unicive = linhasPercentual(e.unicive);
  const soma = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const totais = {
    cppem: soma(cppem.map((l) => l.comissao)),
    colegio: soma(colegio.map((l) => l.total)),
    suporte: soma(suporte.map((l) => l.total)),
    unicive: soma(unicive.map((l) => l.comissao)),
  };
  return { cppem, colegio, suporte, unicive, totais, geral: totais.cppem + totais.colegio + totais.suporte + totais.unicive };
}

/* ---------- Texto do relatório ---------- */

export function montarRelatorio(e: Estado): string {
  const t = calcularTudo(e);
  const out: string[] = ["RELATÓRIO DE COMISSÃO", "", `Período: ${e.periodo.trim() || "não informado"}`, ""];

  const bloco = (titulo: string, linhas: string[][]) => {
    if (!linhas.length) return;
    out.push(titulo, "");
    for (const l of linhas) out.push(...l, "");
  };

  bloco(
    "CPPEM",
    t.cppem.map((l) => [`Colaborador: ${l.nome}`, `Valor total vendido: ${formatarReais(l.vendido)}`, `Comissão: ${formatarPercentual(l.percentual)}`, `Valor da comissão: ${formatarReais(l.comissao)}`]),
  );
  bloco(
    "COLÉGIO CPPEM",
    t.colegio.map((l) => [
      `Colaborador: ${l.nome}`,
      `Total de matrículas: ${l.matriculas}`,
      `Comissão por matrícula: ${formatarReais(REGRAS.colegio.porMatriculaCentavos)}`,
      `Valor das matrículas: ${formatarReais(l.valorMatriculas)}`,
      `Bônus: ${l.bonus} × ${formatarReais(REGRAS.colegio.bonusCentavos)} = ${formatarReais(l.valorBonus)}`,
      `Total da comissão: ${formatarReais(l.total)}`,
    ]),
  );
  bloco(
    "SUPORTE — ALUNOS RECUPERADOS",
    t.suporte.map((l) => [`Colaborador: ${l.nome}`, `Total de alunos recuperados: ${l.alunos}`, `Comissão: ${formatarReais(l.valorAluno)} por aluno`, `Valor da comissão: ${formatarReais(l.total)}`]),
  );
  bloco(
    "UNICIVE",
    t.unicive.map((l) => [`Colaborador: ${l.nome}`, `Valor total vendido: ${formatarReais(l.vendido)}`, `Comissão: ${formatarPercentual(l.percentual)}`, `Valor da comissão: ${formatarReais(l.comissao)}`]),
  );

  if (t.cppem.length + t.colegio.length + t.suporte.length + t.unicive.length === 0) out.push("Nenhum colaborador preenchido ainda.", "");
  out.push("---", "", `TOTAL GERAL A PAGAR EM COMISSÕES: ${formatarReais(t.geral)}`);
  return out.join("\n");
}
