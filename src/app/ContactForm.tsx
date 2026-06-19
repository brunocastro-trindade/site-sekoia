import { useState } from "react";
import { submitLead } from "../lib/leads";

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
  num_funcionarios: "",
  site: "",
  investimento_marketing: "",
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
      await submitLead({ ...form, aceite_comunicacao: checked });
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
      {/* Dark green form card */}
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-[15px] p-6 flex flex-col gap-3"
        style={{ maxWidth: 1160, background: "#39471D" }}
      >
        {/* Row 1: Nome | Sobrenome */}
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} style={font.book} placeholder="Nome" value={form.nome} onChange={update("nome")} disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Sobrenome" value={form.sobrenome} onChange={update("sobrenome")} disabled={loading} />
        </div>

        {/* Row 2: E-mail | Telefone/WhatsApp | Empresa */}
        <div className="grid grid-cols-3 gap-3">
          <input className={inputClass} style={font.book} placeholder="E-mail" type="email" value={form.email} onChange={update("email")} disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Telefone/WhatsApp" value={form.telefone} onChange={update("telefone")} disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Empresa" value={form.empresa} onChange={update("empresa")} disabled={loading} />
        </div>

        {/* Row 3: Cargo | Nº de funcionários | www.site.com.br */}
        <div className="grid grid-cols-3 gap-3">
          <input className={inputClass} style={font.book} placeholder="Cargo" value={form.cargo} onChange={update("cargo")} disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Nº de funcionários" value={form.num_funcionarios} onChange={update("num_funcionarios")} disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="www.site.com.br" value={form.site} onChange={update("site")} disabled={loading} />
        </div>

        {/* Row 4: Investimento (full width) */}
        <input
          className={inputClass}
          style={font.book}
          placeholder="Quanto sua empresa investe em marketing mensalmente?"
          value={form.investimento_marketing}
          onChange={update("investimento_marketing")}
          disabled={loading}
        />

        {/* Row 5: Textarea (full width, taller) */}
        <textarea
          className={`${inputClass} resize-none`}
          style={{ ...font.book, minHeight: 110 }}
          placeholder="Qual é o tipo de ajuda que você procura? Conte um pouco sobre o problema que está enfrentando hoje."
          value={form.mensagem}
          onChange={update("mensagem")}
          disabled={loading}
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
            disabled={loading}
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

        {/* Submit + feedback */}
        <div className="flex items-center gap-4 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#a0a320] hover:bg-[#b4b81f] text-[#39471D] font-bold rounded-[10px] px-8 py-[10px] text-[14px] transition-colors disabled:opacity-60"
            style={font.bold}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
          {message && (
            <span
              role="status"
              className="text-[13px] leading-[1.4]"
              style={{ ...font.book, color: status === "success" ? "#cdec6a" : "#ffb3b3" }}
            >
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
