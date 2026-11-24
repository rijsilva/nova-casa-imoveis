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

export type Endereco = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type Documento = {
  id: string;
  nome: string;
  url: string;
  tamanho: number;
  enviadoEm: string;
};

export type Imovel = {
  id: string;
  slug: string;
  ref: string;
  titulo: string;
  finalidade: Finalidade;
  tipo: TipoImovel;
  endereco: Endereco;
  ocultarEndereco: boolean;
  cidade: string;
  bairro: string;
  nomeCondominio?: string;
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
  fotos: string[];
  documentos: Documento[];
  videoUrl?: string;
  destaque: boolean;
  publicado: boolean;
  corretorId: string;
  proprietarioNome?: string;
  proprietarioTelefone?: string;
  criadoEm: string;
  atualizadoEm: string;
};
