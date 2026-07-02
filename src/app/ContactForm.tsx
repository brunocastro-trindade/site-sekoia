import { openWhatsApp } from "../lib/contact";

// Formulário de captação hospedado no Namtab (a pessoa que preenche vira lead
// no sistema do Namtab, que dispara o webhook). Embutido via iframe.
const NAMTAB_FORM_URL = "https://web.namtab.io/form/sekoia-marketing-149";

// Largura do bloco de contato — acompanha a largura de conteúdo do site (faixas
// e header usam ~1140px), preenchendo as laterais e evitando espaço branco vazio.
const BLOCK_WIDTH = 1140;

const font = {
  bold: { fontFamily: "'Gotham:Bold', 'Montserrat', sans-serif" } as React.CSSProperties,
};

export default function ContactForm() {
  return (
    <div className="w-full flex flex-col items-center px-4 py-10 bg-white">
      {/* Moldura leve que abraça o formulário: cantos arredondados recortam o
          iframe, borda sutil e sombra suave (visual flutuante e moderno). */}
      <div
        className="w-full overflow-hidden bg-white"
        style={{
          maxWidth: BLOCK_WIDTH,
          borderRadius: 20,
          border: "1px solid #ececec",
          boxShadow: "0 14px 44px rgba(57, 71, 29, 0.14)",
        }}
      >
        <iframe
          src={NAMTAB_FORM_URL}
          title="Formulário de contato Sekoia"
          width="100%"
          height="620"
          loading="lazy"
          style={{ border: "none", display: "block", width: "100%" }}
        />
      </div>

      {/* CTA button — mesma largura do formulário; abre o WhatsApp */}
      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="w-full mt-5 py-[16px] text-center text-[15px]"
        style={{
          maxWidth: BLOCK_WIDTH,
          background: "#1fcb41",
          borderRadius: 16,
          color: "#fffefc",
          ...font.bold,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          cursor: "pointer",
          border: "none",
        }}
      >
        SOLICITE SEU ORÇAMENTO, AGORA MESMO!
      </button>
    </div>
  );
}
