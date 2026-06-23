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
  shortLabel: string;
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
    shortLabel: "1ª fase",
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
    shortLabel: "2ª fase",
    title: "Rampagem",
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
    shortLabel: "3ª fase",
    title: "Ongoing",
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
  // Card 1 starts open (matches the original Figma design); Cards 2 & 3 hidden until clicked
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) =>
    setOpenId((prev) => (prev === id ? null : id));

  // Build CSS grid columns: open card gets 5x the space of closed ones
  const gridCols = PHASES.map((p) =>
    openId === p.id ? "5fr" : "1fr"
  ).join(" ");

  return (
    <div className="w-full flex justify-center px-5 py-[30px] bg-white">
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
            className="shrink-0 flex items-center px-7 py-7"
            style={{ width: 240 }}
          >
            <h2
              className="text-white text-[22px] leading-[1.35]"
              style={font.bold}
            >
              Conheça a metodologia que vamos aplicar no seu negócio!
            </h2>
          </div>

          {/* ── Horizontal accordion ── */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: gridCols,
              gap: 8,
              padding: 12,
              transition: "grid-template-columns 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
              minWidth: 0,
            }}
          >
            {PHASES.map((phase) => {
              const isOpen = openId === phase.id;
              const PhaseIcon = phase.Icon;

              return (
                <div
                  key={phase.id}
                  onClick={() => toggle(phase.id)}
                  className="rounded-[14px] bg-[#f7f7f7] border border-[#c5c5c5] flex flex-col cursor-pointer overflow-hidden"
                  style={{
                    minWidth: 0,
                    transition: "box-shadow 0.3s ease",
                    boxShadow: isOpen ? "0 4px 18px rgba(57,71,29,0.18)" : "none",
                  }}
                >
                  {/* Card header — always visible */}
                  <div className="flex items-start justify-between px-4 pt-4 pb-2 shrink-0">
                    <p
                      className="text-[#39471D] text-[13px] leading-[1.3] min-w-0 truncate"
                      style={font.bold}
                    >
                      {phase.shortLabel}
                    </p>
                    <span
                      aria-hidden="true"
                      style={{
                        display: "block",
                        marginLeft: 8,
                        flexShrink: 0,
                        color: "#39471d",
                        fontSize: 20,
                        lineHeight: 1,
                        fontWeight: 300,
                        fontFamily: "sans-serif",
                        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </div>

                  {/* Expanded content — fades in when open, hidden otherwise */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      paddingLeft: 16,
                      paddingRight: 16,
                      opacity: isOpen ? 1 : 0,
                      pointerEvents: isOpen ? "auto" : "none",
                      transition: isOpen
                        ? "opacity 0.35s ease 0.2s"
                        : "opacity 0.15s ease",
                    }}
                  >
                    {/* Full phase title */}
                    <p
                      className="text-[#39471D] text-[15px] leading-[1.3] mb-2"
                      style={font.bold}
                    >
                      {phase.title}
                    </p>

                    {/* Intro paragraphs */}
                    {phase.paragraphs.map((p, i) => (
                      <p
                        key={i}
                        className="text-[#39471D] text-[12px] leading-[1.55] mb-2"
                        style={font.book}
                      >
                        {p}
                      </p>
                    ))}

                    {/* Bullet list — Card 1 only */}
                    {phase.bullets && phase.bullets.length > 0 && (
                      <ul
                        className="text-[#39471D] text-[12px] leading-[1.55] list-none p-0 mb-2"
                        style={font.book}
                      >
                        {phase.bullets.map((b, i) => (
                          <li key={i}>• {b}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Card footer — icon + badge + days (always at bottom) */}
                  <div className="flex items-center gap-[8px] px-4 pb-4 pt-2 mt-auto shrink-0">
                    <div className="size-[26px] shrink-0">
                      <PhaseIcon />
                    </div>
                    {isOpen && phase.badge && (
                      <span
                        className="text-[#39471D] text-[12px] whitespace-nowrap"
                        style={{
                          ...font.bold,
                          opacity: isOpen ? 1 : 0,
                          transition: isOpen ? "opacity 0.3s ease 0.25s" : "opacity 0.1s ease",
                        }}
                      >
                        {phase.badge}
                      </span>
                    )}
                    {isOpen && phase.showDays && (
                      <div
                        className="relative shrink-0"
                        style={{
                          width: 157,
                          height: 31,
                          opacity: isOpen ? 1 : 0,
                          transition: isOpen ? "opacity 0.3s ease 0.3s" : "opacity 0.1s ease",
                        }}
                      >
                        <Group272 />
                      </div>
                    )}
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
