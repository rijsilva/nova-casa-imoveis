"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const CHAVE = "nc_cookies_aceitos";

export function CookieBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CHAVE)) setVisivel(true);
    } catch {
      // localStorage indisponível (modo privado)
    }
  }, []);

  function aceitar() {
    try { localStorage.setItem(CHAVE, "1"); } catch { /* ignora */ }
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-white/95 backdrop-blur-sm shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-4 sm:px-6"
    >
      <div className="container-nc flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-600 max-w-2xl">
          Usamos cookies essenciais para o funcionamento do site e para lembrar suas preferências.{" "}
          <Link href="/politica-de-privacidade" className="font-semibold text-brand underline underline-offset-2 hover:text-brand-600">
            Saiba mais
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={aceitar}
            className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Aceitar e continuar
          </button>
          <button
            onClick={aceitar}
            aria-label="Fechar aviso de cookies"
            className="rounded-lg p-1.5 text-ink-500 hover:bg-sand hover:text-ink transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
