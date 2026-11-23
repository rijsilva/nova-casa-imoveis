export type Finalidade = "venda" | "locacao";
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
  capa: string;
  galeria: string[];
  destaque: boolean;
  videoUrl?: string;
  /** Corretor que cadastrou o imóvel — define qual WhatsApp aparece no anúncio */
  corretorId?: string;
};
