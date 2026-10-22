import Image from "next/image";
import { getCatalog } from "@/lib/catalog";
import LinksExplorer from "./links-explorer";

// A página é estática e se renova a cada 10 minutos (ISR); quem acessa nunca espera a Guru.
export const revalidate = 600;
// Um sync completo leva ~30s (até ~90s se a cota da Guru estiver no fim).
export const maxDuration = 300;

export default async function Page() {
  // Se a Guru estiver fora do ar na hora de gerar a página, a página abre mesmo assim:
  // a próxima renovação (ou o botão "Atualizar agora") busca de novo.
  let items: Awaited<ReturnType<typeof getCatalog>>["items"] = [];
  let lastChangeAt = 0;
  let falhou = false;
  try {
    ({ items, lastChangeAt } = await getCatalog());
  } catch {
    falhou = true;
  }

  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 pb-24 pt-8 sm:px-6">
      <header className="flex items-center gap-4">
        <Image
          src="/brand/emblema-leao.webp"
          alt="CPPEM"
          width={54}
          height={54}
          priority
          className="h-[54px] w-[54px] object-contain"
        />
        <div>
          <p className="eyebrow">Uso interno · Grupo CPPEM</p>
          <h1 className="display-title mt-2">
            Links de <span className="text-gold-light">Pagamento</span>
          </h1>
        </div>
      </header>

      <p className="mt-3 text-sm text-soft">
        Direto do checkout Guru — toda oferta ativa aparece aqui, sem cadastro manual.
      </p>

      {falhou && (
        <p className="mt-6 rounded-lg border border-danger/40 bg-surface px-4 py-3 text-sm text-danger">
          Não consegui falar com a Guru agora. Clique em <strong>Atualizar agora</strong> para tentar de novo.
        </p>
      )}

      <LinksExplorer items={items} lastChangeAt={lastChangeAt} />
    </main>
  );
}
