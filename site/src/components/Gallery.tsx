"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Photo } from "./Photo";

export function Gallery({ fotos, alt }: { fotos: string[]; alt: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!fotos.length) return null;

  const prev = () => setLightbox((n) => (n! > 0 ? n! - 1 : fotos.length - 1));
  const next = () => setLightbox((n) => (n! < fotos.length - 1 ? n! + 1 : 0));

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[var(--radius-card)]" style={{ height: 420 }}>
        <button
          type="button"
          onClick={() => setLightbox(0)}
          className="relative col-span-2 row-span-2 cursor-zoom-in overflow-hidden"
          aria-label="Ver foto 1"
        >
          <Photo src={fotos[0]} alt={`${alt} — foto principal`} priority className="h-full w-full" />
        </button>
        {fotos.slice(1, 5).map((foto, idx) => (
          <button
            key={foto}
            type="button"
            onClick={() => setLightbox(idx + 1)}
            className="relative cursor-zoom-in overflow-hidden"
            aria-label={`Ver foto ${idx + 2}`}
          >
            <Photo src={foto} alt={`${alt} — foto ${idx + 2}`} className="h-full w-full" />
            {idx === 3 && fotos.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-semibold text-white">
                +{fotos.length - 5} fotos
              </div>
            )}
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4" onClick={() => setLightbox(null)}>
          <button type="button" className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30" onClick={() => setLightbox(null)} aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
          <button type="button" className="absolute left-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Anterior">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="relative max-h-[90vh] max-w-5xl w-full aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fotos[lightbox]} alt={`${alt} — foto ${lightbox + 1}`} className="h-full w-full object-contain" />
          </div>
          <button type="button" className="absolute right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Próxima">
            <ChevronRight className="h-5 w-5" />
          </button>
          <p className="absolute bottom-4 text-sm text-white/70">{lightbox + 1} / {fotos.length}</p>
        </div>
      )}
    </>
  );
}
