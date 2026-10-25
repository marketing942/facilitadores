import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { ENDERECO_COMPLETO, EMPRESA, MAPS_URL, TELEFONES } from "@/config/empresa";

export const metadata: Metadata = {
  title: "Dados da empresa | Utilitários CPPEM",
  description: "CNPJ, chave Pix e endereço da CPPEM, prontos para copiar.",
};

function Item({
  label,
  value,
  note,
  children,
}: {
  label: string;
  value: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="min-w-0">
        <p className="ui-label text-[11px] text-gold-light">{label}</p>
        <p className="mt-1.5 break-words font-display text-lg font-bold text-ink sm:text-xl">{value}</p>
        {note && <p className="mt-1 text-xs text-muted">{note}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function EmpresaPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader
        crumb="Dados da empresa"
        eyebrow="Equipe · Grupo CPPEM"
        title={<>Dados da <span className="text-gold-light">empresa</span></>}
      />

      <div className="space-y-3">
        <Item label="CNPJ" value={EMPRESA.cnpj}>
          <CopyButton value={EMPRESA.cnpj} label="Copiar CNPJ" />
        </Item>
        <Item label="Chave Pix (CNPJ)" value={EMPRESA.cnpj} note="Copia só os números, como o app do banco pede.">
          <CopyButton value={EMPRESA.pixCnpj} label="Copiar chave Pix" />
        </Item>
        <Item label="CEP" value={EMPRESA.cep}>
          <CopyButton value={EMPRESA.cep} label="Copiar CEP" />
        </Item>
        <Item label="Endereço completo" value={ENDERECO_COMPLETO}>
          <CopyButton value={ENDERECO_COMPLETO} label="Copiar endereço" />
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener"
            className="ghost-button ui-label inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-xs"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-xs">Abrir no mapa</span>
          </a>
        </Item>
      </div>

      <h2 className="eyebrow mb-3 mt-8">Telefones</h2>
      <div className="space-y-3">
        {TELEFONES.map((tel) => (
          <Item key={tel.nome} label={tel.nome} value={tel.exibicao}>
            <CopyButton value={tel.digitos} label="Copiar número" />
            {tel.whatsapp && (
              <a
                href={`https://wa.me/${tel.whatsapp}`}
                target="_blank"
                rel="noopener"
                className="ghost-button ui-label inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-xs"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-xs">WhatsApp</span>
              </a>
            )}
          </Item>
        ))}
      </div>
    </main>
  );
}
