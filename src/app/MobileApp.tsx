import { useState } from "react";
import ContactForm from "./ContactForm";
import { PHASES } from "./MethodologySection";
import { TreeVideo } from "../components/TreeVideo";
import { openWhatsApp, openWhatsAppNumber, WHATSAPP_NUMBER_FOOTER } from "../lib/contact";

const GREEN = "#39471d";
const OLIVE = "#a0a320";

const gotham = (w: "Black" | "Bold" | "Medium" | "Book" = "Medium") =>
  ({ fontFamily: `'Gotham:${w}', 'Montserrat', sans-serif` } as React.CSSProperties);

const HEADER_H = 60; // altura do header fixo (para não esconder a seção)

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_H;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

const NAV: [string, string][] = [
  ["Soluções", "solucoes"],
  ["Orçamentos", "orcamentos"],
  ["Contato", "contato"],
];

/** Faixa "ticker" horizontal contínua (versão mobile, sem diagonal). */
function MobileTicker() {
  const unit = Array(8).fill("A SEKOIA PODE TE AJUDAR").join("  •  ");
  return (
    <div className="overflow-hidden py-3" style={{ background: OLIVE }}>
      <div className="sek-ticker" style={{ width: "max-content" }}>
        <span className="whitespace-nowrap px-3 text-[13px]" style={{ color: GREEN, ...gotham("Bold") }}>{unit}</span>
        <span className="whitespace-nowrap px-3 text-[13px]" aria-hidden="true" style={{ color: GREEN, ...gotham("Bold") }}>{unit}</span>
      </div>
    </div>
  );
}

/** Metodologia em accordion vertical (texto completo, sem cap de altura). */
function MobileMethodology() {
  const [openId, setOpenId] = useState<number | null>(1);
  return (
    <section className="px-5 py-8">
      <div className="rounded-[20px] p-5" style={{ background: GREEN }}>
        <h2 className="mb-4 text-[20px] text-white" style={gotham("Bold")}>
          Conheça a metodologia que vamos aplicar no seu negócio!
        </h2>
        <div className="flex flex-col gap-3">
          {PHASES.map((phase) => {
            const isOpen = openId === phase.id;
            const Icon = phase.Icon;
            return (
              <div key={phase.id} className="overflow-hidden rounded-[15px] bg-[#f7f7f7]">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : phase.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="pr-3 text-[15px] text-[#39471d]" style={gotham("Bold")}>{phase.title}</span>
                  <span
                    aria-hidden="true"
                    style={{ fontSize: 26, lineHeight: 1, color: GREEN, flexShrink: 0, transition: "transform .4s cubic-bezier(0.16,1,0.3,1)", transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows .5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ overflow: "hidden" }}>
                    <div className="px-5 pb-5">
                      {phase.paragraphs.map((p, i) => (
                        <p key={i} className="mb-2 text-[14px] leading-relaxed text-[#39471d]" style={gotham("Medium")}>{p}</p>
                      ))}
                      {phase.bullets && (
                        <ul className="m-0 list-none p-0 text-[14px] leading-relaxed text-[#39471d]" style={gotham("Medium")}>
                          {phase.bullets.map((b, i) => (
                            <li key={i}>• {b}</li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="size-[28px] shrink-0">
                          <Icon />
                        </div>
                        {phase.badge && (
                          <span className="text-[13px] text-[#39471d]" style={gotham("Bold")}>{phase.badge}</span>
                        )}
                        {phase.showDays && (
                          <span className="rounded-full px-3 py-1 text-[12px] text-[#39471d]" style={{ background: "rgba(160,163,32,0.25)", ...gotham("Bold") }}>
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

/**
 * Layout mobile dedicado (reflow real): coluna única, texto legível e botões
 * com área de toque confortável. Renderizado por App abaixo de 900px.
 */
export function MobileApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (id: string) => {
    setMenuOpen(false);
    // Espera o menu fechar (relayout) antes de rolar, para o alvo ficar estável.
    setTimeout(() => scrollToId(id), 60);
  };

  return (
    <div className="w-full bg-white" style={{ color: GREEN, fontFamily: "'Gotham', sans-serif" }}>
      {/* ── Header sticky ── */}
      <div className="sticky top-0 z-50 shadow-md" style={{ background: OLIVE }}>
        <header className="flex items-center justify-between px-4 py-3">
          <img src="/logo-sekoia.png" alt="Sekoia Growth Marketing" className="h-8 w-auto" />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="p-2 -mr-2"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </header>
        {menuOpen && (
          <nav className="flex flex-col gap-2 px-4 pb-4">
            {NAV.map(([label, id]) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                className="rounded-full bg-white px-4 py-3 text-left text-[15px]"
                style={gotham("Bold")}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openWhatsApp();
              }}
              className="rounded-full px-4 py-3 text-white text-[15px]"
              style={{ background: GREEN, ...gotham("Bold") }}
            >
              Quero uma equipe profissional
            </button>
          </nav>
        )}
      </div>

      {/* ── Hero ── */}
      <section id="solucoes" className="px-5 pt-8 pb-6">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] text-white"
          style={{ background: GREEN, ...gotham("Bold") }}
        >
          <span className="text-[8px]">●</span> Performance &amp; Resultados
        </span>

        <h1 className="mt-4 leading-[0.98] break-words" style={{ fontFamily: "'Gotham Black:Regular', 'Montserrat', sans-serif", fontSize: "clamp(30px, 9.5vw, 62px)", color: GREEN }}>
          <span className="block">+vendas.</span>
          <span className="block underline decoration-4 underline-offset-4" style={{ color: OLIVE, textDecorationColor: OLIVE }}>
            +previsibilidade.
          </span>
          <span className="block">+escala.</span>
        </h1>

        <p className="mt-5 text-[15px] leading-relaxed" style={gotham("Medium")}>
          Suas vendas dependem só de indicações? Com a SEKOIA, sua empresa passa a
          usar tráfego pago estratégico no Google, Meta e outras plataformas — para
          alcançar o público certo e acelerar os resultados.
        </p>

        <button
          type="button"
          onClick={() => openWhatsApp()}
          className="mt-6 w-full rounded-[12px] py-4 text-[15px] text-white"
          style={{ background: GREEN, ...gotham("Bold") }}
        >
          Quero uma equipe profissional
        </button>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {["Estratégia", "Performance", "Escala", "Inteligência"].map((c) => (
            <div
              key={c}
              className="rounded-[20px] bg-[#fafafa] py-7 text-center text-[15px] shadow-[inset_-3px_-3px_6px_-2px_rgba(0,0,0,0.2),inset_3px_3px_6px_-2px_rgba(0,0,0,0.2)]"
              style={gotham("Bold")}
            >
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* ── Tráfego pago ── */}
      <section className="px-5 py-6">
        <div className="rounded-[18px] py-8 text-center" style={{ background: GREEN }}>
          <h2 className="text-white" style={{ fontFamily: "'Rogoro:Regular', 'Montserrat', sans-serif", fontSize: "clamp(38px, 13vw, 60px)" }}>
            Tráfego pago
          </h2>
        </div>
      </section>

      {/* ── Como podemos te ajudar + vídeo ── */}
      <section className="px-5 pb-8">
        <h2 className="text-[22px]" style={gotham("Bold")}>
          Como podemos te ajudar com Tráfego pago
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed" style={gotham("Medium")}>
          O Tráfego Pago é uma das formas mais rápidas de gerar oportunidades: seus
          anúncios aparecem para o público ideal, com controle total sobre
          investimento, segmentação e resultados.
        </p>
        <div className="mx-auto mt-5 overflow-hidden rounded-[16px]" style={{ width: "72%", maxWidth: 280, aspectRatio: "9 / 16" }}>
          <TreeVideo />
        </div>
        <button
          type="button"
          onClick={() => openWhatsApp("Olá! Vim pelo site da Sekoia e gostaria de falar com um especialista.")}
          className="mt-6 w-full rounded-[14px] py-4 text-[15px] text-white"
          style={{ background: "#1fcb41", ...gotham("Bold") }}
        >
          Fale com um especialista
        </button>
      </section>

      {/* ── Ticker ── */}
      <MobileTicker />

      {/* ── Metodologia ── */}
      <MobileMethodology />

      {/* ── Seja o próximo case ── */}
      <section className="px-5 py-8">
        <h2 className="text-[22px]" style={gotham("Bold")}>
          Seja o próximo case de Tráfego pago com a Sekoia
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed" style={gotham("Medium")}>
          A solução de Tráfego Pago da SEKOIA já ajudou empresas a conquistarem mais
          visibilidade, oportunidades comerciais e crescimento sustentável através da
          mídia digital.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed" style={gotham("Medium")}>
          Nosso cliente Brumix Concreto ampliou significativamente a qualidade dos leads
          gerados, enquanto outro cliente conquistou um crescimento significativo no
          volume de oportunidades comerciais através das campanhas de mídia paga.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed" style={gotham("Medium")}>
          Conte com o Tráfego Pago da SEKOIA para atrair mais clientes, aumentar suas
          vendas e acelerar os resultados do seu negócio.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => openWhatsApp("Olá! Vim pelo site da Sekoia e gostaria de falar com um especialista.")}
            className="w-full rounded-[12px] py-4 text-[15px] text-white"
            style={{ background: GREEN, ...gotham("Bold") }}
          >
            Fale com um especialista
          </button>
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="w-full rounded-[12px] py-4 text-[15px] text-white"
            style={{ background: "#1fcb41", ...gotham("Bold") }}
          >
            Nos chame no WhatsApp
          </button>
        </div>
      </section>

      {/* ── Formulário (reaproveitado) ── */}
      <section id="orcamentos" className="pt-2">
        <h2 className="px-5 text-center text-[20px]" style={{ color: GREEN, ...gotham("Bold") }}>
          INTERESSADO? SOLICITE UM ORÇAMENTO
        </h2>
        <ContactForm />
      </section>

      {/* ── Rodapé ── */}
      <footer id="contato" className="mt-2 border-t border-[#e5e5e5] px-5 py-10">
        <p className="text-[18px]" style={gotham("Bold")}>Sekoia Marketing</p>
        <a href="mailto:contato@sekoiamarketing.com.br" className="mt-2 block text-[14px] hover:underline" style={gotham("Medium")}>
          contato@sekoiamarketing.com.br
        </a>
        <p className="text-[14px]" style={gotham("Medium")}>+55 (47) 99215-6393</p>
        <p className="mt-2 text-[13px]" style={{ ...gotham("Medium"), color: "#6b7355" }}>CNPJ 66.526.186/0001-25</p>

        <a
          href="https://www.instagram.com/sekoia.ag/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram da Sekoia"
          className="mt-3 -ml-2 inline-flex p-2"
          style={{ color: GREEN }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5.5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <div className="mt-4 flex flex-wrap gap-x-5 text-[14px]" style={gotham("Medium")}>
          {["Cursos", "Mentoria", "Palestras", "Contato"].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => openWhatsAppNumber(WHATSAPP_NUMBER_FOOTER)}
              className="inline-flex min-h-[44px] items-center underline"
            >
              {l}
            </button>
          ))}
        </div>
        <p className="mt-5 text-[12px]" style={{ ...gotham("Medium"), color: "#9aa088" }}>
          Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
