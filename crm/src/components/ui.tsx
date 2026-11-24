import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export function PageHeader({ titulo, descricao, acoes }: { titulo: string; descricao?: ReactNode; acoes?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{titulo}</h1>
        {descricao && <p className="mt-1 text-ink-500">{typeof descricao === "string" ? descricao : descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  );
}

export function Stat({ label, valor, detalhe, destaque }: { label: string; valor: ReactNode; detalhe?: string; destaque?: boolean }) {
  return (
    <div className={clsx("panel p-5", destaque && "border-brand bg-brand-50")}>
      <p className="text-xs font-semibold text-ink-500">{label}</p>
      <p className={clsx("mt-1 font-display text-3xl font-bold", destaque ? "text-brand" : "text-ink")}>{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-ink-400">{detalhe}</p>}
    </div>
  );
}

type Tom = "default" | "info" | "warn" | "ok" | "muted" | "danger";

export function Badge({ children, tom = "default", className }: { children: ReactNode; tom?: Tom; className?: string }) {
  const cls: Record<Tom, string> = {
    default: "bg-sand text-ink-700",
    info: "bg-brand-50 text-brand",
    warn: "bg-amber-50 text-amber-700",
    ok: "bg-green-50 text-green-700",
    muted: "bg-sand text-ink-500",
    danger: "bg-red-50 text-red-700",
  };
  return <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap", cls[tom], className)}>{children}</span>;
}

export function Avatar({ nome, className = "h-8 w-8 text-xs" }: { nome: string; className?: string }) {
  const initials = nome.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className={clsx("inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand", className)}>
      {initials}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
    </div>
  );
}

export function Empty({ mensagem = "Nenhum registro encontrado." }: { mensagem?: string }) {
  return <p className="py-16 text-center text-ink-400">{mensagem}</p>;
}

export function Modal({
  aberto, onFechar, titulo, children, rodape, largura = "max-w-lg",
}: { aberto: boolean; onFechar: () => void; titulo: string; children: ReactNode; rodape?: ReactNode; largura?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto, onFechar]);
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-10" onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={titulo} className={clsx("w-full rounded-2xl bg-white shadow-xl", largura)}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-bold">{titulo}</h2>
          <button onClick={onFechar} className="btn-ghost -mr-2 p-1.5" aria-label="Fechar"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {rodape && <div className="flex justify-end gap-2 border-t border-line px-5 py-3.5">{rodape}</div>}
      </div>
    </div>
  );
}

export function Campo({ label, children, dica, className }: { label: string; children: ReactNode; dica?: ReactNode; className?: string }) {
  return (
    <label className={clsx("block", className)}>
      <span className="label">{label}</span>
      {children}
      {dica && <span className="mt-1 block text-xs text-ink-400">{dica}</span>}
    </label>
  );
}

export function Vazio({ titulo, texto, acao }: { titulo: string; texto?: string; acao?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <p className="font-semibold">{titulo}</p>
      {texto && <p className="mt-1 max-w-sm text-ink-500">{texto}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}

export function Toggle({ ativo, onChange, label }: { ativo: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={ativo} aria-label={label} onClick={() => onChange(!ativo)}
      className={clsx("relative inline-flex h-5 w-9 shrink-0 rounded-full transition", ativo ? "bg-green-500" : "bg-ink-300")}
    >
      <span className={clsx("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition", ativo ? "left-[18px]" : "left-0.5")} />
    </button>
  );
}

export function Segmentado<T extends string>({ valor, opcoes, onChange }: { valor: T; opcoes: { v: T; label: ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-white p-0.5">
      {opcoes.map((o) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          className={clsx("inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition", valor === o.v ? "bg-ink text-white" : "text-ink-600 hover:text-ink")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ListaTextos({ valores, onChange, placeholder }: { valores: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {valores.map((v, i) => (
          <span key={v + i} className="inline-flex items-center gap-1 rounded-full bg-sand py-1 pl-3 pr-1.5 text-xs font-medium">
            {v}
            <button type="button" onClick={() => onChange(valores.filter((_, j) => j !== i))} className="rounded-full p-0.5 hover:bg-line" aria-label={`Remover ${v}`}><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <input
        className="field" placeholder={placeholder}
        onKeyDown={(e) => {
          const t = e.currentTarget.value.trim();
          if (e.key === "Enter" && t) { e.preventDefault(); onChange([...valores, t]); e.currentTarget.value = ""; }
        }}
      />
      <span className="mt-1 block text-xs text-ink-400">Digite e pressione Enter para adicionar.</span>
    </div>
  );
}
