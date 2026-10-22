"use client";

import { Fragment, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Taxas Stone (Pagar.me) — e-Commerce, cartão de crédito.
// Fonte: demonstrativo "Taxas e prazos das suas transações", emitido em 22/10/2026 às 18:11.
// Recebimento em 2 dias corridos, com antecipação automática. As cinco bandeiras
// (Visa, Mastercard, Elo, Amex e Hipercard) têm a MESMA tabela. Os valores são percentuais
// PARA CADA quantidade de parcelas: não se multiplica pelo número de parcelas.
const STONE_CREDIT_RATES: Record<number, number> = {
  1: 3.45,
  2: 4.89,
  3: 5.84,
  4: 6.79,
  5: 7.74,
  6: 8.69,
  7: 9.9,
  8: 10.85,
  9: 11.8,
  10: 12.75,
  11: 13.7,
  12: 14.65,
  13: 15.6,
  14: 16.55,
  15: 17.5,
  16: 18.45,
  17: 19.4,
  18: 20.35,
};

const PROCESSING_COST = 0.3; // R$ por transação aprovada (crédito, boleto e Pix)
const ANTIFRAUD_COST = 0.2; // R$ por transação de crédito (só cartão)
const BOLETO_FIXED_COST = 2.39; // R$ fixo por boleto
const PIX_RATE = 0.85; // % sobre o valor no Pix

// Juros mensal automático, conforme o valor do produto. O vendedor pode editar o juros por
// cima (negociação especial); o automático só volta se ele clicar em "Voltar ao automático".
const RATE_TIERS = [
  { below: 1000, rate: 2.1, label: "abaixo de R$ 1.000" },
  { below: 2000, rate: 2.0, label: "de R$ 1.000 a R$ 1.999,99" },
  { below: Infinity, rate: 1.9, label: "a partir de R$ 2.000" },
];

function autoTierFor(price: number) {
  return RATE_TIERS.find((tier) => price < tier.below) ?? RATE_TIERS[RATE_TIERS.length - 1];
}

const fmtRate = (value: number) => value.toFixed(2).replace(".", ",");

const MIN_RATE_WARNING = 1.70;
const MAX_RATE_SUGGESTION = 2.50;

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2).replace(".", ",")}%`;
}

interface InstallmentRow {
  label: string;
  installments: number | null;
  customerPerInstallment: number;
  customerTotal: number;
  interestTransferred: number;
  sellerReceives: number;
  stoneRate: number | null;
  profitLossPct: number;
}

function calcRows(price: number, interestRate: number): InstallmentRow[] {
  const rows: InstallmentRow[] = [];

  // Credit card installments 1x–18x
  for (let n = 1; n <= 18; n++) {
    let customerTotal: number;
    let customerPerInstallment: number;

    if (n === 1) {
      customerTotal = price;
      customerPerInstallment = price;
    } else {
      // Simple interest formula: total = price * (1 + rate * n)
      customerTotal = price * (1 + (interestRate / 100) * n);
      customerPerInstallment = customerTotal / n;
    }

    const interestTransferred = customerTotal - price;
    const rate = STONE_CREDIT_RATES[n];
    const sellerReceives =
      customerTotal * (1 - rate / 100) - PROCESSING_COST - ANTIFRAUD_COST;
    const profitLossPct = ((sellerReceives - price) / price) * 100;

    rows.push({
      label: `${n}x`,
      installments: n,
      customerPerInstallment,
      customerTotal,
      interestTransferred,
      sellerReceives,
      stoneRate: rate,
      profitLossPct,
    });
  }

  // Boleto
  const boletoTotal = price;
  const boletoReceived = price - BOLETO_FIXED_COST - PROCESSING_COST;
  rows.push({
    label: "Boleto",
    installments: null,
    customerPerInstallment: boletoTotal,
    customerTotal: boletoTotal,
    interestTransferred: 0,
    sellerReceives: boletoReceived,
    stoneRate: null,
    profitLossPct: ((boletoReceived - price) / price) * 100,
  });

  // Pix
  const pixTotal = price;
  const pixReceived = price * (1 - PIX_RATE / 100) - PROCESSING_COST;
  rows.push({
    label: "Pix",
    installments: null,
    customerPerInstallment: pixTotal,
    customerTotal: pixTotal,
    interestTransferred: 0,
    sellerReceives: pixReceived,
    stoneRate: PIX_RATE,
    profitLossPct: ((pixReceived - price) / price) * 100,
  });

  return rows;
}

export default function CalculadoraStone() {
  const [priceInput, setPriceInput] = useLocalStorage("calc_price", "897,00");
  // null = juros automático pela faixa; texto = juros editado pelo vendedor
  const [manualRate, setManualRate] = useLocalStorage<string | null>("calc_rate_manual", null);

  const price = useMemo(() => {
    const cleaned = priceInput.replace(/\./g, "").replace(",", ".");
    const val = parseFloat(cleaned);
    return isNaN(val) || val <= 0 ? 0 : val;
  }, [priceInput]);

  const autoTier = autoTierFor(price);
  const isManualRate = manualRate !== null;
  const rateInput = isManualRate ? manualRate : fmtRate(autoTier.rate);

  const parsedRate = parseFloat(rateInput.replace(",", "."));
  const interestRate = isNaN(parsedRate) || parsedRate < 0 ? 0 : parsedRate;

  const rows = useMemo(
    () => (price > 0 ? calcRows(price, interestRate) : []),
    [price, interestRate]
  );

  const rateWarning =
    interestRate > 0 && interestRate < MIN_RATE_WARNING;
  const rateOk =
    interestRate >= MIN_RATE_WARNING && interestRate <= MAX_RATE_SUGGESTION;
  const rateHigh = interestRate > MAX_RATE_SUGGESTION;

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPriceInput(e.target.value);
  }

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setManualRate(e.target.value);
  }

  function resetToAutoRate() {
    setManualRate(null);
  }

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-surface rounded-xl shadow-none border border-line p-6">
        <h2 className="text-base font-semibold text-ink mb-4">
          Parâmetros da simulação
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Valor do produto (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm font-medium">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={priceInput}
                onChange={handlePriceChange}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-2.5 border border-gold/60 bg-gold/10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-light focus:border-transparent transition"
              />
            </div>
            <p className="text-xs text-ink-muted mt-1">
              Preço que o cliente vê no checkout
            </p>
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Taxa de juros mensal (%)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={rateInput}
                onChange={handleRateChange}
                placeholder="2,10"
                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  rateWarning
                    ? "border-red-500/40 bg-red-500/10 focus:ring-red-400"
                    : "border-gold/60 bg-gold/10 focus:ring-gold-light"
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted text-sm font-medium">
                %
              </span>
            </div>

            {/* Origem do juros: automático pela faixa ou editado pelo vendedor */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              {isManualRate ? (
                <>
                  <span className="rounded bg-gold/15 px-1.5 py-0.5 font-semibold text-gold-pale">
                    Editado manualmente
                  </span>
                  <span className="text-ink-muted">
                    Automático seria {fmtRate(autoTier.rate)}% ({autoTier.label})
                  </span>
                  <button
                    type="button"
                    onClick={resetToAutoRate}
                    className="font-semibold text-gold-light underline underline-offset-2 hover:text-gold-pale"
                  >
                    Voltar ao automático
                  </button>
                </>
              ) : (
                <span className="text-ink-muted">
                  <span className="font-semibold text-gold-light">Automático</span> pela faixa do valor (
                  {autoTier.label}): {fmtRate(autoTier.rate)}% — você pode editar o campo
                </span>
              )}
            </div>

            {/* Rate feedback */}
            {rateWarning && (
              <div className="flex items-start gap-2 mt-2 p-2.5 bg-red-500/10 border border-red-500/40 rounded-lg">
                <svg
                  className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-red-400">
                    Taxa muito baixa!
                  </p>
                  <p className="text-xs text-red-400">
                    Abaixo de {MIN_RATE_WARNING.toFixed(2).replace(".", ",")}%
                    pode resultar em prejuízo nas vendas parceladas. Sugerimos
                    entre{" "}
                    <strong>
                      {MIN_RATE_WARNING.toFixed(2).replace(".", ",")}%
                    </strong>{" "}
                    e{" "}
                    <strong>
                      {MAX_RATE_SUGGESTION.toFixed(2).replace(".", ",")}%
                    </strong>
                    .
                  </p>
                </div>
              </div>
            )}
            {rateOk && (
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Taxa dentro da faixa recomendada (1,70% – 2,50%)
              </p>
            )}
            {rateHigh && (
              <p className="text-xs text-gold-light mt-1 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Taxa acima do sugerido — verifique se o cliente aceitará
              </p>
            )}
            {!rateWarning && !rateOk && !rateHigh && (
              <p className="text-xs text-ink-muted mt-1">
                Sugestão: entre 1,70% e 2,50% ao mês
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results table */}
      {price > 0 ? (
        <div className="bg-surface rounded-xl shadow-none border border-line overflow-hidden">
          <div className="px-6 py-4 border-b border-line">
            <h2 className="text-base font-semibold text-ink">
              Simulação de venda —{" "}
              <span className="text-emerald-400">{fmt(price)}</span>
            </h2>
            <p className="text-xs text-ink-soft mt-0.5">
              Taxas Stone (recebimento em 2 dias corridos) · Processamento R$ 0,30 ·
              Antifraude R$ 0,20 no crédito · Taxa de juros {rateInput.replace(".", ",")}% a.m.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-2 text-xs font-semibold text-ink-soft uppercase tracking-wide">
                  <th className="text-left px-4 py-3 w-16">Parcelas</th>
                  <th className="text-right px-4 py-3">
                    Valor por parcela
                    <span className="block font-normal normal-case text-ink-muted">
                      cliente paga
                    </span>
                  </th>
                  <th className="text-right px-4 py-3">
                    Total do cliente
                  </th>
                  <th className="text-right px-4 py-3">
                    Juros repassados
                  </th>
                  <th className="text-right px-4 py-3">
                    Taxa Stone
                  </th>
                  <th className="text-right px-4 py-3">
                    Você recebe
                    <span className="block font-normal normal-case text-ink-muted">
                      líquido
                    </span>
                  </th>
                  <th className="text-right px-4 py-3 pr-5">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row, idx) => {
                  const isPositive = row.profitLossPct > 0.05;
                  const isNegative = row.profitLossPct < -0.05;
                  const isSeparator =
                    row.label === "Boleto";

                  return (
                    <Fragment key={row.label}>
                      {isSeparator && (
                        <tr key={`sep-${idx}`}>
                          <td
                            colSpan={7}
                            className="px-4 py-2 bg-surface-2 text-xs text-ink-muted font-medium"
                          >
                            Outros métodos de pagamento
                          </td>
                        </tr>
                      )}
                      <tr
                        className={`transition-colors hover:bg-surface-3 ${
                          isPositive ? "bg-emerald-500/10/30" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-ink">
                          {row.label}
                        </td>
                        <td className="px-4 py-3 text-right text-ink">
                          {fmt(row.customerPerInstallment)}
                        </td>
                        <td className="px-4 py-3 text-right text-ink">
                          {fmt(row.customerTotal)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {row.interestTransferred > 0 ? (
                            <span className="text-sky-400 font-medium">
                              {fmt(row.interestTransferred)}
                            </span>
                          ) : (
                            <span className="text-ink-muted">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-ink-soft">
                          {row.stoneRate !== null ? (
                            row.label === "Pix" ? (
                              `${PIX_RATE.toFixed(2).replace(".", ",")}%`
                            ) : row.label === "Boleto" ? (
                              `R$ ${BOLETO_FIXED_COST.toFixed(2).replace(".", ",")}`
                            ) : (
                              `${row.stoneRate.toFixed(2).replace(".", ",")}%`
                            )
                          ) : (
                            `R$ ${BOLETO_FIXED_COST.toFixed(2).replace(".", ",")}`
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-ink">
                          {fmt(row.sellerReceives)}
                        </td>
                        <td className="px-4 py-3 pr-5 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                              isPositive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : isNegative
                                ? "bg-red-500/10 text-red-400"
                                : "bg-surface-3 text-ink-soft"
                            }`}
                          >
                            {fmtPct(row.profitLossPct)}
                          </span>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-6 py-3 bg-surface-2 border-t border-line flex flex-wrap gap-4 text-xs text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500/10 border border-emerald-500/30 inline-block" />
              Resultado positivo (você recebe mais que o preço original)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-500/10 border border-red-500/40 inline-block" />
              Resultado negativo (você recebe menos que o preço original)
            </span>
            <span className="text-ink-muted">
              * &ldquo;Resultado&rdquo; = diferença entre o líquido recebido e o
              preço original
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-xl shadow-none border border-line p-12 text-center">
          <div className="w-16 h-16 bg-surface-3 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-ink-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-ink-muted text-sm">
            Preencha o valor do produto para ver a simulação
          </p>
        </div>
      )}

      {/* Fee breakdown info */}
      {price > 0 && (
        <div className="bg-surface rounded-xl shadow-none border border-line p-5">
          <h3 className="text-sm font-semibold text-ink mb-3">
            Custos do meio de pagamento (Stone)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoCard
              label="Processamento"
              value="R$ 0,30"
              sub="por transação aprovada"
            />
            <InfoCard
              label="Antifraude"
              value="R$ 0,20"
              sub="por transação de crédito"
            />
            <InfoCard
              label="Boleto bancário"
              value="R$ 2,39"
              sub="taxa fixa por emissão"
            />
            <InfoCard
              label="Pix"
              value="0,85%"
              sub="sobre o valor da transação"
            />

          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 border ${
        highlight
          ? "bg-gold/10 border-gold/40"
          : "bg-surface-2 border-line"
      }`}
    >
      <p
        className={`text-xs font-medium mb-1 ${
          highlight ? "text-gold-light" : "text-ink-soft"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-lg font-bold ${
          highlight ? "text-gold-light" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p
        className={`text-xs mt-0.5 ${
          highlight ? "text-gold-light" : "text-ink-muted"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}
