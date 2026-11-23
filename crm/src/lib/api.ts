/**
 * Camada de acesso ao Supabase para o CRM da Nova Casa Imóveis.
 * Mapeia os campos internos (PT) para a estrutura existente do banco.
 */
import type { EtapaLead, Finalidade, Imovel, Lead } from "./types";

const BASE = import.meta.env.VITE_SUPABASE_URL as string;
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const AGENCY_ID = import.meta.env.VITE_NOVA_CASA_AGENCY_ID as string;

// ─── helpers ───────────────────────────────────────────────────────────────

function headers(extra?: Record<string, string>) {
  return { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=representation", ...extra };
}

async function get<T>(path: string, params = ""): Promise<T[]> {
  const r = await fetch(`${BASE}/rest/v1/${path}?${params}`, { headers: headers() });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}/rest/v1/${path}`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  if (!r.ok) throw new Error(await r.text());
  const json = await r.json();
  return Array.isArray(json) ? json[0] : json;
}

async function patch(path: string, params: string, body: unknown): Promise<void> {
  const r = await fetch(`${BASE}/rest/v1/${path}?${params}`, { method: "PATCH", headers: headers(), body: JSON.stringify(body) });
  if (!r.ok) throw new Error(await r.text());
}

// ─── mapeamento properties ↔ Imovel ────────────────────────────────────────

type PropRow = Record<string, unknown>;

function toFinalidade(p: unknown): Finalidade {
  return String(p).toUpperCase() === "LOCACAO" ? "locacao" : "venda";
}
function fromFinalidade(f: Finalidade) {
  return f === "locacao" ? "LOCACAO" : "VENDA";
}

function rowToImovel(r: PropRow): Imovel {
  const fotos = Array.isArray(r.photos) ? (r.photos as string[]) : [];
  const id = String(r.id);
  const title = String(r.title ?? "");
  const slug = String(r.slug ?? "").trim() ||
    title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") + "-" + id.slice(0, 8);
  return {
    id, slug,
    ref:           String(r.code ?? id.slice(0, 8).toUpperCase()),
    titulo:        title,
    finalidade:    toFinalidade(r.purpose),
    tipo:          String(r.tipo ?? r.property_type_name ?? "Apartamento") as Imovel["tipo"],
    cidade:        String(r.city ?? ""),
    bairro:        String(r.neighborhood ?? ""),
    preco:         Number(r.price ?? 0),
    condominio:    r.condo_fee != null ? Number(r.condo_fee) : undefined,
    iptu:          r.iptu != null ? Number(r.iptu) : undefined,
    dormitorios:   Number(r.bedrooms ?? 0),
    suites:        Number(r.suites ?? 0),
    banheiros:     Number(r.bathrooms ?? 0),
    vagas:         Number(r.parking_spaces ?? 0),
    areaUtil:      Number(r.area_useful ?? 0),
    areaTotal:     r.area_total != null ? Number(r.area_total) : undefined,
    descricao:     String(r.description ?? ""),
    caracteristicas: Array.isArray(r.features_list) ? r.features_list as string[] : [],
    fotos,
    videoUrl:      String(r.video_url ?? "") || undefined,
    destaque:      r.is_featured === true,
    publicado:     r.is_active !== false,
    corretorId:    String(r.broker_id ?? ""),
    criadoEm:      String(r.created_at ?? new Date().toISOString()),
    atualizadoEm:  String(r.updated_at ?? new Date().toISOString()),
  };
}

function imovelToRow(i: Imovel, agencyId: string, propertyTypeId?: string) {
  return {
    id:              i.id,
    agency_id:       agencyId,
    broker_id:       i.corretorId || null,
    property_type_id: propertyTypeId ?? null,
    title:           i.titulo,
    description:     i.descricao,
    purpose:         fromFinalidade(i.finalidade),
    price:           i.preco,
    city:            i.cidade,
    neighborhood:    i.bairro,
    bedrooms:        i.dormitorios,
    bathrooms:       i.banheiros,
    suites:          i.suites,
    parking_spaces:  i.vagas,
    area_useful:     i.areaUtil,
    area_total:      i.areaTotal ?? null,
    condo_fee:       i.condominio ?? null,
    iptu:            i.iptu ?? null,
    photos:          i.fotos,
    video_url:       i.videoUrl ?? null,
    code:            i.ref,
    is_featured:     i.destaque,
    is_active:       i.publicado,
    updated_at:      new Date().toISOString(),
  };
}

// ─── mapeamento leads ↔ Lead ────────────────────────────────────────────────

type LeadRow = Record<string, unknown>;

const ETAPA_MAP: Record<string, EtapaLead> = {
  NOVO: "novo", EM_ATENDIMENTO: "atendimento", VISITA: "visita",
  PROPOSTA: "proposta", FECHADO: "fechado", PERDIDO: "perdido",
};
const ETAPA_RMAP: Record<EtapaLead, string> = {
  novo: "NOVO", atendimento: "EM_ATENDIMENTO", visita: "VISITA",
  proposta: "PROPOSTA", fechado: "FECHADO", perdido: "PERDIDO",
};

function rowToLead(r: LeadRow): Lead {
  return {
    id:             String(r.id),
    nome:           String(r.name ?? ""),
    telefone:       String(r.phone ?? ""),
    email:          r.email ? String(r.email) : undefined,
    mensagem:       r.notes ? String(r.notes) : undefined,
    etapa:          ETAPA_MAP[String(r.status ?? "NOVO")] ?? "novo",
    canal:          (String(r.source ?? "outro")) as Lead["canal"],
    corretorId:     r.broker_id ? String(r.broker_id) : undefined,
    imovelSlug:     r.property_slug ? String(r.property_slug) : undefined,
    imovelNome:     r.property_title ? String(r.property_title) : undefined,
    criadoEm:       String(r.created_at ?? new Date().toISOString()),
    atualizadoEm:   String(r.updated_at ?? new Date().toISOString()),
  };
}

function leadToRow(l: Lead, agencyId: string) {
  return {
    id:         l.id,
    agency_id:  agencyId,
    broker_id:  l.corretorId ?? null,
    property_id: null,
    name:       l.nome,
    phone:      l.telefone,
    email:      l.email ?? null,
    notes:      l.mensagem ?? null,
    status:     ETAPA_RMAP[l.etapa] ?? "NOVO",
    updated_at: new Date().toISOString(),
  };
}

// ─── API pública ────────────────────────────────────────────────────────────

export async function buscarImoveis(): Promise<Imovel[]> {
  const rows = await get<PropRow>("properties",
    `agency_id=eq.${AGENCY_ID}&select=*&order=is_featured.desc,updated_at.desc`);
  return rows.map(rowToImovel);
}

export async function salvarImovel(i: Imovel): Promise<Imovel> {
  const row = imovelToRow(i, AGENCY_ID);
  // tenta upsert pelo id
  const existing = await get<PropRow>("properties", `id=eq.${i.id}&agency_id=eq.${AGENCY_ID}&select=id`);
  if (existing.length) {
    await patch("properties", `id=eq.${i.id}&agency_id=eq.${AGENCY_ID}`, row);
    return i;
  }
  const saved = await post<PropRow>("properties", { ...row, created_at: i.criadoEm });
  return rowToImovel(saved);
}

export async function buscarLeads(): Promise<Lead[]> {
  const rows = await get<LeadRow>("leads",
    `agency_id=eq.${AGENCY_ID}&select=*&order=created_at.desc`);
  return rows.map(rowToLead);
}

export async function salvarLead(l: Lead): Promise<Lead> {
  const row = leadToRow(l, AGENCY_ID);
  const existing = await get<LeadRow>("leads", `id=eq.${l.id}&agency_id=eq.${AGENCY_ID}&select=id`);
  if (existing.length) {
    await patch("leads", `id=eq.${l.id}&agency_id=eq.${AGENCY_ID}`, row);
    return l;
  }
  const saved = await post<LeadRow>("leads", { ...row, created_at: l.criadoEm });
  return rowToLead(saved);
}

export async function atualizarEtapaLead(id: string, etapa: EtapaLead): Promise<void> {
  await patch("leads", `id=eq.${id}&agency_id=eq.${AGENCY_ID}`,
    { status: ETAPA_RMAP[etapa], updated_at: new Date().toISOString() });
}
