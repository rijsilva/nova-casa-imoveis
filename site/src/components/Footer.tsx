import Link from "next/link";
import { AtSign, Coffee, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { corretores, nav, site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-nc grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo variant="white" className="h-11 w-auto" />
          <p className="max-w-sm text-sm leading-relaxed">
            Imóveis à venda e para alugar em Paulínia/SP e região. {site.slogan}.
          </p>
          {site.creci !== "000000-J" && (
            <p className="text-xs font-semibold tracking-wide text-white">CRECI {site.creci}</p>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Navegue</h3>
          <ul className="space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}><Link className="hover:text-white" href={n.href}>{n.label}</Link></li>
            ))}
            <li><Link className="hover:text-white" href="/politica-de-privacidade">Política de privacidade</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Corretores</h3>
          <ul className="space-y-3 text-sm">
            {Object.values(corretores).map((c) => (
              <li key={c.whatsapp} className="flex gap-3">
                <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#25d366]" />
                <div>
                  <p className="text-white/90 font-medium">{c.nome}</p>
                  <a className="hover:text-white" href={whatsappLink(undefined, c === corretores.edjalma ? "edjalma" : "silvio")} target="_blank" rel="noopener">
                    {c.telefone}
                  </a>
                </div>
              </li>
            ))}
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" />{site.email}</li>
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" />{site.endereco}</li>
            <li className="flex gap-3">
              <AtSign className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" />
              <a className="hover:text-white" href={site.instagram} target="_blank" rel="noopener">Instagram</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-nc flex flex-col gap-2 py-5 text-xs sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {site.nome}</span>
          <span>Imagens meramente ilustrativas. Valores e condições sujeitos a alteração sem aviso prévio.</span>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-nc flex items-center justify-center gap-1.5 py-4 text-xs">
          <span>Programado com muito</span>
          <Coffee className="h-4 w-4 text-white/80" aria-label="café" />
          <span>por</span>
          <a href="https://estudiodegrade.com.br" target="_blank" rel="noopener" className="ml-0.5 font-semibold text-white/80 hover:text-white transition">Estúdio Degradê</a>
        </div>
      </div>
    </footer>
  );
}
