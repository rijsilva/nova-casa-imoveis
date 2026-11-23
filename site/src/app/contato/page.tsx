import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { corretores, site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Nova Casa Imóveis por WhatsApp, telefone ou formulário.",
};

export default function Contato() {
  return (
    <section className="container-nc grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr] lg:py-24">
      <div>
        <p className="eyebrow gold-mark mb-3">Contato</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Vamos conversar?</h1>
        <p className="mt-4 max-w-md text-ink-500">Conte o que você procura. Nossos corretores respondem rapidinho.</p>

        <div className="mt-8 space-y-4">
          {Object.entries(corretores).map(([key, c]) => (
            <div key={key} className="flex items-center gap-4 rounded-2xl bg-brand-50 p-5">
              <div className="flex-1">
                <p className="font-semibold">{c.nome}</p>
                <p className="text-sm text-ink-500">{c.telefone}</p>
              </div>
              <a
                href={whatsappLink(undefined, key as keyof typeof corretores)}
                target="_blank" rel="noopener"
                className="btn-whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" /> Chamar
              </a>
            </div>
          ))}
        </div>

        <ul className="mt-8 space-y-5">
          {[
            { icon: Mail, k: "E-mail", v: site.email },
            { icon: MapPin, k: "Localização", v: site.endereco },
            { icon: Clock, k: "Horário", v: site.horario },
          ].map(({ icon: Icon, k, v }) => (
            <li key={k} className="flex gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand"><Icon className="h-5 w-5" /></span>
              <div><p className="text-xs text-ink-400">{k}</p><p className="font-medium">{v}</p></div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="card p-6 sm:p-10">
          <LeadForm titulo="Envie uma mensagem" botao="Enviar mensagem" />
        </div>
        <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-line">
          <iframe
            title="Mapa — Nova Casa Imóveis"
            className="h-[280px] w-full"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`}
          />
        </div>
      </div>
    </section>
  );
}
