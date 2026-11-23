import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { corretores, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre a Nova Casa Imóveis",
  description: "Conheça a Nova Casa Imóveis, sua imobiliária em Paulínia/SP.",
};

const valores = [
  { t: "Cuidado", d: "Tratamos cada compra ou locação como a decisão importante que ela é para você e sua família." },
  { t: "Transparência", d: "Condições, prazos e custos explicados sem letras miúdas. Você sabe tudo antes de assinar." },
  { t: "Comprometimento", d: "Estamos com você do primeiro contato até o dia da mudança. Sempre disponíveis." },
];

export default function Sobre() {
  return (
    <>
      <section className="container-nc grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="eyebrow gold-mark mb-4">Sobre a Nova Casa</p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Encontre o lar que você merece.</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-600">
            A Nova Casa Imóveis nasceu do desejo de transformar a experiência de comprar ou alugar um imóvel em algo simples,
            seguro e satisfatório. Atuamos em Paulínia/SP e região, com atendimento personalizado e dedicação total a cada cliente.
          </p>
          <p className="mt-4 leading-relaxed text-ink-600">
            Nossa equipe acompanha você da primeira visita ao dia da mudança, cuidando de cada detalhe da negociação e documentação.
          </p>
          <Link href="/imoveis" className="btn-primary mt-8">Ver imóveis disponíveis <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="rounded-[28px] bg-brand-50 p-10">
          <h2 className="mb-6 text-2xl font-bold">Fale com nossos corretores</h2>
          {Object.entries(corretores).map(([key, c]) => (
            <div key={key} className="mb-4 flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)]">
              <div>
                <p className="font-semibold">{c.nome}</p>
                <p className="text-sm text-ink-500">{c.telefone}</p>
              </div>
              <a
                href={whatsappLink(`Olá ${c.nome}! Vim pelo site da Nova Casa Imóveis.`, key as keyof typeof corretores)}
                target="_blank" rel="noopener"
                className="btn-whatsapp shrink-0"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-14 text-white">
        <div className="container-nc grid gap-8 sm:grid-cols-3 text-center">
          {[
            { n: "Paulínia/SP", l: "nossa cidade" },
            { n: "2 corretores", l: "dedicados a você" },
            { n: "100%", l: "comprometidos" },
          ].map((x) => (
            <div key={x.l}>
              <p className="font-display text-5xl font-extrabold text-white">{x.n}</p>
              <p className="mt-1 text-white/60">{x.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-nc py-20">
        <h2 className="text-3xl font-bold">O que nos guia</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {valores.map((v) => (
            <div key={v.t} className="rounded-2xl border border-line p-7">
              <span className="gold-mark" />
              <h3 className="mt-2 text-xl font-bold">{v.t}</h3>
              <p className="mt-2 text-ink-500">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
