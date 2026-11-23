"use client";

import { useState } from "react";
import Link from "next/link";
import { evento } from "@/lib/site";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase";
import { CheckCircle2, Send } from "lucide-react";

type Props = {
  titulo?: string;
  subtitulo?: string;
  botao?: string;
  interesse?: { tipo: "imovel"; slug: string; nome: string };
  mensagemPadrao?: string;
  compacto?: boolean;
};

export function LeadForm({ titulo, subtitulo, botao = "Quero ser atendido", interesse, mensagemPadrao, compacto }: Props) {
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    const d = new FormData(e.currentTarget);
    const campo = (k: string) => String(d.get(k) ?? "").trim() || null;
    const telefone = (campo("telefone") ?? "").replace(/\D/g, "");
    if (telefone.length < 10) { setEnviando(false); return setErro("Informe o WhatsApp com DDD."); }

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/receber_lead_site`, {
          method: "POST",
          headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({
            p_nome: campo("nome"), p_telefone: telefone, p_email: campo("email"), p_mensagem: campo("mensagem"),
            p_imovel_slug: interesse?.slug ?? null,
          }),
        });
        if (!r.ok) throw new Error(await r.text());
      } catch (err) {
        console.error("[lead]", err);
        setEnviando(false);
        return setErro("Não foi possível enviar agora. Tente pelo WhatsApp.");
      }
    }

    evento("gerar_lead", { formulario: interesse ? "pagina_imovel" : "contato", interesse_nome: interesse?.nome });
    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand" />
        <p className="font-display text-lg font-bold">Recebemos seu contato!</p>
        <p className="max-w-xs text-sm text-ink-500">Um corretor vai falar com você em breve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {titulo && <h3 className="font-display text-xl font-bold">{titulo}</h3>}
      {subtitulo && <p className="text-sm text-ink-500">{subtitulo}</p>}
      <div className={compacto ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <div>
          <label className="label" htmlFor="lead-nome">Nome</label>
          <input id="lead-nome" name="nome" required className="field" placeholder="Seu nome" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="lead-tel">WhatsApp</label>
          <input id="lead-tel" name="telefone" required inputMode="tel" className="field" placeholder="(19) 90000-0000" autoComplete="tel" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="lead-email">E-mail <span className="font-normal text-ink-400">(opcional)</span></label>
        <input id="lead-email" name="email" type="email" className="field" placeholder="voce@email.com" autoComplete="email" />
      </div>
      {!compacto && (
        <div>
          <label className="label" htmlFor="lead-msg">Mensagem</label>
          <textarea id="lead-msg" name="mensagem" rows={3} className="field resize-none" defaultValue={mensagemPadrao} />
        </div>
      )}
      <label className="flex items-start gap-2 text-xs text-ink-500">
        <input type="checkbox" name="consentimento" required className="mt-0.5 accent-brand" />
        <span>Concordo em ser contatado pela Nova Casa Imóveis e com a <Link href="/politica-de-privacidade" className="underline">política de privacidade</Link>.</span>
      </label>
      {erro && <p role="alert" className="text-sm font-medium text-red-600">{erro}</p>}
      <button disabled={enviando} className="btn-primary w-full py-3">
        <Send className="h-4 w-4" /> {enviando ? "Enviando..." : botao}
      </button>
    </form>
  );
}
