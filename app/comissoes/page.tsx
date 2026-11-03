// Aba Comissões (/comissoes, grupo Comercial): calculadora e relatório de comissões. Regras em config/comissoes.ts,
// cálculos em lib/comissoes.ts e a tela em components/CalculadoraComissoes.tsx. Nada é enviado nem guardado: roda só no navegador.
import type { Metadata } from "next";
import CalculadoraComissoes from "@/components/CalculadoraComissoes";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Calculadora de comissões | Utilitários CPPEM",
  description: "Calcule as comissões de CPPEM, Colégio CPPEM, Suporte (alunos recuperados) e Unicive e gere o relatório para pagamento.",
};

export default function ComissoesPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <div className="print:hidden">
        <PageHeader
          crumb="Comissões"
          eyebrow="Comercial · Grupo CPPEM"
          title={<>Calculadora <span className="text-gold-light">de comissões</span></>}
        />
      </div>
      <CalculadoraComissoes />
    </main>
  );
}
