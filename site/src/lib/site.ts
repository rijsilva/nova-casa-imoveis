// Dados institucionais da Nova Casa Imóveis.
export const site = {
  nome: "Nova Casa Imóveis",
  slogan: "Encontre o lar que você merece",
  creci: "000000-J", // TODO: confirmar CRECI
  url: "https://novacasaimoveis.com.br", // TODO: confirmar domínio
  email: "contato@novacasaimoveis.com.br", // TODO: confirmar e-mail
  endereco: "Paulínia/SP", // TODO: confirmar endereço
  mapsQuery: "Paulínia, SP",
  instagram: "https://instagram.com/novacasaimoveis", // TODO: confirmar
  horario: "Seg. a sex. das 9h às 18h · Sáb. das 9h às 13h",
};

/** Corretores da Nova Casa Imóveis */
export const corretores = {
  edjalma: {
    nome: "Edjalma Teixeira",
    whatsapp: "5519991405561",
    telefone: "(19) 99140-5561",
  },
  silvio: {
    nome: "Silvio",
    whatsapp: "5511964988496",
    telefone: "(11) 96498-8496",
  },
};

/** Link de WhatsApp padrão — usa o Edjalma como padrão. */
export function whatsappLink(mensagem?: string, corretor: keyof typeof corretores = "edjalma") {
  const c = corretores[corretor];
  const texto = mensagem ?? `Olá! Vim pelo site da Nova Casa Imóveis e gostaria de atendimento.`;
  return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/** Envia um evento para o dataLayer do GTM (sem efeito se o GTM não estiver ativo). */
export function evento(nome: string, dados: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  (w.dataLayer ??= []).push({ event: nome, ...dados });
}

export const nav = [
  { href: "/imoveis", label: "Todos os Imóveis" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];
