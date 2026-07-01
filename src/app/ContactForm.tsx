import { openWhatsApp } from "../lib/contact";

// Formulário de captação hospedado no Namtab (a pessoa que preenche vira lead
// no sistema do Namtab, que dispara o webhook). Embutido via iframe.
const NAMTAB_FORM_URL = "https://web.namtab.io/form/sekoia-marketing-149";

const font = {
  bold: { fontFamily: "'Gotham:Bold', 'Montserrat', sans-serif" } as React.CSSProperties,
};

export default function ContactForm() {
  return (
    <div className="w-full flex flex-col items-center px-4 py-10 bg-white">
      {/* Card da marca envolvendo o formulário do Namtab */}
      <div
        className="w-full rounded-[15px] p-4 sm:p-6"
        style={{ maxWidth: 1160, background: "#39471D" }}
      >
        <div className="rounded-[10px] overflow-hidden bg-white">
          <iframe
            src={NAMTAB_FORM_URL}
            title="Formulário de contato Sekoia"
            width="100%"
            height="560"
            loading="lazy"
            style={{ border: "none", display: "block", width: "100%" }}
          />
        </div>
      </div>

      {/* CTA button — fica logo abaixo do formulário; abre o WhatsApp */}
      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="w-full mt-5 py-[18px] text-center text-[16px]"
        style={{
          maxWidth: 1160,
          background: "#1fcb41",
          borderRadius: 20,
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
