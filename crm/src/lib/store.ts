import { create } from "zustand";
import type { Imovel, Lead, Usuario } from "./types";

type Store = {
  leads: Lead[];
  imoveis: Imovel[];
  usuarios: Usuario[];
  setLeads: (leads: Lead[]) => void;
  setImoveis: (imoveis: Imovel[]) => void;
  setUsuarios: (usuarios: Usuario[]) => void;
  upsertLead: (lead: Lead) => void;
  upsertImovel: (imovel: Imovel) => void;
};

export const useStore = create<Store>((set) => ({
  leads: [],
  imoveis: [],
  usuarios: [],
  setLeads: (leads) => set({ leads }),
  setImoveis: (imoveis) => set({ imoveis }),
  setUsuarios: (usuarios) => set({ usuarios }),
  upsertLead: (lead) => set((s) => ({
    leads: s.leads.some((l) => l.id === lead.id)
      ? s.leads.map((l) => l.id === lead.id ? lead : l)
      : [lead, ...s.leads],
  })),
  upsertImovel: (imovel) => set((s) => ({
    imoveis: s.imoveis.some((i) => i.id === imovel.id)
      ? s.imoveis.map((i) => i.id === imovel.id ? imovel : i)
      : [imovel, ...s.imoveis],
  })),
}));
