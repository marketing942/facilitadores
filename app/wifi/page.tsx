import type { Metadata } from "next";
import QRCode from "qrcode";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { SecretField } from "@/components/secret-field";
import { WIFI_INTERNAS, WIFI_VISITANTES, wifiQrPayload } from "@/config/wifi";

export const metadata: Metadata = {
  title: "Wi-Fi | Utilitários CPPEM",
  description: "Rede e QR Code para visitantes e senhas das redes internas.",
};

export default async function WifiPage() {
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
        <div className="mt-4 space-y-3">
          {WIFI_INTERNAS.map((rede) => (
            <SecretField key={rede.nome} label={`Wi-Fi ${rede.nome}`} value={rede.senha} />
          ))}
        </div>
      </section>
    </main>
  );
}
