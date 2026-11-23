import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { ImovelCard } from "@/components/ImovelCard";
import { catalogo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Imóveis à venda e para alugar",
  description: "Apartamentos, casas e imóveis para comprar ou alugar em Paulínia/SP e região.",
};

type Filtros = {
  finalidade?: string; cidade?: string; bairro?: string; tipo?: string;
  dorms?: string; precoMin?: string; precoMax?: string;
};

export default async function Imoveis({ searchParams }: { searchParams: Promise<Filtros> }) {
  const sp = await searchParams;
  const { imoveis, locaisImoveis, tiposImoveis } = await catalogo();
  const { finalidade = "", cidade = "", bairro = "", tipo = "", dorms = "", precoMin = "", precoMax = "" } = sp;

  const lista = imoveis.filter((i) =>
    (!finalidade || i.finalidade === finalidade) &&
    (!cidade || i.cidade === cidade) &&
    (!bairro || i.bairro === bairro) &&
    (!tipo || i.tipo === tipo) &&
    (!dorms || i.dormitorios >= Number(dorms)) &&
    (!precoMin || i.preco >= Number(precoMin)) &&
    (!precoMax || i.preco <= Number(precoMax))
  );

  const locais = locaisImoveis(finalidade || undefined);
  const tipos = tiposImoveis(finalidade || undefined);
  const cidades = Object.keys(locais);

  const titulo = finalidade === "venda" ? "Imóveis à venda" : finalidade === "locacao" ? "Imóveis para alugar" : "Todos os imóveis";
  const abas = [
    { v: "", label: "Todos" },
    { v: "venda", label: "Comprar" },
    { v: "locacao", label: "Alugar" },
  ];

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="container-nc py-14">
          <p className="eyebrow gold-mark mb-3">Venda e locação</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">{titulo}</h1>

          <div className="mt-6 flex gap-2">
            {abas.map((a) => (
              <Link
                key={a.v}
                href={a.v ? `/imoveis?finalidade=${a.v}` : "/imoveis"}
                className={clsx("rounded-full px-5 py-2 text-sm font-semibold transition", finalidade === a.v ? "bg-brand text-white" : "bg-white text-ink-600 ring-1 ring-line hover:text-ink")}
              >
                {a.label}
              </Link>
            ))}
          </div>

          <form className="mt-4 grid gap-3 rounded-2xl bg-white p-3 shadow-[var(--shadow-card)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]" action="/imoveis">
            {finalidade && <input type="hidden" name="finalidade" value={finalidade} />}
            <select name="cidade" defaultValue={cidade} className="field" aria-label="Cidade">
              <option value="">Todas as cidades</option>
              {cidades.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select name="bairro" defaultValue={bairro} className="field" aria-label="Bairro">
              <option value="">Todos os bairros</option>
              {(cidade ? locais[cidade] ?? [] : Object.values(locais).flat()).map((b) => <option key={b}>{b}</option>)}
            </select>
            <select name="tipo" defaultValue={tipo} className="field" aria-label="Tipo de imóvel">
              <option value="">Todos os tipos</option>
              {tipos.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select name="dorms" defaultValue={dorms} className="field" aria-label="Dormitórios">
              <option value="">Quartos</option>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ quarto{n > 1 ? "s" : ""}</option>)}
            </select>
            <button className="btn-primary px-7 py-3 sm:col-span-2 lg:col-span-1">Filtrar</button>
          </form>
        </div>
      </section>

      <section className="container-nc py-12">
        <div className="mb-6 flex items-center justify-between text-sm text-ink-500">
          <span>{lista.length} {lista.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}</span>
          {(cidade || bairro || tipo || dorms || precoMin || precoMax) && (
            <Link href={finalidade ? `/imoveis?finalidade=${finalidade}` : "/imoveis"} className="font-semibold text-brand">Limpar filtros</Link>
          )}
        </div>
        {lista.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((i) => <ImovelCard key={i.slug} i={i} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line p-12 text-center text-ink-500">
            Nenhum imóvel com esses filtros.{" "}
            <Link className="font-semibold text-brand" href="/imoveis">Ver todos</Link>
          </div>
        )}
      </section>
    </>
  );
}
