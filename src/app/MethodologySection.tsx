import { useState } from "react";
import Group272 from "../imports/Group272-1";
import Group273 from "../imports/Group273-1";
import Group274 from "../imports/Group274-1";
import Group275 from "../imports/Group275-1";

const font = {
  bold: { fontFamily: "'Gotham:Bold', 'Montserrat', sans-serif", fontWeight: 700 } as React.CSSProperties,
  book: { fontFamily: "'Gotham:Book', 'Montserrat', sans-serif", fontWeight: 400 } as React.CSSProperties,
};

type PhaseData = {
  id: number;
  title: string;
  Icon: React.ComponentType;
  badge?: string;
  showDays?: boolean;
  paragraphs: string[];
  bullets?: string[];
};

const PHASES: PhaseData[] = [
  {
    id: 1,
    title: "1ª fase do Tráfego pago na Sekoia",
    Icon: Group273,
    badge: "Planejamento estratégico",
    showDays: true,
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
    Icon: Group274,
    badge: "Lançamento e otimização",
    paragraphs: [
      "Na fase de Rampagem, iniciamos a veiculação das campanhas e coletamos dados essenciais para identificar oportunidades de otimização e crescimento.",
      "Durante este período, realizamos testes de públicos, criativos, ofertas e segmentações, analisando constantemente o comportamento dos usuários e o desempenho das campanhas.",
      "O objetivo desta etapa é validar estratégias, reduzir desperdícios de investimento e construir uma base sólida para a escalabilidade dos resultados.",
    ],
  },
  {
    id: 3,
    title: "3ª fase — Ongoing",
    Icon: Group275,
    badge: "Gestão contínua",
    paragraphs: [
      "Na fase de Ongoing, as campanhas entram em um processo contínuo de gestão, monitoramento e otimização.",
      "Nossa equipe acompanha diariamente os indicadores de performance, realiza ajustes estratégicos, testa novas oportunidades de crescimento e busca constantemente aumentar o volume de conversões com o melhor custo possível.",
      "É nesta etapa que transformamos dados em decisões, garantindo que sua operação continue evoluindo, gerando mais leads, mais vendas e maior retorno sobre o investimento ao longo do tempo.",
    ],
  },
];

export default function MethodologySection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="w-full flex justify-center px-5 py-[18px] bg-white">
      <div
        className="w-full rounded-[20px] overflow-hidden"
        style={{
          maxWidth: 1160,
          background: "#39471d",
          boxShadow: "0 8px 40px rgba(57, 71, 29, 0.28)",
        }}
      >
        <div className="flex items-stretch">

          {/* ── Left: heading ── */}
          <div
            className="shrink-0 flex items-center px-8 py-8"
            style={{ width: 250 }}
          >
            <h2
              className="text-white text-[22px] leading-[1.35]"
              style={font.bold}
            >
              Conheça a metodologia que vamos aplicar no seu negócio!
            </h2>
          </div>

          {/* ── Right: accordion cards ── */}
          <div className="flex-1 flex flex-col gap-[8px] px-4 py-4">
            {PHASES.map((phase) => {
              const isOpen = openId === phase.id;
              const PhaseIcon = phase.Icon;

              return (
                <div
                  key={phase.id}
                  className="rounded-[15px] bg-[#f7f7f7] border border-[#c5c5c5] overflow-hidden"
                  style={{
                    transition: "box-shadow 0.35s ease",
                    boxShadow: isOpen
                      ? "0 4px 20px rgba(57, 71, 29, 0.20)"
                      : "none",
                  }}
                >
                  {/* Header — always visible, click to toggle */}
                  <button
                    type="button"
                    onClick={() => toggle(phase.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                    style={{ background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    <span
                      className="text-[#39471D] text-[17px] leading-[1.3]"
                      style={font.bold}
                    >
                      {phase.title}
                    </span>
                    {/* + rotates to × when open */}
                    <span
                      aria-hidden="true"
                      style={{
                        display: "block",
                        marginLeft: 16,
                        color: "#39471d",
                        fontSize: 24,
                        lineHeight: 1,
                        fontFamily: "sans-serif",
                        fontWeight: 300,
                        flexShrink: 0,
                        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </button>

                  {/* Animated content wrapper (CSS grid trick — smooth with no JS height calc) */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <div className="px-6 pb-5">

                        {/* Paragraphs */}
                        {phase.paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="text-[#39471D] text-[13px] leading-[1.6] mb-3"
                            style={font.book}
                          >
                            {p}
                          </p>
                        ))}

                        {/* Bullet list — Card 1 only */}
                        {phase.bullets && phase.bullets.length > 0 && (
                          <ul
                            className="text-[#39471D] text-[13px] leading-[1.6] list-none p-0 mb-4"
                            style={font.book}
                          >
                            {phase.bullets.map((b, i) => (
                              <li key={i}>• {b}</li>
                            ))}
                          </ul>
                        )}

                        {/* Footer: phase icon + badge label + days badge (Card 1 only) */}
                        <div className="flex items-center gap-[10px] mt-3">
                          <div className="size-[30px] shrink-0">
                            <PhaseIcon />
                          </div>
                          {phase.badge && (
                            <span
                              className="text-[#39471D] text-[13px] whitespace-nowrap"
                              style={font.bold}
                            >
                              {phase.badge}
                            </span>
                          )}
                          {phase.showDays && (
                            <div
                              className="relative shrink-0"
                              style={{ width: 157, height: 31 }}
                            >
                              <Group272 />
                            </div>
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
      </div>
    </div>
  );
}
