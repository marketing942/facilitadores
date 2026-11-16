"use client";

import type { ReactNode } from "react";

/** Botão de enviar que pergunta antes (usado para excluir). */
export function ConfirmButton({
  message,
  formAction,
  className,
  children,
}: {
  message: string;
  formAction: (formData: FormData) => void | Promise<void>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      formAction={formAction}
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
