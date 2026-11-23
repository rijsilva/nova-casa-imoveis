import Link from "next/link";
import { ArrowRight, HeartHandshake, KeyRound, MessageCircle, ShieldCheck } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ImovelCard } from "@/components/ImovelCard";
import { LeadForm } from "@/components/LeadForm";
import { catalogo } from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const pilares = [
  { icon: HeartHandshake, titulo: "Atendimento próximo", texto: "Ouvimos você antes de indicar qualquer imóvel. Cada família tem uma história." },
  { icon: ShieldCheck, titulo: "Segurança na negociação", texto: "Acompanhamos cada etapa com transparência: visita, proposta e documentação." },
  { icon: MessageCircle, titulo: "Resposta rápida", texto: "Não deixamos você esperando. Fale pelo WhatsApp e receba retorno imediato." },
  { icon: KeyRound, titulo: "Até a entrega das chaves", texto: "Estamos com você do primeiro contato ao dia da mudança." },
];

export default async function Home() {
  const { imoveis, locaisImoveis, tiposImoveis, temVenda, temLocacao } = await catalogo();
  const destaques = imoveis.filter((i) => i.destaque).slice(0, 4);
  const recentes = imoveis.filter((i) => !i.destaque).slice(0, 4);
  const exibir = destaques.length ? destaques : recentes;

  const abas = [
    ...(temVenda ? [{ id: "venda" as const, label: "Comprar" }] : []),
    ...(temLocacao ? [{ id: "locacao" as const, label: "Alugar" }] : []),
  ];

  const opcoesBusca = {
    abas,
    porAba: {
      venda: { locais: locaisImoveis("venda"), tipos: tiposImoveis("venda") },
      locacao: { locais: locaisImoveis("locacao"), tipos: tiposImoveis("locacao") },
    },
  };

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-brand-900">
        {/* foto de fundo */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        {/* overlay escuro para contraste */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/55 to-black/70" />
        <div className="container-nc flex min-h-[580px] flex-col items-center justify-center gap-8 py-24 text-center">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Imóveis em Paulínia/SP e região</p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-6xl">
              O lar que você{" "}<span className="text-gold">merece</span>{" "}está aqui
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-lg text-white/75">
              Encontre seu imóvel para comprar ou alugar. Atendimento personalizado com quem entende de verdade.
            </p>
          </div>
          {abas.length > 0 && <SearchBar opcoes={opcoesBusca} />}
          {abas.length === 0 && (
            <div className="flex gap-3">
              <Link href="/imoveis" className="btn-gold px-8 py-3 text-base">Ver todos os imóveis</Link>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-whatsapp px-8 py-3 text-base"><WhatsAppIcon className="h-5 w-5" /> WhatsApp</a>
            </div>
          )}
        </div>
      </section>

      {/* IMÓVEIS EM DESTAQUE */}
      {exibir.length > 0 && (
        <section className="container-nc py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow gold-mark mb-3">Imóveis disponíveis</p>
              <h2 className="text-3xl font-bold sm:text-4xl">Encontre seu imóvel ideal</h2>
            </div>
            <Link href="/imoveis" className="btn-outline hidden sm:inline-flex">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {exibir.map((i) => <ImovelCard key={i.slug} i={i} />)}
          </div>
          <div className="mt-8 flex sm:hidden">
            <Link href="/imoveis" className="btn-outline w-full justify-center">Ver todos os imóveis <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      )}

      {/* PILARES */}
      <section className="bg-paper py-20">
        <div className="container-nc">
          <div className="mb-10 max-w-xl">
            <p className="eyebrow gold-mark mb-3">Por que a Nova Casa</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Cuidamos de você em cada etapa</h2>
            <p className="mt-4 text-ink-500">
              Mais de um imóvel à venda? Nós facilitamos. Atendimento humano, sem complicação.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pilares.map(({ icon: Icon, titulo, texto }) => (
              <div key={titulo} className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand"><Icon className="h-5 w-5" /></span>
                <h3 className="font-semibold">{titulo}</h3>
                <p className="mt-1.5 text-sm text-ink-500">{texto}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/sobre" className="btn-dark">Conheça a Nova Casa <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* CTA LEAD */}
      <section className="container-nc py-20">
        <div className="grid overflow-hidden rounded-[28px] bg-brand-50 lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="eyebrow mb-3">Atendimento personalizado</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Não sabe por onde começar?</h2>
            <p className="mt-4 text-ink-600">
              Conte o que você procura e um corretor da Nova Casa monta uma seleção de imóveis para o seu perfil — sem compromisso.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink-700">
              <li>• Imóveis para comprar e alugar em Paulínia e região</li>
              <li>• Visitas agendadas com horário marcado</li>
              <li>• Apoio na documentação e negociação</li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappLink(undefined, "edjalma")} target="_blank" rel="noopener" className="btn-whatsapp">
                <WhatsAppIcon className="h-4 w-4" /> Edjalma — (19) 99140-5561
              </a>
              <a href={whatsappLink(undefined, "silvio")} target="_blank" rel="noopener" className="btn-whatsapp">
                <WhatsAppIcon className="h-4 w-4" /> Silvio — (11) 96498-8496
              </a>
            </div>
          </div>
          <div className="bg-white p-8 sm:p-12">
            <LeadForm titulo="Envie uma mensagem" mensagemPadrao="Olá! Gostaria de receber opções de imóveis." />
          </div>
        </div>
      </section>
    </>
  );
}
