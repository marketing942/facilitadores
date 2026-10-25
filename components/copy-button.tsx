"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyText } from "@/components/explorer-kit";

/** Botão dourado que copia `value` e mostra "Copiado" por um instante. */
export function CopyButton({
  value,
  label = "Copiar",
  className = "",
  variant = "gold",
}: {
  value: string;
  label?: string;
  className?: string;
  variant?: "gold" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() =>
        copyText(value, () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        })
      }
      className={`ui-label inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-xs transition ${
        copied ? "bg-gold-pale text-[#16130c]" : variant === "gold" ? "gold-button" : "ghost-button"
      } ${className}`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="text-xs">{copied ? "Copiado" : label}</span>
    </button>
  );
}
