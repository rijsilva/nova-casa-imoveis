export type Papel = "admin" | "corretor";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  whatsapp: string;
  ativo: boolean;
  criadoEm: string;
};

export type EtapaLead = "novo" | "atendimento" | "visita" | "proposta" | "fechado" | "perdido";
export type Canal = "site" | "whatsapp" | "instagram" | "indicacao" | "outro";
export type Finalidade = "venda" | "locacao";

export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  mensagem?: string;
  etapa: EtapaLead;
  canal: Canal;
  finalidade?: Finalidade;
  corretorId?: string;
  imovelSlug?: string;
  imovelNome?: string;
  valorNegociacao?: number;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type TipoImovel = "Apartamento" | "Casa" | "Casa em condomínio" | "Terreno" | "Sala comercial" | "Sobrado";

export type Imovel = {
  id: string;
  slug: string;
  ref: string;
  titulo: string;
  finalidade: Finalidade;
  tipo: TipoImovel;
  cidade: string;
  bairro: string;
  preco: number;
  condominio?: number;
  iptu?: number;
  dormitorios: number;
  suites: number;
  banheiros: number;
  vagas: number;
  areaUtil: number;
  areaTotal?: number;
  descricao: string;
  caracteristicas: string[];
  fotos: string[]; // URLs do Cloudinary
  videoUrl?: string; // URL do YouTube
  destaque: boolean;
  publicado: boolean;
  corretorId: string; // define qual WhatsApp aparece no anúncio
  criadoEm: string;
  atualizadoEm: string;
};
