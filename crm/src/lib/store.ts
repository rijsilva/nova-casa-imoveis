import { create } from "zustand";
import type { EtapaLead, Imovel, Lead, Usuario } from "./types";
import { atualizarEtapaLead, buscarImoveis, buscarLeads, excluirImovel, salvarImovel, salvarLead } from "./api";

type Store = {
  leads: Lead[];
  imoveis: Imovel[];
  usuarios: Usuario[];
  sessaoId: string | null;
  carregando: boolean;
  erro: string | null;

  carregar: () => Promise<void>;
  upsertLead: (lead: Lead) => Promise<void>;
  upsertImovel: (imovel: Imovel) => Promise<boolean>;
  removerImovel: (id: string) => Promise<boolean>;
  moverEtapa: (id: string, etapa: EtapaLead) => Promise<void>;

  // setters locais (para compatibilidade)
  setLeads: (leads: Lead[]) => void;
  setImoveis: (imoveis: Imovel[]) => void;
  setUsuarios: (usuarios: Usuario[]) => void;
  setSessaoId: (id: string | null) => void;
};

export const useStore = create<Store>((set, get) => ({
  leads: [],
  imoveis: [],
  usuarios: [],
  sessaoId: null,
  carregando: false,
  erro: null,

  setLeads: (leads) => set({ leads }),
  setImoveis: (imoveis) => set({ imoveis }),
  setUsuarios: (usuarios) => set({ usuarios }),
  setSessaoId: (sessaoId) => set({ sessaoId }),

  carregar: async () => {
    set({ carregando: true, erro: null });
    try {
      const [leads, imoveis] = await Promise.all([buscarLeads(), buscarImoveis()]);
      set({ leads, imoveis, carregando: false });
    } catch (e) {
      set({ carregando: false, erro: String(e) });
    }
  },

  upsertLead: async (lead) => {
    // otimista: atualiza local imediatamente
    set((s) => ({
      leads: s.leads.some((l) => l.id === lead.id)
        ? s.leads.map((l) => (l.id === lead.id ? lead : l))
        : [lead, ...s.leads],
    }));
    await salvarLead(lead);
  },

  upsertImovel: async (imovel) => {
    set((s) => ({
      imoveis: s.imoveis.some((i) => i.id === imovel.id)
        ? s.imoveis.map((i) => (i.id === imovel.id ? imovel : i))
        : [imovel, ...s.imoveis],
    }));
    try { await salvarImovel(imovel); return true; } catch { return false; }
  },

  removerImovel: async (id) => {
    try {
      await excluirImovel(id);
      set((s) => ({ imoveis: s.imoveis.filter((i) => i.id !== id) }));
      return true;
    } catch { return false; }
  },

  moverEtapa: async (id, etapa) => {
    set((s) => ({
      leads: s.leads.map((l) =>
        l.id === id ? { ...l, etapa, atualizadoEm: new Date().toISOString() } : l
      ),
    }));
    await atualizarEtapaLead(id, etapa);
  },
}));

// Carrega dados ao inicializar se o banco estiver configurado
const { carregar } = useStore.getState();
if (import.meta.env.VITE_NOVA_CASA_AGENCY_ID) carregar();
