import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Car, Check, ChevronRight, MapPin, Ruler, Sparkles, Video } from "lucide-react";
import { Gallery } from "@/components/Gallery";
import { LeadForm } from "@/components/LeadForm";
import { ImovelCard } from "@/components/ImovelCard";
import { catalogo } from "@/lib/data";
import { moeda } from "@/lib/format";
import { corretores, whatsappLink } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const i = (await catalogo()).getImovel((await params).slug);
  if (!i) return {};
  const preco = moeda(i.preco) + (i.finalidade === "locacao" ? "/mês" : "");
  const desc = `${i.tipo} com ${i.dormitorios} dorms e ${i.areaUtil} m² em ${i.bairro}, ${i.cidade}. ${preco}.`;
  return { title: i.titulo, description: desc, openGraph: { title: i.titulo, description: desc, images: i.capa ? [{ url: i.capa }] : [] } };
}

export default async function ImovelPage({ params }: { params: Params }) {
  const { imoveis, getImovel } = await catalogo();
  const i = getImovel((await params).slug);
  if (!i) notFound();

  const semelhantes = imoveis.filter((o) => o.slug !== i.slug && o.finalidade === i.finalidade).slice(0, 3);
  const locacao = i.finalidade === "locacao";
  const msgWhats = `Olá! Tenho interesse no imóvel ${i.ref} — ${i.titulo}.`;

  // Corretor que cadastrou o imóvel; default: Edjalma
  const corretor = i.corretorId === "silvio" ? corretores.silvio : corretores.edjalma;
  const whatsKey: keyof typeof corretores = i.corretorId === "silvio" ? "silvio" : "edjalma";

  const ficha = [
    { icon: BedDouble, k: "Dormitórios", v: i.dormitorios },
    { icon: Sparkles, k: "Suítes", v: i.suites },
    { icon: Bath, k: "Banheiros", v: i.banheiros },
    { icon: Car, k: "Vagas", v: i.vagas },
    { icon: Ruler, k: "Área útil", v: `${i.areaUtil} m²` },
    ...(i.areaTotal ? [{ icon: Ruler, k: "Área total", v: `${i.areaTotal} m²` }] : []),
  ];

  return (
    <>
      <div className="container-nc pt-6">
        <nav aria-label="Trilha" className="mb-5 flex items-center gap-1 text-xs text-ink-400">
          <Link href="/" className="hover:text-ink">Início</Link><ChevronRight className="h-3 w-3" />
          <Link href={`/imoveis?finalidade=${i.finalidade}`} className="hover:text-ink">{locacao ? "Alugar" : "Comprar"}</Link><ChevronRight className="h-3 w-3" />
          <span className="text-ink-600">{i.ref}</span>
        </nav>
        <Gallery fotos={i.galeria} alt={i.titulo} />
      </div>

      <div className="container-nc grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
        <article className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${locacao ? "bg-gold" : "bg-brand"}`}>{locacao ? "Locação" : "Venda"}</span>
            <span className="rounded-full px-3 py-1 font-mono text-xs text-ink-500 ring-1 ring-line">{i.ref}</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{i.titulo}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-ink-500"><MapPin className="h-4 w-4" />{i.bairro} · {i.cidade}/SP</p>

          <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-2">
            <p className="font-display text-4xl font-extrabold text-ink">
              {moeda(i.preco)}{locacao && <span className="text-lg font-semibold text-ink-400">/mês</span>}
            </p>
            <div className="flex gap-6 pb-1 text-sm text-ink-500">
              {i.condominio != null && <span>Condomínio <strong className="text-ink">{moeda(i.condominio)}</strong></span>}
              {i.iptu != null && <span>IPTU <strong className="text-ink">{moeda(i.iptu)}</strong></span>}
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-6">
            {ficha.map(({ icon: Icon, k, v }) => (
              <div key={k} className="bg-white p-4 text-center">
                <Icon className="mx-auto mb-2 h-5 w-5 text-brand" />
                <dd className="font-semibold">{v}</dd>
                <dt className="text-xs text-ink-400">{k}</dt>
              </div>
            ))}
          </dl>

          <section className="mt-12">
            <h2 className="text-2xl font-bold">Sobre o imóvel</h2>
            <p className="mt-3 leading-relaxed text-ink-600">{i.descricao}</p>
          </section>

          {i.caracteristicas.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold">Características</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {i.caracteristicas.map((c) => <li key={c} className="flex gap-2.5 text-ink-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{c}</li>)}
              </ul>
            </section>
          )}

          {/* Vídeo YouTube */}
          {i.videoUrl && (
            <section className="mt-12">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold"><Video className="h-6 w-6 text-red-600" /> Tour virtual</h2>
              <div className="relative overflow-hidden rounded-2xl" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={youtubeEmbed(i.videoUrl)}
                  title={`Tour virtual — ${i.titulo}`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <LeadForm
              compacto
              titulo={locacao ? "Agende uma visita" : "Tenho interesse"}
              subtitulo={`${corretor.nome} retorna rapidamente.`}
              botao={locacao ? "Quero visitar" : "Quero mais informações"}
              interesse={{ tipo: "imovel", slug: i.slug, nome: `${i.ref} — ${i.titulo}` }}
            />
            <div className="my-4 flex items-center gap-3 text-xs text-ink-400"><span className="h-px flex-1 bg-line" />ou<span className="h-px flex-1 bg-line" /></div>
            <a href={whatsappLink(msgWhats, whatsKey)} target="_blank" rel="noopener" className="btn-whatsapp w-full py-3">
              <WhatsAppIcon className="h-4 w-4" /> {corretor.nome} no WhatsApp
            </a>
            <p className="mt-2 text-center text-xs text-ink-400">{corretor.telefone}</p>
          </div>
        </aside>
      </div>

      {semelhantes.length > 0 && (
        <section className="border-t border-line bg-paper py-16">
          <div className="container-nc">
            <h2 className="mb-8 text-2xl font-bold">Imóveis semelhantes</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {semelhantes.map((o) => <ImovelCard key={o.slug} i={o} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function youtubeEmbed(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}
