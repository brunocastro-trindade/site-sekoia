import { useRef, useState } from "react";
import { openWhatsApp } from "../lib/contact";
import { trackLead } from "../lib/pixel";

// O formulário é da marca (visual da empresa) e envia para o Namtab através de
// uma Serverless Function na Vercel (/api/submit), que repassa servidor-a-servidor
// (sem esbarrar em CORS). A Vercel não executa PHP — por isso não usamos submit.php.
const SUBMIT_ENDPOINT = "/api/submit";

const inputClass =
  "w-full bg-[#f7f7f7] border border-[#c5c5c5] rounded-[10px] px-4 py-[10px] text-[14px] text-[#39471D] placeholder-[#c5c5c5] outline-none focus:border-[#a0a320] transition-colors disabled:opacity-60";

const font = {
  bold: { fontFamily: "'Gotham:Bold', 'Montserrat', sans-serif" } as React.CSSProperties,
  book: { fontFamily: "'Gotham:Medium', 'Montserrat', sans-serif" } as React.CSSProperties,
};

const initialForm = {
  nome: "",
  cargo: "",
  email: "",
  telefone: "",
  empresa: "",
  tipo: "",
  investimento: "",
  ajuda: "",
};

type FormState = typeof initialForm;
type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

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
      const res = await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website_hp: honeypotRef.current?.value || "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Falha ao enviar (HTTP ${res.status}). Tente novamente.`);
      }
      trackLead();
      setStatus("success");
      setMessage("Recebemos seus dados! Em breve entraremos em contato.");
      setForm(initialForm);
      setChecked(false);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.");
    }
  }

  const loading = status === "loading";

  return (
    <div className="w-full flex flex-col items-center px-4 py-10 bg-white">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-[15px] p-4 sm:p-6 flex flex-col gap-3"
        style={{ maxWidth: 1140, background: "#39471D" }}
      >
        {/* Honeypot anti-spam */}
        <input
          ref={honeypotRef}
          name="website_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] top-0 size-px opacity-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className={inputClass} style={font.book} placeholder="Nome*"    value={form.nome}  onChange={update("nome")}  disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Cargo"    value={form.cargo} onChange={update("cargo")} disabled={loading} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className={inputClass} style={font.book} placeholder="E-mail*" type="email" value={form.email}    onChange={update("email")}    disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Telefone/WhatsApp"    value={form.telefone} onChange={update("telefone")} disabled={loading} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className={inputClass} style={font.book} placeholder="Empresa"              value={form.empresa} onChange={update("empresa")} disabled={loading} />
          <input className={inputClass} style={font.book} placeholder="Segmento / tipo de negócio" value={form.tipo} onChange={update("tipo")} disabled={loading} />
        </div>

        <input
          className={inputClass}
          style={font.book}
          placeholder="Quanto sua empresa investe em marketing mensalmente?"
          value={form.investimento}
          onChange={update("investimento")}
          disabled={loading}
        />

        <textarea
          className={`${inputClass} resize-none`}
          style={{ ...font.book, minHeight: 110 }}
          placeholder="Como podemos te ajudar? Conte um pouco sobre o problema que está enfrentando hoje."
          value={form.ajuda}
          onChange={update("ajuda")}
          disabled={loading}
        />

        {/* Consentimento (LGPD) */}
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

        <div className="flex flex-wrap items-center gap-4 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-[10px] text-white text-[15px] transition-opacity disabled:opacity-60"
            style={{ background: "#a0a320", ...font.bold }}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
          {status === "success" && (
            <span className="text-[#cdec6a] text-[14px]" style={font.book}>{message}</span>
          )}
          {status === "error" && (
            <span className="text-red-300 text-[14px]" style={font.book}>{message}</span>
          )}
        </div>
      </form>

      {/* CTA button — abre o WhatsApp */}
      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="w-full mt-5 py-[16px] text-center text-[15px]"
        style={{
          maxWidth: 1140,
          background: "#1fcb41",
          borderRadius: 16,
          color: "#fffefc",
          ...font.bold,
          letterSpacing: "0.02em",
          cursor: "pointer",
          border: "none",
          lineHeight: 1.25,
        }}
      >
        SOLICITE SEU ORÇAMENTO, AGORA MESMO!
      </button>
    </div>
  );
}
