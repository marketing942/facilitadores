"use client";

import { useState } from "react";
import { ExternalLink, Printer, TriangleAlert } from "lucide-react";

// Duas calculadoras separadas, com fórmulas diferentes, que NÃO se somam:
//  · Multa rescisória: multa a pagar = total do contrato × percentual informado.
//  · Orçamento de cancelamento: restituição estimada = valor pago − 10% do valor pago − 20% do valor do plano.
// Regras vindas do dossiê do Notion, sem validação jurídica. Datas e duração são informativas.

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dec2 = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

/** "1.234,56" → 1234.56 (igual ao HTML original). */
function numero(v: string) {
  let t = v.trim().replace(/[^0-9,.-]/g, "");
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  return Number(t) || 0;
}
const naoNegativo = (v: string) => Math.max(0, numero(v));
const pct = (n: number) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
const dataBR = (v: string) => (v ? new Date(`${v}T12:00:00`).toLocaleDateString("pt-BR") : "—");
const hoje = () => new Date().toLocaleDateString("en-CA");

const inputClass =
  "w-full rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-base font-medium text-ink placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gold-light sm:text-sm";

function Field({ label, hint, children, full }: { label: string; hint?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label} {hint && <span className="font-normal text-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Prefixed({ prefix, suffix, children }: { prefix?: string; suffix?: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      {prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">{prefix}</span>}
      <div className={prefix ? "[&_input]:pl-10" : suffix ? "[&_input]:pr-9" : ""}>{children}</div>
      {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">{suffix}</span>}
    </div>
  );
}

function Actions({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button type="button" onClick={onClear} className="ghost-button ui-label inline-flex min-h-11 items-center rounded-md px-4">
        <span className="text-xs">Limpar</span>
      </button>
      <button type="button" onClick={() => window.print()} className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
        <Printer className="h-4 w-4" />
        <span className="text-xs">Imprimir / Salvar PDF</span>
      </button>
    </div>
  );
}

/* ───────────────────────── Multa rescisória ───────────────────────── */

type Multa = {
  aluno: string; plano: string; inicio: string; termino: string;
  mensalidade: string; meses: string; total: string; percentual: string; dataCalculo: string;
};
const multaVazia = (): Multa => ({
  aluno: "", plano: "", inicio: "", termino: "", mensalidade: "", meses: "", total: "", percentual: "", dataCalculo: hoje(),
});

function MultaRescisoria() {
  const [f, setF] = useState<Multa>(multaVazia);
  const set = (patch: Partial<Multa>) => setF((cur) => ({ ...cur, ...patch }));

  // Alterar mensalidade ou meses recalcula o total; o total também pode ser digitado.
  function recalcularTotal(patch: Partial<Multa>) {
    const next = { ...f, ...patch };
    const total = numero(next.mensalidade) * numero(next.meses);
    set({ ...patch, total: total.toLocaleString("pt-BR", dec2) });
  }
  const formatarAoSair = (campo: "mensalidade" | "total" | "percentual") => () => {
    const n = numero(f[campo]);
    set({ [campo]: n ? n.toLocaleString("pt-BR", dec2) : "" } as Partial<Multa>);
  };

  const contrato = numero(f.total);
  const percentual = numero(f.percentual);
  const multa = (contrato * percentual) / 100;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-sm text-soft">Preencha os dados. Os totais são calculados automaticamente.</p>
        <Actions onClear={() => setF(multaVazia())} />
      </div>

      <div className="hidden print:block">
        <h2 className="font-display text-2xl font-bold">Calculadora de Multa Rescisória</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface p-4 sm:p-5">
          <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-tight text-ink">Dados do contrato</h2>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field label="Aluno(a)" full>
              <input className={inputClass} autoComplete="name" value={f.aluno} onChange={(e) => set({ aluno: e.target.value })} />
            </Field>
            <Field label="Plano contratado" full>
              <input className={inputClass} value={f.plano} onChange={(e) => set({ plano: e.target.value })} />
            </Field>
            <Field label="Data de início">
              <input type="date" className={inputClass} value={f.inicio} onChange={(e) => set({ inicio: e.target.value })} />
            </Field>
            <Field label="Data de término">
              <input type="date" className={inputClass} value={f.termino} onChange={(e) => set({ termino: e.target.value })} />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-surface p-4 sm:p-5">
          <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-tight text-ink">Valores do contrato</h2>
          <div className="space-y-3.5">
            <Field label="Valor mensal da mensalidade">
              <Prefixed prefix="R$">
                <input
                  className={inputClass} inputMode="decimal" placeholder="0,00" value={f.mensalidade}
                  onChange={(e) => recalcularTotal({ mensalidade: e.target.value })}
                  onBlur={formatarAoSair("mensalidade")}
                />
              </Prefixed>
            </Field>
            <Field label="Quantidade de meses contratados">
              <input
                className={inputClass} type="number" inputMode="numeric" min={0} step={1} placeholder="0" value={f.meses}
                onChange={(e) => recalcularTotal({ meses: e.target.value })}
              />
            </Field>
            <Field label="Valor total do contrato" hint="calculado automaticamente, mas pode ser editado">
              <Prefixed prefix="R$">
                <input
                  className={inputClass} inputMode="decimal" placeholder="0,00" value={f.total}
                  onChange={(e) => set({ total: e.target.value })} onBlur={formatarAoSair("total")}
                />
              </Prefixed>
            </Field>
            <Field label="Percentual de multa previsto">
              <Prefixed suffix="%">
                <input
                  className={inputClass} inputMode="decimal" placeholder="0" value={f.percentual}
                  onChange={(e) => set({ percentual: e.target.value })} onBlur={formatarAoSair("percentual")}
                />
              </Prefixed>
            </Field>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-line-active bg-gold/5 p-4 sm:p-5">
        <h2 className="mb-3 font-display text-lg font-bold uppercase tracking-tight text-ink">Cálculo da multa</h2>
        <p className="font-display text-lg font-bold text-gold-pale sm:text-xl">
          {brl.format(contrato)} × {pct(percentual)} = {brl.format(multa)}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Valor total do contrato", brl.format(contrato)],
            ["Percentual aplicado", pct(percentual)],
            ["Multa rescisória", brl.format(multa)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-surface p-3">
              <p className="text-xs text-muted">{label}</p>
              <p className="mt-0.5 font-display text-lg font-bold text-ink">{value}</p>
            </div>
          ))}
        </div>
        <dl className="mt-4 hidden gap-x-6 gap-y-1 text-sm print:grid sm:grid-cols-2">
          {[
            ["Aluno(a)", f.aluno || "Não informado"],
            ["Plano", f.plano || "Não informado"],
            ["Início", dataBR(f.inicio)],
            ["Término", dataBR(f.termino)],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="text-muted">{k}:</dt>
              <dd className="font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,320px)_1fr] sm:items-center">
        <Field label="Data do cálculo">
          <input type="date" className={inputClass} value={f.dataCalculo} onChange={(e) => set({ dataCalculo: e.target.value })} />
        </Field>
        <p className="text-xs text-muted print:hidden">
          As datas são informativas e não entram na fórmula. Não há cálculo proporcional por meses restantes nem inclusão
          automática de mensalidades vencidas.
        </p>
      </div>

      <section aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line-active bg-surface p-4 sm:p-5">
        <div>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink">Total a pagar referente à rescisão</h2>
          <p className="text-xs text-muted">Valor da multa rescisória</p>
        </div>
        <p className="font-display text-3xl font-extrabold text-gold-pale">{brl.format(multa)}</p>
      </section>
    </div>
  );
}

/* ───────────────────── Orçamento de cancelamento ───────────────────── */

type Orcamento = { aluno: string; cpf: string; duracao: string; matricula: string; cancelamento: string; pago: string; plano: string };
const orcamentoVazio = (): Orcamento => ({ aluno: "", cpf: "", duracao: "", matricula: "", cancelamento: "", pago: "", plano: "" });

// Percentuais fixos do orçamento (somente leitura, como no original).
const DESCONTO_PCT = 10;
const MULTA_PCT = 20;

/** Máscara de CPF. Não valida os dígitos verificadores. */
function mascaraCpf(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function OrcamentoCancelamento() {
  const [f, setF] = useState<Orcamento>(orcamentoVazio);
  const set = (patch: Partial<Orcamento>) => setF((cur) => ({ ...cur, ...patch }));

  const pago = naoNegativo(f.pago);
  const plano = naoNegativo(f.plano);
  const desconto = (pago * DESCONTO_PCT) / 100;
  const multa = (plano * MULTA_PCT) / 100;
  const total = desconto + multa;
  const liquido = pago - total;

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">
      <section className="rounded-xl border border-line bg-surface p-4 sm:p-5 print:hidden">
        <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-tight text-ink">Dados do orçamento</h2>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label="Aluno" full>
            <input className={inputClass} placeholder="Nome completo" value={f.aluno} onChange={(e) => set({ aluno: e.target.value })} />
          </Field>
          <Field label="CPF">
            <input className={inputClass} inputMode="numeric" placeholder="000.000.000-00" value={f.cpf} onChange={(e) => set({ cpf: mascaraCpf(e.target.value) })} />
          </Field>
          <Field label="Duração do curso" hint="(meses)">
            <input className={inputClass} type="number" min={1} step={1} placeholder="Ex.: 6" value={f.duracao} onChange={(e) => set({ duracao: e.target.value })} />
          </Field>
          <Field label="Data da matrícula">
            <input type="date" className={inputClass} value={f.matricula} onChange={(e) => set({ matricula: e.target.value })} />
          </Field>
          <Field label="Solicitação de cancelamento">
            <input type="date" className={inputClass} value={f.cancelamento} onChange={(e) => set({ cancelamento: e.target.value })} />
          </Field>
          <Field label="Valor pago">
            <Prefixed prefix="R$">
              <input className={inputClass} inputMode="decimal" placeholder="0,00" value={f.pago} onChange={(e) => set({ pago: e.target.value })} />
            </Prefixed>
          </Field>
          <Field label="Valor total do plano">
            <Prefixed prefix="R$">
              <input className={inputClass} inputMode="decimal" placeholder="0,00" value={f.plano} onChange={(e) => set({ plano: e.target.value })} />
            </Prefixed>
          </Field>
          <Field label="Desconto antecipado">
            <Prefixed suffix="%">
              <input className={`${inputClass} cursor-not-allowed !border-gold/40 !bg-gold/10 font-bold !text-gold-pale`} value={DESCONTO_PCT} readOnly aria-readonly="true" />
            </Prefixed>
          </Field>
          <Field label="Multa contratual">
            <Prefixed suffix="%">
              <input className={`${inputClass} cursor-not-allowed !border-gold/40 !bg-gold/10 font-bold !text-gold-pale`} value={MULTA_PCT} readOnly aria-readonly="true" />
            </Prefixed>
          </Field>
        </div>
        <div className="mt-4">
          <Actions onClear={() => setF(orcamentoVazio())} />
          <p className="mt-2 text-xs text-muted">Para salvar, escolha “Salvar como PDF” na janela de impressão.</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-line bg-surface" aria-labelledby="demonstrativo">
        <div className="flex items-center justify-between border-b border-line px-4 py-3.5 sm:px-5">
          <h2 id="demonstrativo" className="font-display text-lg font-bold uppercase tracking-tight text-ink">
            Demonstrativo financeiro
          </h2>
          <span className="ui-label rounded-md border border-line-active bg-gold/10 px-2.5 py-1 text-[10px] text-gold-light">Estimativa</span>
        </div>

        <div className="p-4 sm:p-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-line pb-4">
            {[
              ["Aluno", f.aluno.trim() || "Não informado"],
              ["CPF", f.cpf.trim() || "Não informado"],
              ["Matrícula", dataBR(f.matricula)],
              ["Cancelamento solicitado", dataBR(f.cancelamento)],
              ["Duração do curso", f.duracao ? `${f.duracao} meses` : "—"],
              ["Valor total do plano", brl.format(plano)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="break-words text-sm font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-1.5 py-4 text-sm tabular-nums">
            <div className="flex justify-between gap-4"><span>Valor pago</span><span>{brl.format(pago)}</span></div>
            <div className="flex justify-between gap-4"><span>Desconto antecipado ({pct(DESCONTO_PCT)})</span><span>− {brl.format(desconto)}</span></div>
            <div className="flex justify-between gap-4"><span>Multa contratual ({pct(MULTA_PCT)})</span><span>− {brl.format(multa)}</span></div>
            <div className="mt-2 flex justify-between gap-4 border-t border-line pt-3 font-bold"><span>Total de descontos e multas</span><span>− {brl.format(total)}</span></div>
          </div>

          <div className={`rounded-xl border p-4 text-center ${liquido < 0 ? "border-danger/50 bg-danger/10" : "border-line-active bg-gold/10"}`}>
            <p className="ui-label text-[11px] text-gold-light">Valor líquido estimado para restituição</p>
            <p className={`mt-1 font-display text-3xl font-extrabold ${liquido < 0 ? "text-danger" : "text-gold-pale"}`}>{brl.format(liquido)}</p>
          </div>

          {liquido < 0 && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-sm font-bold text-danger">
              <TriangleAlert className="mt-0.5 h-4 w-4 flex-none" />
              A restituição calculada é negativa. Revise os valores e percentuais.
            </p>
          )}
          <p className="mt-3 text-xs text-muted">
            Critérios: {pct(DESCONTO_PCT)} sobre o valor pago e {pct(MULTA_PCT)} sobre o valor total do plano.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────── Modelo de demonstrativo ───────────────────── */

const Linha = ({ children }: { children: React.ReactNode }) => <p className="mt-3">{children}</p>;

function ModeloDemonstrativo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="max-w-2xl text-sm text-soft">
          Modelo para preencher e enviar. Imprima ou salve em PDF e complete à mão. O arquivo Word original
          (Modelo_Demonstrativo_Multa_Rescisoria.docx) não está hospedado aqui.
        </p>
        <button type="button" onClick={() => window.print()} className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4">
          <Printer className="h-4 w-4" />
          <span className="text-xs">Imprimir modelo</span>
        </button>
      </div>

      <article className="rounded-xl border border-line bg-surface p-5 text-sm leading-relaxed text-ink sm:p-8">
        <h2 className="text-center font-display text-xl font-bold uppercase tracking-tight">Demonstrativo de multa rescisória</h2>

        <div className="mt-6">
          <Linha>Aluno(a): ___________________________________________</Linha>
          <Linha>Plano contratado: ___________________________________</Linha>
          <Linha>Modalidade do plano: ( ) Mensal &nbsp; ( ) Anual</Linha>
          <Linha>Valor da mensalidade: R$ ___________________________</Linha>
          <Linha>Valor total do plano contratado: R$ __________________</Linha>
          <Linha>Data de início do contrato: ____/____/________</Linha>
          <Linha>Data de início das aulas: ____/____/________</Linha>
          <Linha>Data da solicitação de cancelamento: ____/____/________</Linha>
        </div>

        <h3 className="mt-8 font-display text-base font-bold uppercase">Cálculo da rescisão</h3>
        <Linha>
          Conforme previsto na Cláusula Sétima – Rescisão do contrato de prestação de serviços educacionais, para
          cancelamentos realizados após o início das aulas em planos anuais, aplica-se multa rescisória de 20% sobre o
          valor total do plano contratado.
        </Linha>
        <Linha>Cálculo da multa rescisória:</Linha>
        <Linha>20% de R$ __________________ = R$ __________________</Linha>
        <Linha>Valor da multa rescisória:</Linha>
        <Linha>R$ __________________</Linha>

        <h3 className="mt-8 font-display text-base font-bold uppercase">Observações</h3>
        <Linha>
          O período de aulas já iniciado será considerado como utilizado pelo(a) aluno(a), permanecendo devido conforme
          as condições estabelecidas no contrato de prestação de serviços educacionais.
        </Linha>
        <Linha>
          A presente demonstração tem como finalidade apresentar o cálculo referente à rescisão contratual conforme
          cláusulas previstas no contrato firmado entre as partes.
        </Linha>

        <Linha>Data de emissão: ____/____/________</Linha>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <p className="border-t border-ink/60 pt-2 text-center">Responsável pela instituição</p>
          <p className="border-t border-ink/60 pt-2 text-center">Aluno(a) ou responsável contratual</p>
        </div>
      </article>
    </div>
  );
}

/* ───────────────────── Sistemas e tutoriais ───────────────────── */

const SISTEMAS = [
  { nome: "Asaas — conferir boletos", url: "https://www.asaas.com/payment/list" },
  { nome: "Conta Azul — lançar pagamentos", url: "https://pro.contaazul.com/#/ca/vendas/produtos" },
];
const TUTORIAIS = [
  { nome: "Tutorial do Conta Azul", url: "https://drive.google.com/file/d/1GQXz3QYa4raVbo-pGPu9wi9POWPF9nAo/view?usp=sharing" },
  { nome: "Tutorial do Asaas", url: "https://youtube.com/watch?v=vWtZgwETXEE&feature=youtu.be" },
];

function LinkList({ titulo, itens }: { titulo: string; itens: { nome: string; url: string }[] }) {
  return (
    <section>
      <h2 className="eyebrow mb-3">{titulo}</h2>
      <ul className="space-y-2.5">
        {itens.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener"
              className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition hover:border-line-active hover:bg-surface-2"
            >
              {item.nome}
              <ExternalLink className="h-4 w-4 flex-none text-gold-light" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SistemasTutoriais() {
  return (
    <div className="space-y-6">
      <p role="note" className="flex items-start gap-3 rounded-xl border border-yellow-400/50 bg-yellow-400/10 px-4 py-3 text-sm text-ink">
        <TriangleAlert className="mt-0.5 h-5 w-5 flex-none text-yellow-300" />
        <span>
          No Conta Azul, sempre lançar o pagamento como <strong>Diretoria</strong>.
        </span>
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <LinkList titulo="Sistemas" itens={SISTEMAS} />
        <LinkList titulo="Tutoriais" itens={TUTORIAIS} />
      </div>
    </div>
  );
}

/* ───────────────────────────── Página ───────────────────────────── */

const ABAS = [
  { id: "multa", label: "Multa rescisória", short: "Multa" },
  { id: "orcamento", label: "Orçamento / restituição", short: "Restituição" },
  { id: "modelo", label: "Modelo de demonstrativo", short: "Modelo" },
  { id: "sistemas", label: "Sistemas e tutoriais", short: "Sistemas" },
] as const;
type AbaId = (typeof ABAS)[number]["id"];

export default function CalculadoraCancelamento() {
  const [aba, setAba] = useState<AbaId>("multa");

  return (
    <>
      <div role="tablist" aria-label="Seções" className="mb-5 grid grid-cols-2 gap-2 sm:flex print:hidden">
        {ABAS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`aba-${item.id}`}
            aria-selected={aba === item.id}
            aria-controls="painel"
            onClick={() => setAba(item.id)}
            className={`min-h-11 rounded-md border px-3 transition-colors sm:px-4 ${
              aba === item.id ? "border-gold-light bg-gold/25 text-gold-pale" : "border-gold/35 bg-gold/10 text-gold-light hover:bg-gold/20"
            }`}
          >
            <span className="ui-label text-xs">
              <span className="sm:hidden">{item.short}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </span>
          </button>
        ))}
      </div>

      <div id="painel" role="tabpanel" aria-labelledby={`aba-${aba}`}>
        {/* As quatro seções ficam montadas: trocar de aba não apaga o que já foi digitado. */}
        <div hidden={aba !== "multa"}><MultaRescisoria /></div>
        <div hidden={aba !== "orcamento"}><OrcamentoCancelamento /></div>
        <div hidden={aba !== "modelo"}><ModeloDemonstrativo /></div>
        <div hidden={aba !== "sistemas"}><SistemasTutoriais /></div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted print:hidden">
        A multa rescisória e a restituição estimada são cálculos separados e não se somam. O percentual da multa é
        informado por quem opera; a calculadora não confere se o cancelamento se enquadra na regra do contrato (por
        exemplo, plano anual após o início das aulas). Estimativa de apoio, sem validação jurídica.
      </p>
    </>
  );
}
