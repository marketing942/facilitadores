import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

// Aba Como estudar (/como-estudar, grupo Estudo): a pirâmide de aprendizagem e passos práticos.
export const metadata: Metadata = {
  title: "Como estudar | Utilitários CPPEM",
  description: "A pirâmide de aprendizagem: quanto mais ativo o estudo, mais você retém.",
};

const DICAS = [
  { titulo: "Leu ou assistiu? Discuta", texto: "Depois de um capítulo ou de uma aula, conte para um colega o que aprendeu e debata as ideias." },
  { titulo: "Aplique no mesmo dia", texto: "Escolha uma coisa do que estudou e use no seu trabalho ainda hoje: num atendimento, numa venda, num processo." },
  { titulo: "Ensine alguém", texto: "Explicar para outra pessoa é o jeito mais forte de fixar: mostra o que você entendeu e o que ainda falta." },
];

export default function ComoEstudarPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-4 pt-8 sm:px-6 sm:pb-12">
      <PageHeader crumb="Como estudar" eyebrow="Estudo · Grupo CPPEM" title={<>Como <span className="text-gold-light">estudar</span></>} />

      <p className="mb-6 max-w-2xl text-base leading-relaxed text-soft">
        Ler, escutar e assistir é o começo. O que fica de verdade vem de discutir, praticar e ensinar: quanto mais
        ativo o estudo, mais você guarda.
      </p>

      <figure className="overflow-hidden rounded-2xl border border-line bg-white p-4 sm:p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/estudo/piramide-aprendizagem.png"
          alt="Pirâmide de aprendizagem. Aprendizado passivo: ler 10%, escutar 20%, ver 30%, ver e escutar 50%. Aprendizado ativo: discutir 70%, praticar 80%, ensinar a outros 90%."
          width={1024}
          height={696}
          className="mx-auto h-auto w-full max-w-3xl"
        />
      </figure>
      <p className="mt-2 text-xs text-muted">
        Os percentuais são uma referência didática, não uma medição exata. O recado é o mesmo: estudo ativo fixa mais.
      </p>

      <h2 className="eyebrow mb-3 mt-8">Na prática</h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {DICAS.map((dica, i) => (
          <li key={dica.titulo} className="rounded-xl border border-line bg-surface p-4 sm:p-5">
            <span className="ui-label text-xs text-gold">Passo {i + 1}</span>
            <h3 className="mt-1.5 font-display text-lg font-bold uppercase leading-snug tracking-tight text-ink">{dica.titulo}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-soft">{dica.texto}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
