import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Plus } from "lucide-react";
import { Avatar, Empty, PageHeader, Stat } from "@/components/ui";
import { canais, etapas, tempoRelativo } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Lead } from "@/lib/types";
import { NovoLeadModal } from "./Leads";

const DIA = 86400000;

export function Inicio() {
  const leads = useStore((s) => s.leads);
  const usuarios = useStore((s) => s.usuarios);
  const [novo, setNovo] = useState(false);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const mes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const d = useMemo(() => {
    const ativos = leads.filter((l) => !["fechado", "perdido"].includes(l.etapa));
    const emAtendimento = leads.filter((l) => l.etapa === "atendimento");
    const novos = leads.filter((l) => l.etapa === "novo").sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));
    const parados = ativos.filter((l) => l.etapa !== "novo" && Date.now() - new Date(l.atualizadoEm).getTime() > 3 * DIA)
      .sort((a, b) => a.atualizadoEm.localeCompare(b.atualizadoEm));
    const fechadosMes = leads.filter((l) => l.etapa === "fechado" && new Date(l.atualizadoEm) >= mes).length;
    const totalLeads = leads.length;
    return { ativos, emAtendimento, novos, parados, fechadosMes, totalLeads };
  }, [leads]); // eslint-disable-line react-hooks/exhaustive-deps

  const nomeUsuario = (id?: string) => usuarios.find((u) => u.id === id)?.nome ?? "—";

  return (
    <>
      <PageHeader
        titulo="Painel"
        descricao="Visão geral dos leads e atendimentos"
        acoes={<button className="btn-primary" onClick={() => setNovo(true)}><Plus className="h-4 w-4" /> Novo lead</button>}
      />

      {/* MÉTRICAS SIMPLIFICADAS */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Total de leads" valor={d.totalLeads} detalhe="Todos os cadastros" />
        <Stat label="Em atendimento" valor={d.emAtendimento.length} detalhe="Leads com contato iniciado" destaque />
        <Stat label="Fechamentos no mês" valor={d.fechadosMes} detalhe={`${hoje.toLocaleString("pt-BR", { month: "long", year: "numeric" })}`} />
      </div>

      {/* BARRA DE ETAPAS */}
      <div className="mb-6 panel p-1.5">
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
          {etapas.map((e) => {
            const n = leads.filter((l) => l.etapa === e.id).length;
            return (
              <Link key={e.id} to={`/leads?etapa=${e.id}`} className="rounded-lg px-3 py-2.5 hover:bg-sand">
                <span className="flex items-center gap-1.5 text-xs text-ink-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${e.cor}`} />
                  {e.label}
                </span>
                <span className="font-display text-xl font-bold">{n}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ListaLeads
          titulo="Aguardando primeiro contato"
          vazio="Nenhum lead novo. Tudo em dia!"
          leads={d.novos.slice(0, 8)}
          total={d.novos.length}
          link="/leads?etapa=novo"
          usuarios={usuarios}
          tempo={(l) => `chegou ${tempoRelativo(l.criadoEm)}`}
        />
        <ListaLeads
          titulo="Sem movimentação há mais de 3 dias"
          vazio="Nenhum lead parado."
          leads={d.parados.slice(0, 8)}
          total={d.parados.length}
          link="/leads"
          usuarios={usuarios}
          tempo={(l) => `última ação ${tempoRelativo(l.atualizadoEm)}`}
          icone
        />
      </div>

      <NovoLeadModal aberto={novo} onFechar={() => setNovo(false)} />
    </>
  );
}

function ListaLeads({ titulo, leads, total, vazio, link, usuarios, tempo, icone }: {
  titulo: string; leads: Lead[]; total: number; vazio: string; link: string;
  usuarios: { id: string; nome: string }[]; tempo: (l: Lead) => string; icone?: boolean;
}) {
  return (
    <section className="panel">
      <header className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="flex items-center gap-2 text-base font-bold">
          {icone && <AlertTriangle className="h-4 w-4 text-warn" />}
          {titulo}
          <span className="text-sm font-semibold text-ink-400">{total}</span>
        </h2>
        <Link to={link} className="text-xs font-semibold text-ink-600 hover:text-ink">
          Ver todos <ArrowRight className="inline h-3 w-3" />
        </Link>
      </header>
      {leads.length === 0
        ? <Empty mensagem={vazio} />
        : (
          <ul className="divide-y divide-line">
            {leads.map((l) => {
              const c = usuarios.find((u) => u.id === l.corretorId);
              return (
                <li key={l.id}>
                  <Link to={`/leads/${l.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-paper">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{l.nome}</p>
                      <p className="truncate text-xs text-ink-500">{l.imovelNome ?? canais[l.canal]} · {tempo(l)}</p>
                    </div>
                    <span className="badge-muted shrink-0">{canais[l.canal]}</span>
                    {c && <Avatar nome={c.nome} className="h-6 w-6 text-[10px]" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
    </section>
  );
}
