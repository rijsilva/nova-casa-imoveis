import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Nova Casa Imóveis cuida dos seus dados.",
};

export default function PoliticaPrivacidade() {
  return (
    <article className="container-nc max-w-3xl py-16 prose prose-brand">
      <h1 className="text-4xl font-extrabold">Política de Privacidade</h1>
      <p className="text-ink-500">Última atualização: novembro de 2026</p>
      <p>A <strong>Nova Casa Imóveis</strong> respeita sua privacidade e está comprometida em proteger os dados pessoais que você compartilha conosco.</p>
      <h2 className="text-2xl font-bold mt-8">Dados coletados</h2>
      <p>Quando você preenche nosso formulário de contato ou nos chama pelo WhatsApp, coletamos: nome, telefone/WhatsApp e, opcionalmente, e-mail e mensagem. Esses dados são usados exclusivamente para retornar seu contato sobre imóveis de seu interesse.</p>
      <h2 className="text-2xl font-bold mt-8">Uso dos dados</h2>
      <p>Seus dados são usados para: (i) retornar o contato que você iniciou; (ii) enviar informações sobre imóveis disponíveis, mediante seu consentimento; (iii) cumprir obrigações legais.</p>
      <h2 className="text-2xl font-bold mt-8">Compartilhamento</h2>
      <p>Seus dados não são vendidos. Podem ser compartilhados com nossos corretores parceiros para fins de atendimento.</p>
      <h2 className="text-2xl font-bold mt-8">Seus direitos</h2>
      <p>Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail <strong>{site.email}</strong>.</p>
      <h2 className="text-2xl font-bold mt-8">Contato</h2>
      <p>Dúvidas? Entre em contato: <strong>{site.email}</strong></p>
    </article>
  );
}
