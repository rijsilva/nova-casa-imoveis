import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, FileClock, Globe, Lock } from "lucide-react";
import clsx from "clsx";
import { DocumentosEditor } from "@/components/DocumentosEditor";
import { EnderecoForm, enderecoVazio, validarEndereco } from "@/components/EnderecoForm";
import { AlertaErros, Etapas, NavEtapas, erroDe, type ErroCampo } from "@/components/Etapas";
import { FotosEditor } from "@/components/FotosEditor";
import { ExcluirFicha } from "@/components/ExcluirFicha";
import { Campo, ListaTextos, Toggle, Vazio } from "@/components/ui";
import { usePode } from "@/lib/auth";
import { cepFormatado, moeda, novoId, slugify, soDigitos } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Endereco, Finalidade, Imovel, TipoImovel } from "@/lib/types";
import { InputMoeda } from "@/components/InputMoeda";

const ETAPAS = ["Informações básicas", "Endereço", "Comodidades", "Fotos e documentos", "Finalização"];
const TIPOS: TipoImovel[] = ["Apartamento", "Casa", "Casa em condomínio", "Terreno", "Sala comercial", "Sobrado"];
const COMODIDADES = [
  "Piscina", "Academia", "Churrasqueira", "Espaço gourmet", "Salão de festas", "Playground", "Portaria 24h", "Elevador",
  "Ar-condicionado", "Armários planejados", "Varanda", "Área de serviço", "Quintal", "Aceita pet", "Mobiliado", "Energia solar",
];

function proximaRef(finalidade: Finalidade, imoveis: Imovel[]) {
  const base = finalidade === "venda" ? 1000 : 2000;
  const nums = imoveis.map((i) => Number(i.ref.replace(/\D/g, ""))).filter((n) => n >= base && n < base + 1000);
  return `CN-${Math.max(base, ...nums) + 1}`;
}

function validar(i: Imovel): ErroCampo[] {
  const e: ErroCampo[] = [];
  const add = (etapa: number, campo: string, msg: string) => e.push({ etapa, campo, msg });
  if (i.titulo.trim().length < 10) add(0, "Título", i.titulo.trim() ? "Use pelo menos 10 caracteres" : "Campo obrigatório");
  if (!i.preco || i.preco <= 0) add(0, i.finalidade === "locacao" ? "Valor do aluguel" : "Valor de venda", "Informe um valor maior que zero");
  if (!i.areaUtil || i.areaUtil <= 0) add(0, "Área útil", "Informe a área em m²");
  if (i.areaTotal && i.areaTotal < i.areaUtil) add(0, "Área total", "Não pode ser menor que a área útil");
  if (i.suites > i.dormitorios) add(0, "Suítes", "Não pode ser maior que o número de dormitórios");
  if (i.tipo !== "Terreno" && i.banheiros < 1) add(0, "Banheiros", "Informe ao menos 1 banheiro");
  if (i.tipo === "Casa em condomínio" && !i.nomeCondominio?.trim()) add(0, "Nome do condomínio", "Obrigatório para casa em condomínio");
  if (i.proprietarioTelefone && ![10, 11].includes(soDigitos(i.proprietarioTelefone).length)) add(0, "Telefone do proprietário", "Telefone inválido (DDD + número)");
  const rotulos: Record<keyof Endereco, string> = { cep: "CEP", logradouro: "Logradouro", numero: "Número", complemento: "Complemento", bairro: "Bairro", cidade: "Cidade", uf: "UF" };
  Object.entries(validarEndereco(i.endereco)).forEach(([k, msg]) => add(1, rotulos[k as keyof Endereco], msg!));
  if (i.fotos.length === 0) add(3, "Fotos", "Adicione ao menos 1 foto para publicar no site");
  if (i.videoUrl && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(i.videoUrl)) add(3, "Vídeo", "Use um link do YouTube");
  return e;
}

export function ImovelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const imoveis = useStore((s) => s.imoveis);
  const existente = useStore((s) => s.imoveis.find((i) => i.id === id));
  const upsertImovel = useStore((s) => s.upsertImovel);
  const removerImovel = useStore((s) => s.removerImovel);
  const editar = usePode("editarCatalogo");
  const [etapa, setEtapa] = useState(0);
  const [tentou, setTentou] = useState(false);
  const [salvo, setSalvo] = useState<null | "rascunho" | "publicado">(null);
  const [salvando, setSalvando] = useState(false);
  const [imovel, setImovel] = useState<Imovel>(() => existente ?? {
    id: novoId(), ref: proximaRef("venda", imoveis), slug: "", titulo: "", finalidade: "venda", tipo: "Apartamento",
    endereco: enderecoVazio(), ocultarEndereco: true, cidade: "", bairro: "",
    preco: 0, dormitorios: 2, suites: 0, banheiros: 1, vagas: 1, areaUtil: 0, descricao: "", caracteristicas: [], fotos: [], documentos: [],
    publicado: false, destaque: false, corretorId: "", atualizadoEm: new Date().toISOString(), criadoEm: new Date().toISOString(),
  });
  const erros = useMemo(() => validar(imovel), [imovel]);

  if (id && !existente) return <Vazio titulo="Imóvel não encontrado" acao={<Link to="/imoveis" className="btn-secondary">Voltar</Link>} />;

  const set = <K extends keyof Imovel>(k: K, v: Imovel[K]) => { setImovel((x) => ({ ...x, [k]: v })); setSalvo(null); };
  const err = (campo: string) => erroDe(erros, tentou, campo);
  const cls = (campo: string) => clsx("field tabular", tentou && erros.some((e) => e.campo === campo) && "border-red-400");
  const num = (k: keyof Imovel, campo: string, opcional = false) => ({
    className: cls(campo), type: "number", min: 0, inputMode: "decimal" as const,
    value: (imovel[k] as number | undefined) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, (e.target.value === "" ? (opcional ? undefined : 0) : Number(e.target.value)) as never),
  });
  const moedaCampo = (k: "preco" | "condominio" | "iptu", campo: string, opcional = false) => ({
    className: cls(campo), valor: imovel[k] || undefined,
    onChange: (n: number | undefined) => set(k, (n ?? (opcional ? undefined : 0)) as never),
  });
  const locacao = imovel.finalidade === "locacao";
  const ir = (n: number) => { setEtapa(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function salvar(publicar: boolean) {
    if (publicar) {
      setTentou(true);
      if (erros.length) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    }
    const dados: Imovel = {
      ...imovel, publicado: publicar, destaque: publicar && imovel.destaque,
      cidade: imovel.endereco.cidade, bairro: imovel.endereco.bairro,
      slug: imovel.slug || slugify(`${imovel.titulo}-${imovel.ref}`),
    };
    setSalvando(true);
    const ok = await upsertImovel(dados);
    setSalvando(false);
    if (!ok) return;
    setImovel(dados);
    setSalvo(publicar ? "publicado" : "rascunho");
    if (!existente) navigate(`/imoveis/${imovel.id}`, { replace: true });
  }

  const botoes = (
    <>
      <button type="button" className="btn-secondary" disabled={salvando} onClick={() => salvar(false)}>
        <FileClock className="h-4 w-4" /> {imovel.publicado ? "Voltar para rascunho" : "Salvar rascunho"}
      </button>
      <button type="button" className="btn-primary" disabled={salvando} onClick={() => salvar(true)}>
        <Globe className="h-4 w-4" /> {salvando ? "Salvando..." : imovel.publicado ? "Salvar e manter no site" : "Salvar e publicar"}
      </button>
    </>
  );

  const comodidadesExtras = imovel.caracteristicas.filter((c) => !COMODIDADES.includes(c));

  return (
    <div>
      <Link to="/imoveis" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink"><ArrowLeft className="h-4 w-4" /> Imóveis</Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs text-ink-500">{imovel.ref}
            {existente && <span className={clsx("rounded-full px-2 py-0.5 font-sans text-[11px] font-semibold", imovel.publicado ? "bg-green-50 text-green-700" : "bg-sand text-ink-600")}>{imovel.publicado ? "No site" : "Rascunho"}</span>}
          </p>
          <h1 className="text-2xl font-bold">{existente ? imovel.titulo || "Imóvel sem título" : "Novo imóvel"}</h1>
        </div>
        {editar && (
          <div className="flex items-center gap-2">
            {salvo && <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600"><Check className="h-4 w-4" /> {salvo === "publicado" ? "Publicado" : "Rascunho salvo"}</span>}
            {existente && <ExcluirFicha id={imovel.id} nome={imovel.titulo} onExcluir={async () => { const ok = await removerImovel(imovel.id); if (ok) navigate("/imoveis"); return ok; }} />}
            {botoes}
          </div>
        )}
      </div>

      <Etapas etapas={ETAPAS} atual={etapa} onIr={ir} erros={erros} mostrarErros={tentou} />
      {tentou && <AlertaErros erros={erros} etapas={ETAPAS} onIr={ir} />}

      <div className="panel p-5 sm:p-6">
        <fieldset disabled={!editar} className="min-w-0">
          {etapa === 0 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <Campo label="Título *" className="sm:col-span-3" dica={err("Título") ?? "Ex.: Apartamento 3 dormitórios no centro"}>
                  <input className={cls("Título")} value={imovel.titulo} onChange={(e) => set("titulo", e.target.value)} />
                </Campo>
                <Campo label="Tipo de imóvel *">
                  <select className="field" value={imovel.tipo} onChange={(e) => set("tipo", e.target.value as TipoImovel)}>{TIPOS.map((t) => <option key={t}>{t}</option>)}</select>
                </Campo>
                <Campo label="Finalidade *">
                  <select className="field" value={imovel.finalidade} onChange={(e) => { const f = e.target.value as Finalidade; set("finalidade", f); if (!existente) set("ref", proximaRef(f, imoveis)); }}>
                    <option value="venda">Venda</option><option value="locacao">Locação</option>
                  </select>
                </Campo>
                <Campo label={locacao ? "Valor do aluguel (R$/mês) *" : "Valor de venda (R$) *"} dica={err(locacao ? "Valor do aluguel" : "Valor de venda") ?? (imovel.preco > 0 ? moeda(imovel.preco) : undefined)}>
                  <InputMoeda {...moedaCampo("preco", locacao ? "Valor do aluguel" : "Valor de venda")} />
                </Campo>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <Campo label="Dormitórios"><input {...num("dormitorios", "Dormitórios")} /></Campo>
                <Campo label="Suítes" dica={err("Suítes")}><input {...num("suites", "Suítes")} /></Campo>
                <Campo label="Banheiros" dica={err("Banheiros")}><input {...num("banheiros", "Banheiros")} /></Campo>
                <Campo label="Vagas"><input {...num("vagas", "Vagas")} /></Campo>
                <Campo label="Área útil (m²) *" dica={err("Área útil")}><input {...num("areaUtil", "Área útil")} /></Campo>
                <Campo label="Área total (m²)" dica={err("Área total")}><input {...num("areaTotal", "Área total", true)} /></Campo>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Campo label="Condomínio (R$/mês)"><InputMoeda {...moedaCampo("condominio", "Condomínio", true)} /></Campo>
                <Campo label={`Nome do condomínio${imovel.tipo === "Casa em condomínio" ? " *" : ""}`} dica={err("Nome do condomínio")}>
                  <input className={cls("Nome do condomínio").replace("tabular", "")} value={imovel.nomeCondominio ?? ""} onChange={(e) => set("nomeCondominio", e.target.value)} />
                </Campo>
                <Campo label="IPTU (R$/mês)"><InputMoeda {...moedaCampo("iptu", "IPTU", true)} /></Campo>
              </div>

              <Campo label="Descrição"><textarea className="field" rows={5} value={imovel.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="Destaques do imóvel, estado de conservação, localização..." /></Campo>

              {editar && (
                <div className="rounded-xl border border-line bg-paper p-4">
                  <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold"><Lock className="h-3.5 w-3.5" /> Dados do proprietário <span className="font-normal text-ink-500">(uso interno, nunca aparece no site)</span></p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo label="Nome"><input className="field" value={imovel.proprietarioNome ?? ""} onChange={(e) => set("proprietarioNome", e.target.value)} /></Campo>
                    <Campo label="Telefone" dica={err("Telefone do proprietário")}><input className={cls("Telefone do proprietário")} value={imovel.proprietarioTelefone ?? ""} onChange={(e) => set("proprietarioTelefone", e.target.value)} /></Campo>
                  </div>
                </div>
              )}
            </div>
          )}

          {etapa === 1 && (
            <div className="space-y-6">
              <EnderecoForm valor={imovel.endereco} onChange={(v) => set("endereco", v)} erros={tentou ? validarEndereco(imovel.endereco) : {}} />
              <div className="flex items-start justify-between gap-4 rounded-xl border border-line p-4">
                <div><p className="font-medium">Ocultar endereço exato no site</p><p className="text-xs text-ink-500">O site mostra só bairro e cidade. Recomendado para imóveis de terceiros.</p></div>
                <Toggle ativo={imovel.ocultarEndereco} onChange={(v) => set("ocultarEndereco", v)} label="Ocultar endereço" />
              </div>
            </div>
          )}

          {etapa === 2 && (
            <div className="space-y-6">
              <p className="text-ink-500">Selecione o que o imóvel tem. Esses itens aparecem na página do imóvel no site.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {COMODIDADES.map((c) => {
                  const marcado = imovel.caracteristicas.includes(c);
                  return (
                    <label key={c} className={clsx("flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition", marcado ? "border-ink bg-sand font-semibold" : "border-line hover:border-ink-300")}>
                      <input type="checkbox" className="accent-ink" checked={marcado}
                        onChange={() => set("caracteristicas", marcado ? imovel.caracteristicas.filter((x) => x !== c) : [...imovel.caracteristicas, c])} />
                      {c}
                    </label>
                  );
                })}
              </div>
              <div>
                <span className="label">Outros itens</span>
                <ListaTextos valores={comodidadesExtras} placeholder="Ex.: Depósito privativo"
                  onChange={(v) => set("caracteristicas", [...imovel.caracteristicas.filter((c) => COMODIDADES.includes(c)), ...v])} />
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div className="space-y-8">
              <section>
                <h3 className="mb-1 font-semibold">Fotos</h3>
                {err("Fotos") && <p className="mb-2 text-sm text-red-500">{erros.find((e) => e.campo === "Fotos")!.msg}</p>}
                <FotosEditor fotos={imovel.fotos} onChange={(v) => set("fotos", v)} somenteLeitura={!editar} />
              </section>
              <section>
                <h3 className="mb-1 font-semibold">Documentos (PDF)</h3>
                <p className="mb-3 text-xs text-ink-500">Matrícula, planta, IPTU, laudo... Ficam disponíveis para a equipe baixar. Não aparecem no site.</p>
                <DocumentosEditor documentos={imovel.documentos} onChange={(v) => set("documentos", v)} somenteLeitura={!editar} />
              </section>
              <Campo label="Vídeo (YouTube)" dica={err("Vídeo") ?? "Opcional. Se preenchido, o vídeo aparece na página do imóvel."}>
                <input className={cls("Vídeo").replace("tabular", "")} placeholder="https://www.youtube.com/watch?v=..." value={imovel.videoUrl ?? ""} onChange={(e) => set("videoUrl", e.target.value || undefined)} />
              </Campo>
            </div>
          )}

          {etapa === 4 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-xl border border-line p-4">
                  <p className="font-medium">Situação: {imovel.publicado ? "publicado no site" : "rascunho"}</p>
                  <p className="text-xs text-ink-500"><strong>Salvar rascunho</strong> guarda mesmo incompleto, só no CRM. <strong>Salvar e publicar</strong> exige todos os campos obrigatórios.</p>
                </div>
                <div className="flex items-start justify-between gap-4 rounded-xl border border-line p-4">
                  <div><p className="font-medium">Destaque na home</p><p className="text-xs text-ink-500">Aparece na seção de destaque da página inicial.</p></div>
                  <Toggle ativo={imovel.destaque} onChange={(v) => set("destaque", v)} label="Destaque" />
                </div>
              </div>
              <div className="rounded-xl bg-paper p-4">
                <p className="mb-3 font-semibold">Resumo</p>
                <dl className="space-y-1.5 text-sm">
                  <Resumo k="Título" v={imovel.titulo} />
                  <Resumo k="Tipo / finalidade" v={`${imovel.tipo} · ${locacao ? "Locação" : "Venda"}`} />
                  <Resumo k="Valor" v={imovel.preco ? `${moeda(imovel.preco)}${locacao ? "/mês" : ""}` : ""} />
                  <Resumo k="Endereço" v={imovel.endereco.cidade ? `${imovel.endereco.logradouro}, ${imovel.endereco.numero} · ${imovel.endereco.bairro}, ${imovel.endereco.cidade}/${imovel.endereco.uf} · ${cepFormatado(imovel.endereco.cep)}` : ""} />
                  <Resumo k="Comodidades" v={String(imovel.caracteristicas.length)} />
                  <Resumo k="Fotos / documentos" v={`${imovel.fotos.length} / ${imovel.documentos.length}`} />
                </dl>
                {erros.length > 0 ? (
                  <div className="mt-4 border-t border-line pt-3">
                    <p className="mb-1 text-sm font-semibold text-red-500">Pendências para publicar ({erros.length})</p>
                    <ul className="space-y-1 text-sm">
                      {erros.map((e) => (
                        <li key={e.campo + e.msg}><button type="button" className="text-left text-ink-700 hover:underline" onClick={() => ir(e.etapa)}>• <strong>{e.campo}</strong> ({ETAPAS[e.etapa]}): {e.msg}</button></li>
                      ))}
                    </ul>
                  </div>
                ) : <p className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-sm font-semibold text-green-600"><Check className="h-4 w-4" /> Tudo certo para publicar</p>}
              </div>
            </div>
          )}
        </fieldset>

        <NavEtapas atual={etapa} total={ETAPAS.length} onIr={ir}
          ultimo={editar ? <div className="flex flex-wrap gap-2">{botoes}</div> : <span />} />
      </div>
    </div>
  );
}

function Resumo({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4"><dt className="shrink-0 text-ink-500">{k}</dt><dd className={clsx("text-right", !v && "text-ink-400")}>{v || "—"}</dd></div>;
}
