import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home, LayoutList, LogIn, Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import "./globals.css";
import { Inicio } from "./pages/Inicio";
import { Leads } from "./pages/Leads";
import { LeadDetalhe } from "./pages/LeadDetalhe";
import { Imoveis } from "./pages/Imoveis";
import { ImovelForm } from "./pages/ImovelForm";

function Logo() {
  return (
    <span className="inline-flex items-center gap-2 font-display font-bold text-brand">
      <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill="#fdf5e8" />
        <path d="M18 7L6 17h3v12h8v-7h2v7h8V17h3L18 7z" fill="#7b4f2e" />
        <rect x="15" y="22" width="6" height="7" rx="1" fill="#c9972b" />
      </svg>
      <span>Nova Casa <span className="text-xs font-semibold tracking-wider uppercase text-gold">CRM</span></span>
    </span>
  );
}

const NAV = [
  { href: "/", label: "Painel", icon: Home },
  { href: "/leads", label: "Leads", icon: LayoutList },
  { href: "/imoveis", label: "Imóveis", icon: Building2 },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [aberto, setAberto] = useState(false);
  const ativo = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex min-h-full">
      {/* SIDEBAR desktop */}
      <aside className="hidden lg:flex lg:w-56 lg:flex-col lg:border-r lg:border-line lg:bg-white">
        <div className="flex h-16 items-center px-5 border-b border-line">
          <Logo />
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={clsx(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                ativo(href) ? "bg-brand text-white" : "text-ink-600 hover:bg-sand hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* HEADER mobile */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
          <Logo />
          <button onClick={() => setAberto((v) => !v)} aria-label="Menu">
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>
        {aberto && (
          <div className="border-b border-line bg-white px-4 py-2 lg:hidden">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} to={href} onClick={() => setAberto(false)} className="flex items-center gap-2.5 py-2.5 text-sm font-medium text-ink">
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  // TODO: implementar autenticação com Supabase Auth
  const logado = true;

  if (!logado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold">Entrar</h1>
          <p className="mt-1 text-sm text-ink-500">Acesse o painel da Nova Casa Imóveis</p>
          <div className="mt-6 space-y-3">
            <input className="field" type="email" placeholder="E-mail" />
            <input className="field" type="password" placeholder="Senha" />
            <button className="btn-primary w-full py-3"><LogIn className="h-4 w-4" /> Entrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetalhe />} />
          <Route path="/imoveis" element={<Imoveis />} />
          <Route path="/imoveis/novo" element={<ImovelForm />} />
          <Route path="/imoveis/:id" element={<ImovelForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
