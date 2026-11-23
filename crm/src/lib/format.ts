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
