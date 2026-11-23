// Dados do site, lidos das views públicas do Supabase (alimentadas pelo CRM).
import { cache } from "react";
import type { Finalidade, Imovel, TipoImovel } from "./types";
import { SUPABASE_KEY, SUPABASE_URL } from "./supabase";

type Linha = Record<string, unknown>;

async function ler(view: string, query = "select=*"): Promise<Linha[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${view}?${query}`, {
      headers: { apikey: SUPABASE_KEY },
      cache: "no-store",
    });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    return (await r.json()) as Linha[];
  } catch (e) {
    console.error(`[supabase] falha ao ler ${view}:`, e);
    return [];
  }
}

const txt = (v: unknown) => (typeof v === "string" ? v : "");
const num = (v: unknown) => (v == null ? 0 : Number(v));
const opt = (v: unknown) => (v == null ? undefined : Number(v));
const lista = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

function paraImovel(r: Linha): Imovel {
  const fotos = lista(r.fotos);
  return {
    id: txt(r.id), slug: txt(r.slug), ref: txt(r.ref), titulo: txt(r.titulo),
    finalidade: txt(r.finalidade) as Finalidade, tipo: txt(r.tipo) as TipoImovel,
    cidade: txt(r.cidade), bairro: txt(r.bairro), preco: num(r.preco),
    condominio: opt(r.condominio), iptu: opt(r.iptu),
    dormitorios: num(r.dormitorios), suites: num(r.suites), banheiros: num(r.banheiros),
    vagas: num(r.vagas), areaUtil: num(r.area_util), areaTotal: opt(r.area_total),
    descricao: txt(r.descricao), caracteristicas: lista(r.caracteristicas),
    capa: fotos[0] ?? "", galeria: fotos, destaque: !!r.destaque,
    videoUrl: txt(r.video_url) || undefined,
    corretorId: txt(r.corretor_id) || undefined,
  };
}

export type Locais = Record<string, string[]>;
function agruparLocais(itens: { cidade: string; bairro: string }[]): Locais {
  const m: Locais = {};
  itens.filter((x) => x.cidade).forEach(({ cidade, bairro }) => {
    (m[cidade] ??= []).includes(bairro) || !bairro || m[cidade].push(bairro);
  });
  Object.values(m).forEach((b) => b.sort((a, c) => a.localeCompare(c, "pt-BR")));
  return Object.fromEntries(Object.entries(m).sort(([a], [b]) => a.localeCompare(b, "pt-BR")));
}
const ordenar = (xs: string[]) => [...new Set(xs.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));

export const catalogo = cache(async () => {
  const imvs = await ler("vw_site_imoveis", "select=*&order=destaque.desc,atualizado_em.desc");
  const imoveis = imvs.map(paraImovel);
  const deFinalidade = (f?: string) => imoveis.filter((i) => !f || i.finalidade === f);
  return {
    imoveis,
    getImovel: (slug: string) => imoveis.find((i) => i.slug === slug),
    locaisImoveis: (f?: string) => agruparLocais(deFinalidade(f)),
    tiposImoveis: (f?: string) => ordenar(deFinalidade(f).map((i) => i.tipo)),
    temVenda: imoveis.some((i) => i.finalidade === "venda"),
    temLocacao: imoveis.some((i) => i.finalidade === "locacao"),
  };
});
