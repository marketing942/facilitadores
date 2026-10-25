"use client";

import { useState } from "react";
import { LocateFixed, MapPin, Navigation } from "lucide-react";
import { rotaUrl, SELFIT_SITE, type Unidade } from "@/config/academia";

// Botão "Encontrar a Selfit mais perto de mim": usa a localização do navegador e public/selfit-unidades.json.
type Estado =
  | { fase: "parado" }
  | { fase: "buscando" }
  | { fase: "erro"; mensagem: string }
  | { fase: "pronto"; lista: (Unidade & { km: number })[] };

/** Distância em km entre dois pontos (fórmula de Haversine). */
function km(lat1: number, lng1: number, lat2: number, lng2: number) {
  const r = (g: number) => (g * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

const fmtKm = (d: number) => (d < 1 ? `${Math.round(d * 1000)} m` : `${d.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`);

export default function MaisPerto() {
  const [estado, setEstado] = useState<Estado>({ fase: "parado" });

  function buscar() {
    if (!("geolocation" in navigator)) {
      setEstado({ fase: "erro", mensagem: "Este navegador não informa a localização." });
      return;
    }
    setEstado({ fase: "buscando" });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const unidades: Unidade[] = await (await fetch("/selfit-unidades.json")).json();
          const lista = unidades
            .map((u) => ({ ...u, km: km(coords.latitude, coords.longitude, u.lat, u.lng) }))
            .sort((a, b) => a.km - b.km)
            .slice(0, 3);
          setEstado({ fase: "pronto", lista });
        } catch {
          setEstado({ fase: "erro", mensagem: "Não consegui carregar as unidades agora. Tente de novo." });
        }
      },
      (erro) =>
        setEstado({
          fase: "erro",
          mensagem:
            erro.code === erro.PERMISSION_DENIED
              ? "Para achar a mais perto, permita o acesso à localização no navegador."
              : "Não consegui pegar sua localização. Tente de novo.",
        }),
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 300_000 },
    );
  }

  return (
    <section className="rounded-2xl border border-line-active bg-surface p-4 sm:p-6" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-ink">Qual Selfit fica mais perto?</h2>
          <p className="mt-1 text-sm text-soft">Usamos sua localização só aqui, para comparar com as unidades do Brasil.</p>
        </div>
        <button
          type="button"
          onClick={buscar}
          disabled={estado.fase === "buscando"}
          className="gold-button ui-label inline-flex min-h-11 items-center gap-2 rounded-md px-4 disabled:opacity-60"
        >
          <LocateFixed className="h-4 w-4" />
          <span className="text-xs">{estado.fase === "buscando" ? "Procurando…" : "Encontrar a Selfit mais perto de mim"}</span>
        </button>
      </div>

      {estado.fase === "erro" && (
        <p className="mt-4 text-sm text-danger">
          {estado.mensagem}{" "}
          <a href={SELFIT_SITE} target="_blank" rel="noopener" className="underline">
            Ver todas as unidades no site da Selfit
          </a>
          .
        </p>
      )}

      {estado.fase === "pronto" && (
        <ol className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-3">
          {estado.lista.map((u, i) => (
            <li key={u.url} className={`min-w-0 rounded-xl border p-4 ${i === 0 ? "border-gold-light bg-gold/10" : "border-line bg-surface-2"}`}>
              <p className="ui-label text-[11px] text-gold">{i === 0 ? "A mais perto" : `${i + 1}ª opção`} · {fmtKm(u.km)}</p>
              <h3 className="mt-1 font-display text-lg font-bold uppercase leading-tight tracking-tight text-ink">
                Selfit {u.nome}
                {u.emBreve && <span className="ml-2 align-middle text-[10px] text-muted">(em breve)</span>}
              </h3>
              <p className="mt-1 flex gap-1.5 text-xs text-soft">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none" />
                <span>
                  {u.endereco} · {u.cidade}/{u.uf}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={rotaUrl(u)} target="_blank" rel="noopener" className="gold-button ui-label inline-flex min-h-10 items-center gap-1.5 rounded-md px-3">
                  <Navigation className="h-4 w-4" />
                  <span className="text-xs">Como chegar</span>
                </a>
                <a href={u.url} target="_blank" rel="noopener" className="ghost-button ui-label inline-flex min-h-10 items-center rounded-md px-3">
                  <span className="text-xs">Ver unidade</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
