import type { Metadata } from "next";
import QRCode from "qrcode";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { SecretField } from "@/components/secret-field";
import { EquipeForm } from "@/components/equipe-form";
import { wifiQrPayload } from "@/config/wifi";
import { hasSession } from "@/lib/auth";
import { getWifiInternas, getWifiVisitantes } from "@/lib/data";

// Aba Wi-Fi (/wifi, grupo Geral): rede de visitantes com QR Code e redes internas com senha oculta. Dados no banco (painel /admin/wifi). As senhas internas só saem do banco com a senha da equipe.
export const metadata: Metadata = {
  title: "Wi-Fi | Utilitários CPPEM",
  description: "Rede e QR Code para visitantes e senhas das redes internas.",
};

export const dynamic = "force-dynamic";

export default async function WifiPage() {
  const WIFI_VISITANTES = await getWifiVisitantes();
  const liberado = await hasSession("equipe");
  const internas = liberado ? await getWifiInternas() : [];
  const qr = await QRCode.toString(wifiQrPayload(WIFI_VISITANTES.nome, WIFI_VISITANTES.senha), {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Wi-Fi" eyebrow="Geral · Grupo CPPEM" title={<>Wi-Fi <span className="text-gold-light">da CPPEM</span></>} />

      <section aria-labelledby="visitantes" className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
        <h2 id="visitantes" className="ui-label text-sm text-gold-light">
          Rede para visitantes
        </h2>

        <div className="mt-4 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="space-y-4">
            <div>
              <p className="ui-label text-[11px] text-muted">Nome da rede</p>
              <p className="mt-1 break-words font-display text-xl font-bold text-ink sm:text-2xl">{WIFI_VISITANTES.nome}</p>
              <CopyButton value={WIFI_VISITANTES.nome} label="Copiar nome" className="mt-2" />
            </div>
            <div>
              <p className="ui-label text-[11px] text-muted">Senha</p>
              <p className="mt-1 break-all font-mono text-lg text-gold-pale sm:text-xl">{WIFI_VISITANTES.senha}</p>
              <CopyButton value={WIFI_VISITANTES.senha} label="Copiar senha" className="mt-2" />
            </div>
          </div>

          <figure className="mx-auto w-full max-w-[260px] sm:mx-0">
            <div
              role="img"
              aria-label={`QR Code para conectar na rede ${WIFI_VISITANTES.nome}`}
              className="rounded-xl bg-white p-4 [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <figcaption className="mt-2 text-center text-xs text-soft">
              Aponte a câmera do celular para se conectar
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="internas" className="mt-6 rounded-2xl border border-line bg-surface p-4 sm:p-6">
        <h2 id="internas" className="ui-label text-sm text-gold-light">
          Redes internas
        </h2>
        <p className="mt-1 text-sm text-soft">Só para a equipe. Não passe estas senhas para visitantes.</p>
        {liberado ? (
          <div className="mt-4 space-y-3">
            {internas.map((rede) => (
              <SecretField key={rede.id} label={`Wi-Fi ${rede.nome}`} value={rede.senha} />
            ))}
            {internas.length === 0 && <p className="text-sm text-muted">Nenhuma rede interna cadastrada.</p>}
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm text-ink-soft">Digite a senha da equipe para ver as senhas das redes internas.</p>
            <EquipeForm />
          </>
        )}
      </section>
    </main>
  );
}
