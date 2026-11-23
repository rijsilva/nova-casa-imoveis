import { type ReactNode } from "react";
import clsx from "clsx";

export function PageHeader({ titulo, descricao, acoes }: { titulo: string; descricao?: ReactNode; acoes?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-ink-500">{typeof descricao === "string" ? descricao : descricao}</p>}
      </div>
      {acoes && <div className="flex shrink-0 items-center gap-2">{acoes}</div>}
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

export function Badge({ children, tom = "default" }: { children: ReactNode; tom?: "default" | "info" | "warn" | "ok" | "muted" }) {
  const cls = {
    default: "badge-muted",
    info: "badge-new",
    warn: "badge-warn",
    ok: "badge-active",
    muted: "badge-muted",
  }[tom];
  return <span className={cls}>{children}</span>;
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
