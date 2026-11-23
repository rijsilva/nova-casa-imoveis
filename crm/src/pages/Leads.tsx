import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Avatar, Badge, Empty, PageHeader } from "@/components/ui";
import { canais, etapas, tempoRelativo } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Canal, EtapaLead } from "@/lib/types";
import clsx from "clsx";

export function Leads() {
  const leads = useStore((s) => s.leads);
  const usuarios = useStore((s) => s.usuarios);
  const [params] = useSearchParams();
  const [novo, setNovo] = useState(false);
  const [busca, setBusca] = useState("");
  const etapaFiltro = params.get("etapa") as EtapaLead | null;

  const lista = leads.filter((l) => {
    if (etapaFiltro && l.etapa !== etapaFiltro) return false;
    if (busca) {
      const q = busca.toLowerCase();
      return l.nome.toLowerCase().includes(q) || l.telefone.includes(q) || (l.imovelNome ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <>
      <PageHeader
        titulo="Leads"
        descricao="Todos os contatos recebidos"
        acoes={<button className="btn-primary" onClick={() => setNovo(true)}><Plus className="h-4 w-4" /> Novo lead</button>}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="field pl-9"
            placeholder="Buscar por nome, telefone ou imóvel…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/leads" className={clsx("btn-outline text-xs", !etapaFiltro && "bg-brand text-white border-brand")}>Todos</Link>
          {etapas.map((e) => (
            <Link key={e.id} to={`/leads?etapa=${e.id}`} className={clsx("btn-outline text-xs", etapaFiltro === e.id && "bg-brand text-white border-brand")}>{e.label}</Link>
          ))}
        </div>
      </div>

      <div className="panel overflow-hidden">
        {lista.length === 0
          ? <Empty mensagem="Nenhum lead encontrado." />
          : (
            <table className="w-full text-sm">
              <thead className="bg-paper">
                <tr>
                  <th className="th">Lead</th>
                  <th className="th">Interesse</th>
                  <th className="th">Etapa</th>
                  <th className="th">Corretor</th>
                  <th className="th">Atualizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {lista.map((l) => {
                  const etapa = etapas.find((e) => e.id === l.etapa);
                  const corretor = usuarios.find((u) => u.id === l.corretorId);
                  return (
                    <tr key={l.id} className="hover:bg-paper">
                      <td className="td">
                        <Link to={`/leads/${l.id}`} className="font-semibold hover:text-brand hover:underline">{l.nome}</Link>
                        <p className="text-xs text-ink-400">{l.telefone} · {canais[l.canal]}</p>
                      </td>
                      <td className="td text-ink-600">{l.imovelNome ?? "—"}</td>
                      <td className="td">
                        {etapa && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                            <span className={`h-1.5 w-1.5 rounded-full ${etapa.cor}`} />{etapa.label}
                          </span>
                        )}
                      </td>
                      <td className="td">
                        {corretor ? (
                          <div className="flex items-center gap-2">
                            <Avatar nome={corretor.nome} className="h-6 w-6 text-[10px]" />
                            <span className="text-xs">{corretor.nome.split(" ")[0]}</span>
                          </div>
                        ) : <span className="text-ink-400">—</span>}
                      </td>
                      <td className="td text-xs text-ink-400">{tempoRelativo(l.atualizadoEm)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
      </div>
      <NovoLeadModal aberto={novo} onFechar={() => setNovo(false)} />
    </>
  );
}

export function NovoLeadModal({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  const upsertLead = useStore((s) => s.upsertLead);
  const [enviando, setEnviando] = useState(false);

  if (!aberto) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    const d = new FormData(e.currentTarget);
    type CanalLead = "site" | "whatsapp" | "indicacao" | "outro";
    const lead: { id: string; nome: string; telefone: string; email?: string; mensagem?: string; etapa: "novo"; canal: CanalLead; criadoEm: string; atualizadoEm: string } = {
      id: crypto.randomUUID(),
      nome: String(d.get("nome") ?? "").trim(),
      telefone: String(d.get("telefone") ?? "").trim(),
      email: String(d.get("email") ?? "").trim() || undefined,
      mensagem: String(d.get("mensagem") ?? "").trim() || undefined,
      etapa: "novo" as const,
      canal: (d.get("canal") as CanalLead) ?? "outro",
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    // TODO: salvar no Supabase
    upsertLead(lead);
    setEnviando(false);
    onFechar();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onClick={onFechar}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-xl font-bold">Novo lead</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Nome *</label>
            <input name="nome" required className="field" placeholder="Nome do cliente" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">WhatsApp *</label>
              <input name="telefone" required className="field" placeholder="(19) 90000-0000" inputMode="tel" />
            </div>
            <div>
              <label className="label">Canal</label>
              <select name="canal" className="field">
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="site">Site</option>
                <option value="indicacao">Indicação</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">E-mail</label>
            <input name="email" type="email" className="field" placeholder="email@exemplo.com" />
          </div>
          <div>
            <label className="label">Mensagem / Interesse</label>
            <textarea name="mensagem" rows={2} className="field resize-none" placeholder="O que o cliente procura?" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-ghost" onClick={onFechar}>Cancelar</button>
            <button type="submit" disabled={enviando} className="btn-primary">{enviando ? "Salvando…" : "Salvar lead"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
