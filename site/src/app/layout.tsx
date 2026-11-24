import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CookieBanner } from "@/components/CookieBanner";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Nova Casa Imóveis — Imóveis em Paulínia/SP", template: "%s | Nova Casa Imóveis" },
  description: "Imóveis à venda e para alugar em Paulínia/SP e região. Atendimento personalizado do primeiro contato à entrega das chaves.",
  openGraph: { type: "website", locale: "pt_BR", siteName: site.nome },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700;800&display=swap"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CookieBanner />
      </body>
    </html>
  );
}
