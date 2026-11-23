import { cache } from "react";
import type { Finalidade, Imovel, TipoImovel } from "./types";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const AID  = process.env.NEXT_PUBLIC_NOVA_CASA_AGENCY_ID || "";

type Row = Record<string, unknown>;

async function query(params: string): Promise<Row[]> {
  if (!URL || !KEY || !AID) return [];
  try {
    const r = await fetch(`${URL}/rest/v1/properties?${params}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      cache: "no-store",
    });
    if (!r.ok) { console.error("[supabase]", r.status, await r.text()); return []; }
    return (await r.json()) as Row[];
  } catch (e) {
    console.error("[supabase] falha:", e);
    return [];
  }
}

const txt  = (v: unknown) => (typeof v === "string" ? v : "");
const num  = (v: unknown) => (v == null ? 0 : Number(v));
const opt  = (v: unknown) => (v == null ? undefined : Number(v));
const list = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
const bool = (v: unknown) => v === true || v === "true";

function toFinalidade(purpose: unknown): Finalidade {
  const p = txt(purpose).toUpperCase();
  return p === "LOCACAO" || p === "ALUGUEL" ? "locacao" : "venda";
}

function toSlug(title: string, id: string): string {
  return (
    title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim() +
    "-" + id.slice(0, 8)
  );
}

function toImovel(r: Row): Imovel {
  const fotos = list(r.photos);
  const id    = txt(r.id);
  const title = txt(r.title);
  return {
    id,
    slug:          txt(r.slug) || toSlug(title, id),
    ref:           txt(r.code) || id.slice(0, 8).toUpperCase(),
    titulo:        title,
    finalidade:    toFinalidade(r.purpose),
    tipo:          txt(r.property_type_name || r.tipo) as TipoImovel,
    cidade:        txt(r.city),
    bairro:        txt(r.neighborhood),
    preco:         num(r.price),
    condominio:    opt(r.condo_fee),
    iptu:          opt(r.iptu),
    dormitorios:   num(r.bedrooms),
    suites:        num(r.suites),
    banheiros:     num(r.bathrooms),
    vagas:         num(r.parking_spaces),
    areaUtil:      num(r.area_useful),
    areaTotal:     opt(r.area_total),
    descricao:     txt(r.description),
    caracteristicas: list(r.features_list ?? r.caracteristicas),
    capa:          fotos[0] ?? "",
    galeria:       fotos,
    destaque:      bool(r.is_featured),
    videoUrl:      txt(r.video_url) || undefined,
    corretorId:    txt(r.broker_id) || undefined,
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
  const rows = await query(
    `agency_id=eq.${AID}&is_active=eq.true&select=*&order=is_featured.desc,updated_at.desc`
  );
  const imoveis = rows.map(toImovel);
  const deFinalidade = (f?: string) => imoveis.filter((i) => !f || i.finalidade === f);
  return {
    imoveis,
    getImovel: (slug: string) => imoveis.find((i) => i.slug === slug),
    locaisImoveis: (f?: string) => agruparLocais(deFinalidade(f)),
    tiposImoveis:  (f?: string) => ordenar(deFinalidade(f).map((i) => i.tipo)),
    temVenda:   imoveis.some((i) => i.finalidade === "venda"),
    temLocacao: imoveis.some((i) => i.finalidade === "locacao"),
  };
});
