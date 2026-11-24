import type { ReactNode } from "react";
import { AlertCircle, Check, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export type ErroCampo = { etapa: number; campo: string; msg: string };

export function Etapas({
  etapas, atual, onIr, erros, mostrarErros,
}: { etapas: string[]; atual: number; onIr: (i: number) => void; erros: ErroCampo[]; mostrarErros: boolean }) {
  return (
    <nav aria-label="Etapas do cadastro" className="mb-6 overflow-x-auto">
      <ol className="flex min-w-max gap-2">
        {etapas.map((nome, i) => {
          const n = erros.filter((e) => e.etapa === i).length;
          const ativo = i === atual;
          return (
            <li key={nome}>
              <button type="button" onClick={() => onIr(i)} aria-current={ativo ? "step" : undefined}
                className={clsx("inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition",
                  ativo ? "bg-ink text-white" : "bg-white text-ink-600 ring-1 ring-line hover:text-ink",
                  mostrarErros && n > 0 && !ativo && "ring-red-300")}>
                <span className={clsx("inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                  mostrarErros && n > 0 ? "bg-red-500 text-white"
                    : mostrarErros && !ativo ? "bg-green-50 text-green-600"
                      : ativo ? "bg-white/15" : "bg-sand")}>
                  {mostrarErros && n > 0 ? n : mostrarErros ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                {nome}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function AlertaErros({ erros, etapas, onIr }: { erros: ErroCampo[]; etapas: string[]; onIr: (i: number) => void }) {
  if (!erros.length) return null;
  const grupos = [...new Set(erros.map((e) => e.etapa))].sort();
  return (
    <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="flex items-center gap-2 font-semibold text-red-600">
        <AlertCircle className="h-4 w-4" /> {erros.length === 1 ? "Falta 1 item para publicar no site" : `Faltam ${erros.length} itens para publicar no site`}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {grupos.map((g) => (
          <div key={g}>
            <button type="button" onClick={() => onIr(g)} className="text-xs font-bold uppercase tracking-wide text-ink-700 underline-offset-2 hover:underline">
              {g + 1}. {etapas[g]} →
            </button>
            <ul className="mt-1 space-y-0.5 text-sm text-ink-700">
              {erros.filter((e) => e.etapa === g).map((e) => <li key={e.campo + e.msg}>• <strong>{e.campo}:</strong> {e.msg}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NavEtapas({ atual, total, onIr, ultimo }: { atual: number; total: number; onIr: (i: number) => void; ultimo: ReactNode }) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
      <button type="button" className="btn-secondary" disabled={atual === 0} onClick={() => onIr(atual - 1)}><ChevronLeft className="h-4 w-4" /> Anterior</button>
      <span className="text-xs text-ink-500">Etapa {atual + 1} de {total}</span>
      {atual < total - 1
        ? <button type="button" className="btn-primary" onClick={() => onIr(atual + 1)}>Próximo <ChevronRight className="h-4 w-4" /></button>
        : ultimo}
    </div>
  );
}

export const erroDe = (erros: ErroCampo[], mostrar: boolean, campo: string) => {
  const e = mostrar ? erros.find((x) => x.campo === campo) : undefined;
  return e ? <span className="text-red-500">{e.msg}</span> : undefined;
};
