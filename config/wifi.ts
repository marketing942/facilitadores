// Redes Wi-Fi: os nomes e senhas ficam no banco (settings 'wifi_visitantes' e tabela wifi_redes) e são
// editados em /admin/wifi. Este arquivo só monta o texto do QR Code.

export type WifiVisitantes = { nome: string; senha: string };
export type WifiInterna = { id: string; nome: string; senha: string };

/** Texto do QR Code padrão de Wi-Fi (Android e iPhone conectam direto ao escanear). */
export function wifiQrPayload(nome: string, senha: string) {
  const esc = (v: string) => v.replace(/([\;,:"])/g, "\\$1");
  return `WIFI:T:WPA;S:${esc(nome)};P:${esc(senha)};;`;
}
