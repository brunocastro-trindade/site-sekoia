import { useState } from "react";
import { Compass, Rocket, RefreshCw, Plus } from "lucide-react";

type PhaseData = {
  id: number;
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  daysLabel?: string;
  paragraphs: string[];
  bullets?: string[];
};

export const PHASES: PhaseData[] = [
  {
    id: 1,
    title: "1ª fase do Tráfego pago na Sekoia",
    Icon: Compass,
    badge: "Planejamento estratégico",
    daysLabel: "Entre 25 a 35 dias",
    paragraphs: [
      "Na primeira fase, chamada Setup Estratégico, realizamos toda a estruturação necessária para construir suas campanhas:",
    ],
    bullets: [
      "Diagnóstico completo do negócio e mercado;",
      "Definição dos públicos-alvo e segmentações;",
      "Estudo da concorrência e oportunidades de mercado;",
      "Estruturação das campanhas e conjuntos de anúncios;",
      "Configuração de pixels, eventos e conversões;",
      "Planejamento da estratégia de mídia e investimento.",
    ],
  },
  {
    id: 2,
    title: "2ª fase — Rampagem",
    Icon: Rocket,
    badge: "Lançamento e otimização",
    daysLabel: "Em até 90 dias",
    paragraphs: [
      "Na fase de Rampagem, iniciamos a veiculação das campanhas e coletamos dados essenciais para identificar oportunidades de otimização e crescimento.",
      "Durante este período, realizamos testes de públicos, criativos, ofertas e segmentações, analisando constantemente o comportamento dos usuários e o desempenho das campanhas.",
      "O objetivo desta etapa é validar estratégias, reduzir desperdícios de investimento e construir uma base sólida para a escalabilidade dos resultados.",
    ],
  },
  {
    id: 3,
    title: "3ª fase — Ongoing",
    Icon: RefreshCw,
    badge: "Gestão contínua",
    daysLabel: "entre 25 a 35 dias",
    paragraphs: [
      "Na fase de Ongoing, as campanhas entram em um processo contínuo de gestão, monitoramento e otimização.",
      "Nossa equipe acompanha diariamente os indicadores de performance, realiza ajustes estratégicos, testa novas oportunidades de crescimento e busca constantemente aumentar o volume de conversões com o melhor custo possível.",
      "É nesta etapa que transformamos dados em decisões, garantindo que sua operação continue evoluindo, gerando mais leads, mais vendas e maior retorno sobre o investimento ao longo do tempo.",
    ],
  },
];

export default function MethodologySection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="metodologia" className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <span className="eyebrow">Como trabalhamos</span>
        <h2 className="mt-4 max-w-lg text-[28px] leading-tight text-foreground md:text-[38px]">
          Conheça a metodologia que vamos aplicar no seu negócio!
        </h2>

        <div className="mt-10 flex flex-col gap-4">
          {PHASES.map((phase) => {
            const isOpen = openId === phase.id;
            const PhaseIcon = phase.Icon;

            return (
              <div
                key={phase.id}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen ? "border-accent-bright/40 bg-secondary/50" : "border-border/40 bg-background/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(phase.id)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-7"
                >
                  <span className="section-index text-2xl">0{phase.id}</span>
                  <span className="flex-1 text-[17px] font-semibold text-foreground">{phase.title}</span>
                  <Plus
                    aria-hidden="true"
                    className={`size-5 shrink-0 text-accent-bright transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  />
                </button>

                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-6 text-muted-foreground md:px-7">
                      {phase.paragraphs.map((p, i) => (
                        <p key={i} className="mb-3 text-[14px] leading-relaxed">
                          {p}
                        </p>
                      ))}

                      {phase.bullets && (
                        <ul className="mb-3 list-none p-0 text-[14px] leading-relaxed">
                          {phase.bullets.map((b, i) => (
                            <li key={i}>• {b}</li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <PhaseIcon className="size-5 text-accent-bright" />
                        {phase.badge && (
                          <span className="text-[13px] font-semibold text-foreground">{phase.badge}</span>
                        )}
                        {phase.daysLabel && (
                          <span className="rounded-full bg-accent-bright/10 px-3 py-1 text-[12px] font-semibold text-accent-bright">
                            {phase.daysLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
