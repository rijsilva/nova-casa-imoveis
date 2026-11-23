"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import clsx from "clsx";

export type Aba = "venda" | "locacao";

export type OpcoesBusca = {
  abas: { id: Aba; label: string }[];
  porAba: Record<Aba, { locais: Record<string, string[]>; tipos: string[] }>;
};

export function SearchBar({ opcoes }: { opcoes: OpcoesBusca }) {
  const router = useRouter();
  const primeiraAba = opcoes.abas[0]?.id ?? "venda";
  const [aba, setAba] = useState<Aba>(primeiraAba);
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [tipo, setTipo] = useState("");

  const { locais, tipos } = opcoes.porAba[aba] ?? { locais: {}, tipos: [] };
  const cidades = Object.keys(locais);

  function trocarAba(a: Aba) {
    setAba(a);
    if (cidade && !opcoes.porAba[a].locais[cidade]) { setCidade(""); setBairro(""); }
    else if (bairro && !opcoes.porAba[a].locais[cidade]?.includes(bairro)) setBairro("");
    if (tipo && !opcoes.porAba[a].tipos.includes(tipo)) setTipo("");
  }

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams({ finalidade: aba });
    if (cidade) p.set("cidade", cidade);
    if (bairro) p.set("bairro", bairro);
    if (tipo) p.set("tipo", tipo);
    router.push(`/imoveis?${p}`);
  }

  if (!opcoes.abas.length) return null;

  return (
    <div className="w-full max-w-3xl">
      <div className="flex gap-1" role="tablist" aria-label="Tipo de busca">
        {opcoes.abas.map((a) => (
          <button
            key={a.id}
            role="tab"
            aria-selected={aba === a.id}
            type="button"
            onClick={() => trocarAba(a.id)}
            className={clsx(
              "rounded-t-xl px-6 py-2.5 text-sm font-semibold transition",
              aba === a.id ? "bg-white text-brand" : "bg-white/15 text-white hover:bg-white/25"
            )}
          >
            {a.label}
          </button>
        ))}
      </div>
      <form onSubmit={buscar} className="grid gap-3 rounded-2xl rounded-tl-none bg-white p-3 shadow-[var(--shadow-lift)] sm:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="sr-only" htmlFor="busca-cidade">Cidade</label>
        <select id="busca-cidade" value={cidade} onChange={(e) => { setCidade(e.target.value); setBairro(""); }} className="field">
          <option value="">Todas as cidades</option>
          {cidades.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="sr-only" htmlFor="busca-bairro">Bairro</label>
        <select id="busca-bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="field">
          <option value="">{cidade ? "Todos os bairros" : "Bairro"}</option>
          {cidade
            ? (locais[cidade] ?? []).map((b) => <option key={b}>{b}</option>)
            : cidades.map((c) => (
                <optgroup key={c} label={c}>
                  {locais[c].map((b) => <option key={c + b} value={b}>{b}</option>)}
                </optgroup>
              ))}
        </select>
        <label className="sr-only" htmlFor="busca-tipo">Tipo de imóvel</label>
        <select id="busca-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="field">
          <option value="">Tipo de imóvel</option>
          {tipos.map((t) => <option key={t}>{t}</option>)}
        </select>
        <button className="btn-primary px-7 py-3"><Search className="h-4 w-4" /> Buscar</button>
      </form>
    </div>
  );
}
