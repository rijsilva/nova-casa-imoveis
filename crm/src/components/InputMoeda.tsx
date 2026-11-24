import { useEffect, useState } from "react";
import clsx from "clsx";

export function mascararMoeda(s: string) {
  const limpo = s.replace(/[^\d,]/g, "");
  const [int, ...resto] = limpo.split(",");
  const intF = int.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return limpo.includes(",") ? `${intF || "0"},${resto.join("").slice(0, 2)}` : intF;
}
export const lerMoeda = (s: string) => (s ? Number(s.replace(/\./g, "").replace(",", ".")) : undefined);
export const formatarMoeda = (n?: number) =>
  n == null || Number.isNaN(n) ? "" : n.toLocaleString("pt-BR", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

type Props = {
  valor?: number;
  onChange: (n: number | undefined) => void;
  className?: string;
  required?: boolean;
  placeholder?: string;
  id?: string;
};

export function InputMoeda({ valor, onChange, className, required, placeholder = "0", id }: Props) {
  const [txt, setTxt] = useState(formatarMoeda(valor));
  useEffect(() => { if (lerMoeda(txt) !== valor) setTxt(formatarMoeda(valor)); }, [valor]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">R$</span>
      <input
        id={id} required={required} inputMode="decimal" placeholder={placeholder}
        className={clsx(className ?? "field", "tabular pl-10")}
        value={txt}
        onChange={(e) => { const m = mascararMoeda(e.target.value); setTxt(m); onChange(lerMoeda(m)); }}
      />
    </div>
  );
}
