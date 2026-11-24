const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const moeda = (v: number) => BRL.format(v);
export const moedaCurta = (v: number): string => {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (v >= 1_000) return `R$${Math.round(v / 1_000)}K`;
  return BRL.format(v);
};

export const tempoRelativo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min atrás`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d atrás`;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

export const etapas: { id: string; label: string; cor: string }[] = [
  { id: "novo", label: "Novo", cor: "bg-blue-400" },
  { id: "atendimento", label: "Em atendimento", cor: "bg-indigo-400" },
  { id: "visita", label: "Visita agendada", cor: "bg-violet-400" },
  { id: "proposta", label: "Proposta", cor: "bg-amber-400" },
  { id: "fechado", label: "Fechado", cor: "bg-green-500" },
  { id: "perdido", label: "Perdido", cor: "bg-red-400" },
];

export const canais: Record<string, string> = {
  site: "Site",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  indicacao: "Indicação",
  outro: "Outro",
};

export const soDigitos = (s: string) => s.replace(/\D/g, "");

export const dataBR = (iso: string) => new Date(iso.length === 10 ? iso + "T12:00:00" : iso).toLocaleDateString("pt-BR");

export const tamanhoArquivo = (b: number) =>
  b >= 1048576 ? `${(b / 1048576).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;

export const cepFormatado = (c: string) => { const d = c.replace(/\D/g, ""); return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : c; };

export const telefoneBR = (s: string) => {
  const d = soDigitos(s).slice(-11);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return s;
};

export function slugify(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const novoId = () => crypto.randomUUID();
