import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Video } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { Finalidade, Imovel, TipoImovel } from "@/lib/types";

const TIPOS: TipoImovel[] = ["Apartamento", "Casa", "Casa em condomínio", "Sobrado", "Terreno", "Sala comercial"];

const CORRETORES = [
  { id: "edjalma", nome: "Edjalma Teixeira" },
  { id: "silvio", nome: "Silvio" },
];

export function ImovelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const imoveis = useStore((s) => s.imoveis);
  const upsertImovel = useStore((s) => s.upsertImovel);
  const existente = id ? imoveis.find((i) => i.id === id) : undefined;

  const [finalidade, setFinalidade] = useState<Finalidade>(existente?.finalidade ?? "venda");
  const [tipo, setTipo] = useState<TipoImovel>(existente?.tipo ?? "Apartamento");
  const [corretorId, setCorretorId] = useState(existente?.corretorId ?? "edjalma");
  const [caracteristicas, setCaracteristicas] = useState<string[]>(existente?.caracteristicas ?? []);
  const [novaCaract, setNovaCaract] = useState("");
  const [fotos, setFotos] = useState<string[]>(existente?.fotos ?? []);
  const [videoUrl, setVideoUrl] = useState(existente?.videoUrl ?? "");
  const [enviando, setEnviando] = useState(false);

  function addCaracteristica() {
    const v = novaCaract.trim();
    if (v && !caracteristicas.includes(v)) { setCaracteristicas([...caracteristicas, v]); setNovaCaract(""); }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    const d = new FormData(e.currentTarget);
    const campo = (k: string) => String(d.get(k) ?? "").trim();
    const num = (k: string) => Number(campo(k)) || 0;
    const optNum = (k: string) => { const v = Number(campo(k)); return v > 0 ? v : undefined; };

    const titulo = campo("titulo");
    const slug = titulo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

    const imovel: Imovel = {
      id: existente?.id ?? crypto.randomUUID(),
      slug: existente?.slug ?? slug,
      ref: campo("ref") || `CN-${Date.now().toString(36).toUpperCase()}`,
      titulo,
      finalidade,
      tipo,
      cidade: campo("cidade"),
      bairro: campo("bairro"),
      preco: num("preco"),
      condominio: optNum("condominio"),
      iptu: optNum("iptu"),
      dormitorios: num("dormitorios"),
      suites: num("suites"),
      banheiros: num("banheiros"),
      vagas: num("vagas"),
      areaUtil: num("areaUtil"),
      areaTotal: optNum("areaTotal"),
      descricao: campo("descricao"),
      caracteristicas,
      fotos,
      videoUrl: videoUrl.trim() || undefined,
      destaque: d.get("destaque") === "on",
      publicado: d.get("publicado") === "on",
      corretorId,
      criadoEm: existente?.criadoEm ?? new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    // TODO: salvar no Supabase + Cloudinary para fotos
    upsertImovel(imovel);
    setEnviando(false);
    navigate("/imoveis");
  }

  return (
    <>
      <PageHeader titulo={existente ? "Editar imóvel" : "Novo imóvel"} />
      <form onSubmit={onSubmit} className="space-y-6 pb-20">

        {/* IDENTIFICAÇÃO */}
        <section className="panel p-6 space-y-4">
          <h2 className="text-base font-bold">Identificação</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Título *</label>
              <input name="titulo" required defaultValue={existente?.titulo} className="field" placeholder="Ex.: Apartamento 2 quartos no centro" />
            </div>
            <div>
              <label className="label">Referência (Ref.)</label>
              <input name="ref" defaultValue={existente?.ref} className="field" placeholder="Ex.: CN-001" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Finalidade *</label>
              <select value={finalidade} onChange={(e) => setFinalidade(e.target.value as Finalidade)} className="field">
                <option value="venda">Venda</option>
                <option value="locacao">Locação</option>
              </select>
            </div>
            <div>
              <label className="label">Tipo *</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoImovel)} className="field">
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Corretor responsável *</label>
              <select value={corretorId} onChange={(e) => setCorretorId(e.target.value)} className="field">
                {CORRETORES.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
              <p className="mt-1 text-xs text-ink-400">O WhatsApp deste corretor aparece no anúncio.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Cidade *</label>
              <input name="cidade" required defaultValue={existente?.cidade} className="field" placeholder="Ex.: Paulínia" />
            </div>
            <div>
              <label className="label">Bairro *</label>
              <input name="bairro" required defaultValue={existente?.bairro} className="field" placeholder="Ex.: Centro" />
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="panel p-6 space-y-4">
          <h2 className="text-base font-bold">Valores</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">{finalidade === "locacao" ? "Aluguel (R$/mês) *" : "Preço de venda (R$) *"}</label>
              <input name="preco" type="number" required min={0} defaultValue={existente?.preco} className="field" placeholder="0" />
            </div>
            <div>
              <label className="label">Condomínio (R$/mês)</label>
              <input name="condominio" type="number" min={0} defaultValue={existente?.condominio} className="field" placeholder="0" />
            </div>
            <div>
              <label className="label">IPTU (R$/ano)</label>
              <input name="iptu" type="number" min={0} defaultValue={existente?.iptu} className="field" placeholder="0" />
            </div>
          </div>
        </section>

        {/* CARACTERÍSTICAS */}
        <section className="panel p-6 space-y-4">
          <h2 className="text-base font-bold">Características</h2>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "dormitorios", label: "Dormitórios" },
              { name: "suites", label: "Suítes" },
              { name: "banheiros", label: "Banheiros" },
              { name: "vagas", label: "Vagas" },
              { name: "areaUtil", label: "Área útil (m²)" },
              { name: "areaTotal", label: "Área total (m²)" },
            ].map((f) => (
              <div key={f.name}>
                <label className="label">{f.label}</label>
                <input name={f.name} type="number" min={0} defaultValue={(existente as Record<string, unknown>)?.[f.name] as number} className="field" placeholder="0" />
              </div>
            ))}
          </div>
        </section>

        {/* DESCRIÇÃO */}
        <section className="panel p-6 space-y-4">
          <h2 className="text-base font-bold">Descrição</h2>
          <div>
            <label className="label">Descrição do imóvel</label>
            <textarea name="descricao" rows={5} defaultValue={existente?.descricao} className="field resize-y" placeholder="Descreva o imóvel, sua localização e diferenciais…" />
          </div>
          <div>
            <label className="label">Itens e diferenciais</label>
            <div className="flex gap-2">
              <input
                className="field flex-1"
                placeholder="Ex.: Churrasqueira, Piscina…"
                value={novaCaract}
                onChange={(e) => setNovaCaract(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCaracteristica(); } }}
              />
              <button type="button" className="btn-outline" onClick={addCaracteristica}><Plus className="h-4 w-4" /></button>
            </div>
            {caracteristicas.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {caracteristicas.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand">
                    {c}
                    <button type="button" onClick={() => setCaracteristicas(caracteristicas.filter((x) => x !== c))} aria-label={`Remover ${c}`}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FOTOS E VÍDEO */}
        <section className="panel p-6 space-y-4">
          <h2 className="text-base font-bold">Fotos e vídeo</h2>
          <div>
            <label className="label">Fotos (URLs do Cloudinary)</label>
            <p className="mb-2 text-xs text-ink-400">Após conectar o Cloudinary, aqui aparecerá o upload. Por enquanto insira as URLs manualmente.</p>
            {fotos.map((url, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  className="field flex-1"
                  value={url}
                  onChange={(e) => setFotos(fotos.map((f, j) => j === i ? e.target.value : f))}
                  placeholder="https://res.cloudinary.com/…"
                />
                <button type="button" className="btn-outline text-red-500" onClick={() => setFotos(fotos.filter((_, j) => j !== i))} aria-label="Remover foto">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" className="btn-outline mt-1" onClick={() => setFotos([...fotos, ""])}>
              <Plus className="h-4 w-4" /> Adicionar foto
            </button>
          </div>

          <div>
            <label className="label flex items-center gap-1.5"><Video className="h-4 w-4 text-red-600" /> Link do vídeo no YouTube</label>
            <input
              className="field"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
            />
            <p className="mt-1 text-xs text-ink-400">O vídeo aparecerá como tour virtual na página do imóvel.</p>
          </div>
        </section>

        {/* PUBLICAÇÃO */}
        <section className="panel p-6 space-y-3">
          <h2 className="text-base font-bold">Publicação</h2>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="publicado" defaultChecked={existente?.publicado ?? true} className="accent-brand h-4 w-4" />
            <span>Publicado no site</span>
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="destaque" defaultChecked={existente?.destaque} className="accent-brand h-4 w-4" />
            <span>Marcar como destaque (aparece primeiro)</span>
          </label>
        </section>

        <div className="flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={() => navigate("/imoveis")}>Cancelar</button>
          <button type="submit" disabled={enviando} className="btn-primary px-8">
            {enviando ? "Salvando…" : "Salvar imóvel"}
          </button>
        </div>
      </form>
    </>
  );
}
