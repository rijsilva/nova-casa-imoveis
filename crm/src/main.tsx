import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home, LayoutList, LogIn, Building2, Menu, X, LogOut, Loader2 } from "lucide-react";
import clsx from "clsx";
import "./globals.css";
import { Inicio } from "./pages/Inicio";
import { Leads } from "./pages/Leads";
import { LeadDetalhe } from "./pages/LeadDetalhe";
import { Imoveis } from "./pages/Imoveis";
import { ImovelForm } from "./pages/ImovelForm";
import { useStore } from "./lib/store";

const BASE = import.meta.env.VITE_SUPABASE_URL as string;
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function fazerLogin(email: string, senha: string): Promise<string> {
  const r = await fetch(`${BASE}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: senha }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error_description ?? j?.msg ?? "Falha no login");
  return j.access_token as string;
}

async function fazerLogout(token: string): Promise<void> {
  await fetch(`${BASE}/auth/v1/logout`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${token}` },
  });
}

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

function Layout({ children, token, onLogout }: { children: React.ReactNode; token: string; onLogout: () => void }) {
  const { pathname } = useLocation();
  const [aberto, setAberto] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const ativo = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function sair() {
    setSaindo(true);
    try { await fazerLogout(token); } catch { /* ignora */ }
    setSaindo(false);
    onLogout();
  }

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
        <div className="border-t border-line p-3">
          <button
            onClick={sair}
            disabled={saindo}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-sand hover:text-ink transition"
          >
            {saindo ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sair
          </button>
        </div>
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
            <button onClick={sair} disabled={saindo} className="flex w-full items-center gap-2.5 py-2.5 text-sm font-medium text-ink-600">
              {saindo ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Sair
            </button>
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function TelaLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    try {
      const token = await fazerLogin(email, senha);
      onLogin(token);
    } catch (err) {
      setErro(String((err as Error).message));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">Entrar</h1>
        <p className="mt-1 text-sm text-ink-500">Acesse o painel da Nova Casa Imóveis</p>
        <form onSubmit={submeter} className="mt-6 space-y-3">
          <input
            className="field"
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="field"
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && <p className="text-sm text-red-500">{erro}</p>}
          <button type="submit" disabled={carregando} className="btn-primary w-full py-3">
            {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState<string | null>(() => {
    try { return sessionStorage.getItem("nc_token"); } catch { return null; }
  });
  const setSessaoId = useStore((s) => s.setSessaoId);

  function onLogin(t: string) {
    try { sessionStorage.setItem("nc_token", t); } catch { /* ignora */ }
    setSessaoId(t);
    setToken(t);
  }

  function onLogout() {
    try { sessionStorage.removeItem("nc_token"); } catch { /* ignora */ }
    setSessaoId(null);
    setToken(null);
  }

  if (!token) {
    return <TelaLogin onLogin={onLogin} />;
  }

  return (
    <BrowserRouter>
      <Layout token={token} onLogout={onLogout}>
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
