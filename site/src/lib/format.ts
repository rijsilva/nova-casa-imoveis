const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const BRLc = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

export const moeda = (v: number) => BRL.format(v);
export const moedaCurta = (v: number): string => {
  if (v >= 1_000_000) return BRLc.format(v / 1_000_000).replace(/,00$/, "") + "M";
  if (v >= 1_000) return BRLc.format(v / 1_000).replace(/,00$/, "") + "K";
  return BRL.format(v);
};
