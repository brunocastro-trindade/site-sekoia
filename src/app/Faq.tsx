import type { CSSProperties } from "react";

const GREEN = "#39471d";

const gotham = (w: "Black" | "Bold" | "Medium" | "Book" = "Medium") =>
  ({ fontFamily: `'Gotham:${w}', 'Montserrat', sans-serif` } as CSSProperties);

/**
 * Perguntas frequentes.
 *
 * Serve a dois propósitos e por isso o formato é rígido:
 *
 * 1. Citabilidade por buscas de IA (AI Overviews, ChatGPT, Perplexity). Cada
 *    resposta é autocontida — faz sentido lida isoladamente, sem depender do
 *    resto da página — e fica na faixa de ~130-170 palavras, que é onde as
 *    citações se concentram. As perguntas são headings de verdade (<h3>) e em
 *    forma interrogativa, que é como a consulta chega.
 *
 * 2. Fonte única do JSON-LD FAQPage abaixo. O Google exige que o schema
 *    corresponda ao texto visível; gerar os dois do mesmo array impede que
 *    divirjam quando alguém editar uma resposta.
 *
 * As respostas são deliberadamente visíveis, não em accordion: conteúdo atrás
 * de tabs/accordion tem menos chance de ser indexado como resposta.
 */
const FAQ: { q: string; a: string }[] = [
  {
    q: "O que é tráfego pago e como ele funciona?",
    a: "Tráfego pago é a compra de espaço publicitário em plataformas como Google Ads e Meta Ads para colocar sua oferta na frente de quem já demonstra interesse no que você vende. Diferente do alcance orgânico, que depende de tempo e constância, o tráfego pago começa a entregar audiência assim que as campanhas sobem. O anunciante define público, região, orçamento diário e objetivo — vendas, leads ou visitas — e paga por clique ou por mil impressões. O que separa uma campanha que gera retorno de uma que só gasta é a gestão: escolha correta de palavras-chave e públicos, criativos alinhados à intenção de compra, acompanhamento diário de métricas e ajustes contínuos com base em dados reais de conversão.",
  },
  {
    q: "Quanto tempo leva para ver resultados com tráfego pago?",
    a: "Os primeiros dados aparecem em horas, mas resultado consistente é outra coisa. As duas primeiras semanas costumam ser de aprendizado: as plataformas precisam de volume de conversões para calibrar a entrega, e é nesse período que se identifica quais públicos, criativos e palavras-chave realmente convertem. A partir do primeiro mês já é possível ler tendências confiáveis de custo por lead e taxa de conversão. Entre o segundo e o terceiro mês a operação costuma estabilizar, com histórico suficiente para escalar o que funciona e cortar o que não funciona. Prazos menores que isso normalmente indicam sorte pontual, não previsibilidade — e previsibilidade é o que sustenta crescimento.",
  },
  {
    q: "Qual o investimento mínimo para começar a anunciar?",
    a: "Não existe um valor universal: o mínimo viável depende do seu ticket médio, do custo por clique do seu setor e de quantas conversões você precisa por mês para o investimento se pagar. A conta que importa é quantos leads o orçamento diário compra e qual percentual deles vira cliente. Setores com concorrência alta e clique caro exigem orçamento maior para gerar volume estatisticamente confiável; nichos específicos conseguem operar com bem menos. Investir abaixo do necessário para gerar conversões suficientes é o erro mais comum — a campanha nunca sai do aprendizado e os dados não sustentam decisão. Por isso o orçamento é definido a partir da sua meta de faturamento, não de um valor fixo de tabela.",
  },
  {
    q: "Google Ads ou Meta Ads: qual escolher para o meu negócio?",
    a: "Os dois resolvem problemas diferentes. Google Ads captura demanda que já existe: alguém está procurando ativamente pelo seu produto ou serviço e você aparece no momento da busca. Costuma converter mais rápido e é mais direto para negócios com procura estabelecida. Meta Ads (Instagram e Facebook) gera demanda: apresenta sua oferta a públicos que ainda não estavam buscando, mas têm o perfil certo. É mais forte para produtos visuais, lançamentos e construção de marca. Para a maioria das empresas a resposta não é escolher, e sim distribuir o orçamento conforme o momento do negócio — e definir isso exige olhar seu ciclo de venda, ticket e volume de busca pelo que você oferece.",
  },
  {
    q: "O que a Sekoia entrega na gestão de tráfego pago?",
    a: "A Sekoia atua na operação completa das campanhas: diagnóstico do momento atual da empresa, definição de estratégia e orçamento, estruturação das campanhas no Google e no Meta, produção e teste de criativos, acompanhamento diário das métricas e otimização contínua com base em dados de conversão. O trabalho inclui configuração de rastreamento — pixel, conversões e integração com o CRM — porque sem medição correta não há como saber o que está gerando venda. O objetivo declarado não é entregar cliques, e sim oportunidades reais de negócio: leads qualificados que a equipe comercial consiga atender e converter, com relatórios que mostram onde o investimento virou faturamento.",
  },
];

export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section id="faq" className="bg-white px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-[22px] md:text-[30px]" style={{ ...gotham("Bold"), color: GREEN }}>
          Perguntas frequentes sobre tráfego pago
        </h2>

        <dl className="mt-8">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="border-t border-[#e5e5e5] py-6 first:border-t-0 first:pt-0">
              <dt>
                <h3 className="text-[17px] md:text-[19px] leading-snug" style={{ ...gotham("Bold"), color: GREEN }}>
                  {q}
                </h3>
              </dt>
              <dd className="mt-3 text-[15px] leading-relaxed text-[#4a4a4a]" style={gotham("Medium")}>
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Gerado do mesmo array que renderiza o texto acima — não podem divergir. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
