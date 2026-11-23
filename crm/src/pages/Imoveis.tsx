import { Link } from "react-router-dom";
import { Edit2, Eye, EyeOff, Plus, Star } from "lucide-react";
import { Empty, PageHeader } from "@/components/ui";
import { moeda } from "@/lib/format";
import { useStore } from "@/lib/store";

const CORRETORES: Record<string, string> = {
  edjalma: "Edjalma",
  silvio: "Silvio",
};

export function Imoveis() {
  const imoveis = useStore((s) => s.imoveis);

  return (
    <>
      <PageHeader
        titulo="Imóveis"
        descricao="Gestão do catálogo publicado no site"
        acoes={
          <Link to="/imoveis/novo" className="btn-primary">
            <Plus className="h-4 w-4" /> Novo imóvel
          </Link>
        }
      />

      <div className="panel overflow-hidden">
        {imoveis.length === 0
          ? <Empty mensagem="Nenhum imóvel cadastrado. Clique em + Novo imóvel para começar." />
          : (
            <table className="w-full text-sm">
              <thead className="bg-paper">
                <tr>
                  <th className="th">Imóvel</th>
                  <th className="th">Finalidade</th>
                  <th className="th">Preço</th>
                  <th className="th">Corretor</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {imoveis.map((i) => (
                  <tr key={i.id} className="hover:bg-paper">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        {i.fotos[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={i.fotos[0]} alt={i.titulo} className="h-10 w-14 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="font-semibold">{i.titulo}</p>
                          <p className="text-xs text-ink-400">{i.ref} · {i.bairro}, {i.cidade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td">
                      <span className={`badge-muted ${i.finalidade === "venda" ? "text-brand" : "text-gold"}`}>
                        {i.finalidade === "venda" ? "Venda" : "Locação"}
                      </span>
                    </td>
                    <td className="td font-semibold">{moeda(i.preco)}{i.finalidade === "locacao" && "/mês"}</td>
                    <td className="td text-ink-600">{CORRETORES[i.corretorId] ?? i.corretorId}</td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        {i.publicado
                          ? <span className="badge-active flex items-center gap-1"><Eye className="h-3 w-3" /> Publicado</span>
                          : <span className="badge-muted flex items-center gap-1"><EyeOff className="h-3 w-3" /> Rascunho</span>}
                        {i.destaque && <Star className="h-4 w-4 text-gold fill-gold" />}
                      </div>
                    </td>
                    <td className="td text-right">
                      <Link to={`/imoveis/${i.id}`} className="btn-ghost">
                        <Edit2 className="h-4 w-4" /> Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </>
  );
}
