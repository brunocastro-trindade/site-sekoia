import { useState } from "react";
import ContactForm from "./ContactForm";
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
