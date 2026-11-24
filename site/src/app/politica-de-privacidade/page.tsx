import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Nova Casa Imóveis coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
};

export default function PoliticaPrivacidade() {
  return (
    <div className="container-nc max-w-3xl py-16">
      <nav className="mb-8 text-sm text-ink-500">
        <Link href="/" className="hover:text-brand">Início</Link>
        <span className="mx-2">›</span>
        <span className="text-ink">Política de Privacidade</span>
      </nav>

      <article className="prose prose-brand max-w-none">
        <h1>Política de Privacidade</h1>
        <p className="text-ink-500 text-sm">Última atualização: novembro de 2026</p>

        <p>
          A <strong>Nova Casa Imóveis</strong> (doravante "<strong>Nova Casa</strong>") respeita sua privacidade
          e está comprometida em proteger os dados pessoais que você compartilha conosco, em conformidade com
          a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
        </p>

        <h2>1. Quem somos</h2>
        <p>
          Somos uma imobiliária localizada em Paulínia/SP, especializada em imóveis para venda e locação na
          região. Nossos dados de contato:
        </p>
        <ul>
          <li>Site: <strong>{site.url}</strong></li>
          <li>E-mail: <strong>{site.email}</strong></li>
          <li>Endereço: <strong>{site.endereco}</strong></li>
        </ul>

        <h2>2. Dados que coletamos</h2>
        <p>Coletamos apenas os dados necessários para prestar nosso serviço:</p>
        <ul>
          <li><strong>Nome</strong> — para identificação e atendimento personalizado.</li>
          <li><strong>Telefone / WhatsApp</strong> — para retornar seu contato.</li>
          <li><strong>E-mail</strong> (opcional) — para envio de informações sobre imóveis.</li>
          <li><strong>Mensagem</strong> (opcional) — descrição da sua necessidade.</li>
          <li><strong>Dados de navegação</strong> — cookies essenciais para funcionamento do site (sem rastreamento de terceiros).</li>
        </ul>
        <p>Não coletamos documentos, CPF, dados financeiros nem informações sensíveis pelo site.</p>

        <h2>3. Como usamos seus dados</h2>
        <p>Seus dados são usados exclusivamente para:</p>
        <ul>
          <li>Responder ao contato que você iniciou;</li>
          <li>Enviar informações sobre imóveis disponíveis (com seu consentimento);</li>
          <li>Melhorar o funcionamento e a experiência de navegação no site;</li>
          <li>Cumprir obrigações legais e regulatórias.</li>
        </ul>

        <h2>4. Base legal (LGPD)</h2>
        <p>Tratamos seus dados com base nas seguintes hipóteses legais previstas na LGPD:</p>
        <ul>
          <li><strong>Consentimento</strong> (art. 7º, I) — ao preencher nosso formulário de contato.</li>
          <li><strong>Legítimo interesse</strong> (art. 7º, IX) — para melhoria dos serviços e segurança do site.</li>
          <li><strong>Cumprimento de obrigação legal</strong> (art. 7º, II) — quando exigido por lei.</li>
        </ul>

        <h2>5. Compartilhamento de dados</h2>
        <p>
          Seus dados <strong>não são vendidos</strong>. Podemos compartilhá-los com:
        </p>
        <ul>
          <li><strong>Corretores parceiros</strong> da Nova Casa, para fins de atendimento ao seu interesse.</li>
          <li><strong>Autoridades públicas</strong>, quando exigido por lei ou ordem judicial.</li>
        </ul>
        <p>Não utilizamos serviços de analytics de terceiros (como Google Analytics) que coletem dados de comportamento.</p>

        <h2>6. Cookies</h2>
        <p>
          Usamos apenas cookies <strong>essenciais</strong>, necessários para o funcionamento do site
          (como lembrar suas preferências de cookies). Não utilizamos cookies de rastreamento, publicidade
          ou perfil comportamental.
        </p>

        <h2>7. Armazenamento e segurança</h2>
        <p>
          Seus dados ficam armazenados em servidores seguros na nuvem (Supabase, hospedagem no Brasil ou
          na UE). Adotamos medidas técnicas e organizacionais para proteger suas informações contra
          acesso não autorizado, perda ou destruição.
        </p>

        <h2>8. Seus direitos</h2>
        <p>Pela LGPD, você tem direito a:</p>
        <ul>
          <li><strong>Confirmação</strong> se tratamos seus dados;</li>
          <li><strong>Acesso</strong> aos dados que possuímos sobre você;</li>
          <li><strong>Correção</strong> de dados incompletos, inexatos ou desatualizados;</li>
          <li><strong>Anonimização, bloqueio ou eliminação</strong> de dados desnecessários;</li>
          <li><strong>Portabilidade</strong> dos dados a outro prestador de serviço;</li>
          <li><strong>Revogação do consentimento</strong> a qualquer momento;</li>
          <li><strong>Oposição</strong> ao tratamento em caso de descumprimento da LGPD.</li>
        </ul>
        <p>
          Para exercer qualquer desses direitos, entre em contato pelo e-mail{" "}
          <a href={`mailto:${site.email}`}><strong>{site.email}</strong></a> com o assunto
          "Dados Pessoais — LGPD".
        </p>

        <h2>9. Retenção de dados</h2>
        <p>
          Guardamos seus dados pelo tempo necessário para o atendimento solicitado ou enquanto houver
          base legal para o tratamento. Após esse período, os dados são eliminados de forma segura.
        </p>

        <h2>10. Alterações nesta política</h2>
        <p>
          Podemos atualizar esta política periodicamente. A data de "última atualização" no início desta
          página sempre refletirá a versão mais recente. Recomendamos revisitá-la de tempos em tempos.
        </p>

        <h2>11. Contato</h2>
        <p>
          Dúvidas ou solicitações relacionadas a esta política:
        </p>
        <ul>
          <li>E-mail: <a href={`mailto:${site.email}`}>{site.email}</a></li>
          <li>Horário de atendimento: {site.horario}</li>
        </ul>
      </article>
    </div>
  );
}
