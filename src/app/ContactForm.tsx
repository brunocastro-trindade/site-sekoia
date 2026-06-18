import { useState } from "react";

const inputClass =
  "w-full bg-[#f7f7f7] border border-[#c5c5c5] rounded-[10px] px-4 py-[10px] text-[14px] text-[#39471D] placeholder-[#c5c5c5] outline-none focus:border-[#a0a320] transition-colors";

const font = {
  bold: { fontFamily: "'Gotham:Bold', 'Montserrat', sans-serif" } as React.CSSProperties,
  book: { fontFamily: "'Gotham:Book', 'Montserrat', sans-serif" } as React.CSSProperties,
};

export default function ContactForm() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="w-full flex flex-col items-center px-4 py-10 bg-white">
      {/* Dark green form card */}
      <div
        className="w-full rounded-[15px] p-6 flex flex-col gap-3"
        style={{ maxWidth: 1160, background: "#39471D" }}
      >
        {/* Row 1: Nome | Sobrenome */}
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} style={font.book} placeholder="Nome" />
          <input className={inputClass} style={font.book} placeholder="Sobrenome" />
        </div>

        {/* Row 2: E-mail | Telefone/WhatsApp | Empresa */}
        <div className="grid grid-cols-3 gap-3">
          <input className={inputClass} style={font.book} placeholder="E-mail" />
          <input className={inputClass} style={font.book} placeholder="Telefone/WhatsApp" />
          <input className={inputClass} style={font.book} placeholder="Empresa" />
        </div>

        {/* Row 3: Cargo | Nº de funcionários | www.site.com.br */}
        <div className="grid grid-cols-3 gap-3">
          <input className={inputClass} style={font.book} placeholder="Cargo" />
          <input className={inputClass} style={font.book} placeholder="Nº de funcionários" />
          <input className={inputClass} style={font.book} placeholder="www.site.com.br" />
        </div>

        {/* Row 4: Investimento (full width) */}
        <input
          className={inputClass}
          style={font.book}
          placeholder="Quanto sua empresa investe em marketing mensalmente?"
        />

        {/* Row 5: Textarea (full width, taller) */}
        <textarea
          className={`${inputClass} resize-none`}
          style={{ ...font.book, minHeight: 110 }}
          placeholder="Qual é o tipo de ajuda que você procura? Conte um pouco sobre o problema que está enfrentando hoje."
        />

        {/* Checkbox row */}
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => setChecked(!checked)}
            className="shrink-0 w-[18px] h-[18px] border-2 border-white rounded-[2px] flex items-center justify-center transition-colors"
            style={{ background: checked ? "white" : "transparent" }}
            aria-checked={checked}
            role="checkbox"
          >
            {checked && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4L4 7.5L10 1" stroke="#39471D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span
            className="text-white text-[13px] leading-[1.4]"
            style={font.bold}
          >
            Aceito receber e-mails personalizados com estratégias e materiais sobre marketing digital
          </span>
        </div>
      </div>
    </div>
  );
}
