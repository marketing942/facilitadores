// Redes Wi-Fi. Visitantes: a senha é pública de propósito (vai no QR Code). Internas: a página
// esconde a senha até a pessoa tocar em "Mostrar".

export const WIFI_VISITANTES = {
  nome: "Cppem - 01 Visitantes",
  senha: "CppemWifi@Visitas123",
};

export const WIFI_INTERNAS = [
  { nome: "Cppem 3", senha: "C@#wifi62024" },
  { nome: "Cppem 4", senha: "C@#wifi62024" },
];

/** Texto do QR Code padrão de Wi-Fi (Android e iPhone conectam direto ao escanear). */
export function wifiQrPayload(nome: string, senha: string) {
  const esc = (v: string) => v.replace(/([\;,:"])/g, "\\$1");
  return `WIFI:T:WPA;S:${esc(nome)};P:${esc(senha)};;`;
}
