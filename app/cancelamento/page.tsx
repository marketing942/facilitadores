import type { Metadata } from "next";
import CalculadoraCancelamento from "@/components/CalculadoraCancelamento";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Cancelamento e multa rescisória | Utilitários CPPEM",
  description: "Calculadoras de multa rescisória e de orçamento de cancelamento, modelo de demonstrativo, sistemas e tutoriais.",
};

export default function CancelamentoPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <div className="print:hidden">
        <PageHeader
          crumb="Cancelamento"
          eyebrow="Comercial · Grupo CPPEM"
          title={<>Cancelamento <span className="text-gold-light">e multa rescisória</span></>}
        />
      </div>
      <CalculadoraCancelamento />
    </main>
  );
}
