"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleHelp } from "lucide-react";
import { GROUPS } from "@/config/tools";

// Tutorial guiado: abre sozinho no primeiro acesso naquele navegador (marca no localStorage) e pode ser
// repetido pelo botão "?" do topo. Cada passo destaca um elemento com data-tour="..." e escurece o resto.

const CHAVE = "cppem-tutorial-visto-v1";
const EVENTO = "cppem:tutorial";

type Passo = { alvo?: string; titulo: string; texto: string };

const PASSOS: Passo[] = [
  {
    titulo: "Bem-vindo aos Utilitários CPPEM",
    texto: "Em poucos passos você conhece o sistema. Avance no seu ritmo, ou pule quando quiser.",
  },
  {
    alvo: "menu",
    titulo: "O menu",
    texto: `Tudo fica organizado em ${GROUPS.length} grupos. Toque num grupo para ver as abas dele.`,
  },
  ...GROUPS.map((g) => ({
    alvo: `grupo-${g.id}`,
    titulo: g.label,
    texto: `${g.description}. Aqui você encontra: ${g.tools.map((t) => t.label).join(", ")}.`,
  })),
  { alvo: "ia", titulo: "Atalhos de IA", texto: "ChatGPT, Claude, Gemini e Jarvis a um toque, de qualquer página." },
  {
    alvo: "home",
    titulo: "Página inicial",
    texto: "Aqui ficam os cartões de todas as abas, por grupo. Toque em CPPEM, no topo, para voltar sempre para cá.",
  },
  { alvo: "ajuda", titulo: "Quer ver de novo?", texto: "Este botão repete o tutorial quando você quiser." },
  { titulo: "Tudo pronto!", texto: "Agora é com você. Bom trabalho!" },
];

/** Primeiro elemento visível com aquele data-tour (o menu existe no topo e na barra de baixo). */
function achar(alvo: string): HTMLElement | null {
  const els = document.querySelectorAll<HTMLElement>(`[data-tour="${alvo}"]`);
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

function marcarVisto() {
  try {
    localStorage.setItem(CHAVE, "1");
  } catch {
    /* navegação privada: só não lembra */
  }
}

/** Botão discreto do topo que repete o tutorial. */
export function TourButton() {
  return (
    <button
      type="button"
      data-tour="ajuda"
      onClick={() => window.dispatchEvent(new Event(EVENTO))}
      title="Repetir tutorial"
      aria-label="Repetir tutorial guiado"
      className="flex h-9 w-9 flex-none items-center justify-center rounded-md text-muted transition hover:bg-surface-2 hover:text-gold-light"
    >
      <CircleHelp className="h-[18px] w-[18px]" />
    </button>
  );
}

type Rect = { top: number; left: number; width: number; height: number };

export function Tour() {
  const router = useRouter();
  const [passos, setPassos] = useState<Passo[] | null>(null);
  const [i, setI] = useState(0);
  const [medida, setRect] = useState<Rect | null>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);
  const proximo = useRef<HTMLButtonElement>(null);

  const iniciar = useCallback(() => {
    // só os passos cujo alvo existe nesta tela (ex.: os cartões só existem na página inicial)
    setPassos(PASSOS.filter((p) => !p.alvo || achar(p.alvo)));
    setI(0);
  }, []);

  const fechar = useCallback(() => {
    marcarVisto();
    setPassos(null);
  }, []);

  // primeiro acesso naquele navegador
  useEffect(() => {
    let visto = false;
    try {
      visto = localStorage.getItem(CHAVE) === "1";
    } catch {
      visto = true;
    }
    if (visto) return;
    const t = setTimeout(iniciar, 700);
    return () => clearTimeout(t);
  }, [iniciar]);

  // botão "repetir": leva à página inicial (onde estão todos os alvos) e começa
  useEffect(() => {
    const onRepetir = () => {
      if (window.location.pathname !== "/") {
        router.push("/");
        setTimeout(iniciar, 800);
      } else {
        iniciar();
      }
    };
    window.addEventListener(EVENTO, onRepetir);
    return () => window.removeEventListener(EVENTO, onRepetir);
  }, [router, iniciar]);

  const passo = passos?.[i];

  // mede o alvo do passo atual e acompanha rolagem e redimensionamento
  useEffect(() => {
    if (!passo) return;
    const el = passo.alvo ? achar(passo.alvo) : null;
    // alvos lá embaixo (os cartões da página inicial): rola até o começo deles, abaixo do topo fixo
    if (el && passo.alvo === "home") {
      const y = el.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: Math.max(y, 0), behavior: "smooth" });
    }
    const medir = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
      if (!el) return setRect(null);
      const r = el.getBoundingClientRect();
      const folga = 6;
      // alvo grande (os cartões da página inicial): destaca só um pedaço, para sobrar espaço ao cartão
      const top = Math.max(r.top - folga, 8);
      const bottom = Math.min(r.bottom + folga, window.innerHeight - 8, top + window.innerHeight * 0.45);
      setRect({ top, left: r.left - folga, width: r.width + folga * 2, height: Math.max(bottom - top, 0) });
    };
    const t0 = setTimeout(medir, 0);
    const t = setTimeout(medir, 450); // depois da rolagem suave
    window.addEventListener("resize", medir);
    window.addEventListener("scroll", medir, true);
    return () => {
      clearTimeout(t0);
      clearTimeout(t);
      window.removeEventListener("resize", medir);
      window.removeEventListener("scroll", medir, true);
    };
  }, [passo]);

  // teclado e foco
  useEffect(() => {
    if (!passos) return;
    proximo.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      else if (e.key === "ArrowRight") setI((v) => (v < passos.length - 1 ? v + 1 : v));
      else if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [passos, i, fechar]);

  if (!passos || !passo) return null;

  const ultimo = i === passos.length - 1;
  // passo sem alvo (boas-vindas e fim): nunca herda o destaque do passo anterior
  const rect = passo.alvo ? medida : null;
  const largura = Math.min(360, vw - 24);
  let estiloCard: React.CSSProperties;
  if (rect) {
    const abaixo = vh - (rect.top + rect.height);
    const left = Math.min(Math.max(rect.left + rect.width / 2 - largura / 2, 12), vw - largura - 12);
    const acima = rect.top;
    // abaixo do alvo, acima dele ou, sem espaço, preso ao pé da tela: o cartão nunca sai da tela
    estiloCard =
      abaixo > 230
        ? { top: rect.top + rect.height + 12, left, width: largura }
        : acima > 230
          ? { bottom: vh - rect.top + 12, left, width: largura }
          : { bottom: 12, left, width: largura };
  } else {
    estiloCard = { top: "50%", left: "50%", width: largura, transform: "translate(-50%, -50%)" };
  }

  return (
    <div className="fixed inset-0 z-[100] print:hidden" aria-live="polite">
      {/* bloqueia cliques na página durante o tutorial */}
      <div className="absolute inset-0" onClick={(e) => e.stopPropagation()} />

      {rect ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-xl ring-2 ring-gold-light transition-all duration-300 ease-out"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, boxShadow: "0 0 0 200vmax rgba(5,5,6,.78)" }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-[rgba(5,5,6,.78)] transition-opacity duration-300" />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-titulo"
        className="absolute rounded-2xl border border-line-active bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,.6)] transition-all duration-300 ease-out"
        style={estiloCard}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="ui-label text-[11px] text-gold">
            Passo {i + 1} de {passos.length}
          </p>
          <button type="button" onClick={fechar} className="ui-label -my-2 -mr-2 rounded-md px-2 py-2.5 text-[11px] text-muted hover:text-gold-light">
            <span className="text-[11px]">Pular tutorial</span>
          </button>
        </div>
        <h2 id="tour-titulo" className="mt-1.5 font-display text-xl font-bold uppercase leading-tight tracking-tight text-ink">
          {passo.titulo}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-soft">{passo.texto}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
          <div className="flex gap-1" aria-hidden>
            {passos.map((_, k) => (
              <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? "w-5 bg-gold-light" : "w-1.5 bg-line-active"}`} />
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            {i > 0 && (
              <button type="button" onClick={() => setI(i - 1)} className="ghost-button ui-label inline-flex min-h-10 items-center rounded-md px-3">
                <span className="text-xs">Voltar</span>
              </button>
            )}
            <button
              ref={proximo}
              type="button"
              onClick={() => (ultimo ? fechar() : setI(i + 1))}
              className="gold-button ui-label inline-flex min-h-10 items-center rounded-md px-4"
            >
              <span className="text-xs">{ultimo ? "Concluir" : i === 0 ? "Começar" : "Próximo"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
