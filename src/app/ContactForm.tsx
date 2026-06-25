import { useState } from "react";
import { submitLead } from "../lib/leads";
import { openWhatsApp } from "../lib/contact";

const inputClass =
  "w-full bg-[#f7f7f7] border border-[#c5c5c5] rounded-[10px] px-4 py-[10px] text-[14px] text-[#39471D] placeholder-[#c5c5c5] outline-none focus:border-[#a0a320] transition-colors disabled:opacity-60";

const font = {
  bold: { fontFamily: "'Gotham:Bold', 'Montserrat', sans-serif" } as React.CSSProperties,
  book: { fontFamily: "'Gotham:Book', 'Montserrat', sans-serif" } as React.CSSProperties,
};

const initialForm = {
  nome: "",
  sobrenome: "",
  email: "",
  telefone: "",
  empresa: "",
  cargo: "",
  funcionarios: "",
  site: "",
  investimento: "",
  mensagem: "",
};

type FormState = typeof initialForm;
type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nome.trim() || !form.email.trim()) {
      setStatus("error");
      setMessage("Preencha pelo menos Nome e E-mail.");
      return;
    }
    if (!checked) {
      setStatus("error");
      setMessage("É preciso aceitar receber as comunicações para enviar.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await submitLead({ ...form, consent: checked });
      setStatus("success");
      setMessage("Recebemos seus dados! Em breve entraremos em contato.");
      setForm(initialForm);
      setChecked(false);
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? `Não foi possível enviar: ${err.message}`
          : "Não foi possível enviar. Tente novamente.",
      );
    }
  }

  const loading = status === "loading";

  return (
    <div className="w-full flex flex-col items-center px-4 py-10 bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-[15px] p-6 flex flex-col gap-3"
        style={{ maxWidth: 1160, background: "#39471D" }}
      >
        {/* Honeypot anti-spam */}
        <input
          name="website_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] top-0 size-px opacity-0"
        />

        {/* Row 1: Nome | Sobrenome */}
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} style={font.book} placeholder="Nome"      value={form.nome}      onChange={update("nome")}      disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Sobrenome" value={form.sobrenome} onChange={update("sobrenome")} disabled={loading} />
        </div>

        {/* Row 2: E-mail | Telefone | Empresa */}
        <div className="grid grid-cols-3 gap-3">
          <input className={inputClass} style={font.book} placeholder="E-mail"            type="email" value={form.email}    onChange={update("email")}    disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Telefone/WhatsApp"              value={form.telefone} onChange={update("telefone")} disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Empresa"                        value={form.empresa}  onChange={update("empresa")}  disabled={loading} />
        </div>

        {/* Row 3: Cargo | Funcionários | Site */}
        <div className="grid grid-cols-3 gap-3">
          <input className={inputClass} style={font.book} placeholder="Cargo"              value={form.cargo}        onChange={update("cargo")}        disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Nº de funcionários" value={form.funcionarios} onChange={update("funcionarios")} disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="www.site.com.br"    value={form.site}         onChange={update("site")}         disabled={loading} />
        </div>

        {/* Row 4: Investimento */}
        <input
          className={inputClass}
          style={font.book}
          placeholder="Quanto sua empresa investe em marketing mensalmente?"
          value={form.investimento}
          onChange={update("investimento")}
          disabled={loading}
        />

        {/* Row 5: Mensagem */}
        <textarea
          className={`${inputClass} resize-none`}
          style={{ ...font.book, minHeight: 110 }}
          placeholder="Qual é o tipo de ajuda que você procura? Conte um pouco sobre o problema que está enfrentando hoje."
          value={form.mensagem}
          onChange={update("mensagem")}
          disabled={loading}
        />

        {/* Checkbox */}
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => setChecked(!checked)}
            disabled={loading}
            className="shrink-0 w-[18px] h-[18px] border-2 border-white rounded-[2px] flex items-center justify-center transition-colors disabled:opacity-60"
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
          <span className="text-white text-[13px] leading-[1.4]" style={font.bold}>
            Aceito receber e-mails personalizados com estratégias e materiais sobre marketing digital
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 self-end px-8 py-3 rounded-[10px] text-white text-[15px] transition-opacity disabled:opacity-60"
          style={{ background: "#a0a320", ...font.bold }}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>

        {/* Feedback */}
        {status === "success" && (
          <p className="text-[#a0a320] text-[14px] text-center" style={font.book}>{message}</p>
        )}
        {status === "error" && (
          <p className="text-red-300 text-[14px] text-center" style={font.book}>{message}</p>
        )}
      </form>

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
          fontFamily: "'Gotham:Bold', 'Montserrat', sans-serif",
          fontWeight: 700,
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
