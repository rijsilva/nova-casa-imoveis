"use client";

import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./Logo";
import { nav, whatsappLink } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setAberto(false), [pathname]);

  const ativo = (href: string) => pathname === href.split("?")[0];

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow",
        rolou ? "shadow-[0_1px_0_var(--color-line)]" : ""
      )}
    >
      <div className="container-nc flex h-[72px] items-center justify-between gap-6">
        <Logo className="h-9 w-auto sm:h-10" />

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                ativo(item.href) ? "bg-brand-50 text-brand" : "text-ink-600 hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-primary hidden sm:inline-flex">
            <WhatsAppIcon className="h-4 w-4" /> Fale conosco
          </a>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
          >
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {aberto && (
        <nav aria-label="Menu móvel" className="border-t border-line bg-white lg:hidden">
          <div className="container-nc flex flex-col py-3">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-2 py-3 text-base font-medium text-ink">
                {item.label}
              </Link>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noopener" className="btn-primary mt-2">
              <WhatsAppIcon className="h-4 w-4" /> Fale conosco
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
