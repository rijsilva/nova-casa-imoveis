import Link from "next/link";
import { Bath, BedDouble, Car, MapPin, Ruler } from "lucide-react";
import type { Imovel } from "@/lib/types";
import { moeda } from "@/lib/format";
import { Photo } from "./Photo";

export function ImovelCard({ i }: { i: Imovel }) {
  return (
    <Link href={`/imoveis/${i.slug}`} className="card group flex flex-col transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3]">
        <Photo src={i.capa} alt={i.titulo} className="absolute inset-0 h-full w-full transition duration-500 group-hover:scale-[1.03]" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${i.finalidade === "venda" ? "bg-brand" : "bg-gold"}`}>
          {i.finalidade === "venda" ? "Venda" : "Locação"}
        </span>
        <span className="absolute bottom-4 left-4 rounded-md bg-ink/80 px-2 py-1 font-mono text-[11px] text-white">{i.ref}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-xl font-bold text-ink">
          {moeda(i.preco)}{i.finalidade === "locacao" && <span className="text-sm font-medium text-ink-400">/mês</span>}
        </p>
        <h3 className="mt-1 line-clamp-1 font-semibold">{i.titulo}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500"><MapPin className="h-3.5 w-3.5" />{i.bairro} · {i.cidade}</p>
        <div className="mt-auto flex gap-4 border-t border-line pt-4 text-sm text-ink-600" style={{ marginTop: "1.25rem" }}>
          {i.dormitorios > 0 && <span className="inline-flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-ink-400" />{i.dormitorios}</span>}
          <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4 text-ink-400" />{i.banheiros}</span>
          <span className="inline-flex items-center gap-1.5"><Car className="h-4 w-4 text-ink-400" />{i.vagas}</span>
          <span className="inline-flex items-center gap-1.5"><Ruler className="h-4 w-4 text-ink-400" />{i.areaUtil} m²</span>
        </div>
      </div>
    </Link>
  );
}
