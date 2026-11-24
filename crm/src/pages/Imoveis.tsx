import { Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Plus, Search } from "lucide-react";
import { Badge, PageHeader, Segmentado, Vazio } from "@/components/ui";
import { moeda, tempoRelativo } from "@/lib/format";
import { useStore } from "@/lib/store";

export function Imoveis() {
  const imoveis = useStore((s) => s.imoveis);
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const fin = (params.get("finalidade") ?? "") as "" | "venda" | "locacao";
  const prop = params.get("proprietario") ?? "";
  const setParam = (k: string, v: string) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true }); };

  const lista = imoveis.filter((i) =>
    (!fin || i.finalidade === fin) &&
    (!q || [i.titulo, i.ref, i.bairro, i.cidade, i.tipo].some((x) => x.toLowerCase().includes(q.toLowerCase()))) &&
    (!prop || (i.proprietarioNome ?? "").toLowerCase().includes(prop.toLowerCase()) || (i.proprietarioTelefone ?? "").includes(prop))
  );

  return (
    <>
      <PageHeader
        titulo="Imóveis"
        descricao="Imóveis prontos para venda e locação."
        acoes={<Link to="/imoveis/novo" className="btn-primary"><Plus className="h-4 w-4" /> Novo imóvel</Link>}
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="field pl-9" placeholder="Ref., título, bairro ou tipo" value={q} onChange={(e) => setParam("q", e.target.value)} />
        </div>
        <Segmentado valor={fin} onChange={(v) => setParam("finalidade", v)} opcoes={[{ v: "", label: "Todos" }, { v: "venda", label: "Venda" }, { v: "locacao", label: "Locação" }]} />
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="field pl-9" placeholder="Buscar por proprietário" value={prop} onChange={(e) => setParam("proprietario", e.target.value)} />
        </div>
      </div>

      {lista.length === 0 ? <Vazio titulo="Nenhum imóvel encontrado" /> : (
        <div className="panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-paper">
              <tr>
                <th className="th">Imóvel</th>
                <th className="th">Finalidade</th>
                <th className="th">Valor</th>
                <th className="th">Dorms</th>
                <th className="th">Área</th>
                <th className="th">Proprietário</th>
                <th className="th">Site</th>
                <th className="th">Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {lista.map((i) => (
                <tr key={i.id} className="hover:bg-paper">
                  <td className="td">
                    <Link to={`/imoveis/${i.id}`} className="flex items-center gap-3">
                      <span className="h-11 w-16 shrink-0 overflow-hidden rounded-md bg-sand">{i.fotos[0] && <img src={i.fotos[0]} alt="" className="h-full w-full object-cover" />}</span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[11px] text-ink-500">{i.ref}</span>
                        <span className="block truncate font-semibold hover:underline">{i.titulo || "Imóvel sem título"}</span>
                        <span className="block text-xs text-ink-500">{i.bairro} · {i.cidade}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="td">{i.finalidade === "venda" ? <Badge>Venda</Badge> : <Badge tom="info">Locação</Badge>}</td>
                  <td className="td tabular font-semibold">{moeda(i.preco)}{i.finalidade === "locacao" && <span className="font-normal text-ink-500">/mês</span>}</td>
                  <td className="td tabular">{i.dormitorios}</td>
                  <td className="td tabular">{i.areaUtil} m²</td>
                  <td className="td">
                    {i.proprietarioNome
                      ? <span className="block truncate max-w-[140px]" title={i.proprietarioNome}>{i.proprietarioNome}</span>
                      : <span className="text-ink-400">—</span>}
                  </td>
                  <td className="td">{i.publicado ? <Badge tom="ok"><Eye className="h-3 w-3" />No site</Badge> : <Badge><EyeOff className="h-3 w-3" />Rascunho</Badge>}</td>
                  <td className="td whitespace-nowrap text-ink-500">{tempoRelativo(i.atualizadoEm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
