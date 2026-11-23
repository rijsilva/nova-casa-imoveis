import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Avatar, Badge, PageHeader } from "@/components/ui";
import { canais, etapas, moeda, tempoRelativo } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { EtapaLead } from "@/lib/types";

const CORRETORES = [
  { id: "edjalma", nome: "Edjalma Teixeira" },
  { id: "silvio", nome: "Silvio" },
];

export function LeadDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const leads = useStore((s) => s.leads);
  const upsertLead = useStore((s) => s.upsertLead);
  const lead = leads.find((l) => l.id === id);
  const [obs, setObs] = useState(lead?.observacoes ?? "");
  const [salvando, setSalvando] = useState(false);

  if (!lead) {
    return (
      <div className="py-20 text-center">
        <p className="text-ink-500">Lead não encontrado.</p>
        <button className="btn-outline mt-4" onClick={() => navigate("/leads")}>Voltar</button>
      </div>
    );
  }

  async function mudarEtapa(etapa: EtapaLead) {
    setSalvando(true);
    // TODO: salvar no Supabase
    upsertLead({ ...lead!, etapa, atualizadoEm: new Date().toISOString() });
    setSalvando(false);
  }

  async function salvarObs() {
    setSalvando(true);
    // TODO: salvar no Supabase
    upsertLead({ ...lead!, observacoes: obs, atualizadoEm: new Date().toISOString() });
    setSalvando(false);
  }

  async function atribuir(corretorId: string) {
    // TODO: salvar no Supabase
    upsertLead({ ...lead!, corretorId, atualizadoEm: new Date().toISOString() });
  }

  const etapaAtual = etapas.find((e) => e.id === lead.etapa);

  return (
    <>
      <div className="mb-4">
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
      </div>

      <PageHeader titulo={lead.nome} descricao={`${canais[lead.canal]} · chegou ${tempoRelativo(lead.criadoEm)}`} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* DADOS */}
          <section className="panel p-5 space-y-3">
            <h2 className="font-bold">Dados do contato</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-ink-400">WhatsApp</dt><dd className="font-medium">{lead.telefone}</dd></div>
              {lead.email && <div><dt className="text-xs text-ink-400">E-mail</dt><dd className="font-medium">{lead.email}</dd></div>}
              {lead.imovelNome && <div><dt className="text-xs text-ink-400">Imóvel de interesse</dt><dd className="font-medium">{lead.imovelNome}</dd></div>}
              {lead.valorNegociacao && <div><dt className="text-xs text-ink-400">Valor em negociação</dt><dd className="font-medium font-display">{moeda(lead.valorNegociacao)}</dd></div>}
              <div><dt className="text-xs text-ink-400">Criado em</dt><dd className="font-medium">{new Date(lead.criadoEm).toLocaleString("pt-BR")}</dd></div>
              <div><dt className="text-xs text-ink-400">Atualizado</dt><dd className="font-medium">{tempoRelativo(lead.atualizadoEm)}</dd></div>
            </dl>
            {lead.mensagem && (
              <div>
                <p className="mb-1 text-xs text-ink-400">Mensagem inicial</p>
                <p className="rounded-xl bg-sand p-4 text-sm leading-relaxed">{lead.mensagem}</p>
              </div>
            )}
          </section>

          {/* OBSERVAÇÕES */}
          <section className="panel p-5 space-y-3">
            <h2 className="font-bold">Observações</h2>
            <textarea
              className="field resize-y"
              rows={5}
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Registre informações importantes sobre o atendimento…"
            />
            <div className="flex justify-end">
              <button className="btn-primary" onClick={salvarObs} disabled={salvando}>
                {salvando ? "Salvando…" : "Salvar observações"}
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          {/* ETAPA */}
          <section className="panel p-5">
            <h2 className="mb-3 font-bold">Etapa</h2>
            <div className="space-y-2">
              {etapas.map((e) => (
                <button
                  key={e.id}
                  disabled={salvando}
                  onClick={() => mudarEtapa(e.id as EtapaLead)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    lead.etapa === e.id ? "bg-brand text-white" : "hover:bg-sand text-ink-700"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${lead.etapa === e.id ? "bg-white" : e.cor}`} />
                  {e.label}
                </button>
              ))}
            </div>
          </section>

          {/* CORRETOR */}
          <section className="panel p-5">
            <h2 className="mb-3 font-bold">Corretor</h2>
            <div className="space-y-2">
              {CORRETORES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => atribuir(c.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    lead.corretorId === c.id ? "bg-brand-50 text-brand ring-1 ring-brand" : "hover:bg-sand text-ink-700"
                  }`}
                >
                  <Avatar nome={c.nome} className="h-7 w-7 text-xs" />
                  {c.nome}
                </button>
              ))}
            </div>
          </section>

          {/* WHATSAPP */}
          <a
            href={`https://wa.me/55${lead.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${lead.nome.split(" ")[0]}! Sou corretor da Nova Casa Imóveis.`)}`}
            target="_blank" rel="noopener"
            className="btn-primary w-full justify-center py-3"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
