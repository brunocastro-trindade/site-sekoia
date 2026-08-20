import { useRef, useState } from "react";
import { openWhatsApp } from "../lib/contact";
import { trackLead } from "../lib/pixel";

// O formulário é da marca (visual da empresa) e envia para o Namtab através de
// uma Serverless Function na Vercel (/api/submit), que repassa servidor-a-servidor
// (sem esbarrar em CORS). A Vercel não executa PHP — por isso não usamos submit.php.
const SUBMIT_ENDPOINT = "/api/submit";

const inputClass =
  "w-full rounded-xl border border-accent-bright/15 bg-input px-4 py-[10px] text-[14px] text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-accent-bright disabled:opacity-60";

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
      trackLead({ email: form.email, phone: form.telefone });
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
    <section id="orcamentos" className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <span className="eyebrow justify-center">Solicite um orçamento</span>
        <h2 className="mt-4 text-[28px] leading-tight text-foreground md:text-[38px]">
          Interessado neste serviço? Solicite um orçamento
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-card relative mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3 rounded-2xl p-5 sm:p-8"
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input className={inputClass} aria-label="Nome" placeholder="Nome*" value={form.nome} onChange={update("nome")} disabled={loading} />
          <input className={inputClass} aria-label="Cargo" placeholder="Cargo" value={form.cargo} onChange={update("cargo")} disabled={loading} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input className={inputClass} aria-label="E-mail" placeholder="E-mail*" type="email" value={form.email} onChange={update("email")} disabled={loading} />
          <input className={inputClass} aria-label="Telefone ou WhatsApp" placeholder="Telefone/WhatsApp" value={form.telefone} onChange={update("telefone")} disabled={loading} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input className={inputClass} aria-label="Empresa" placeholder="Empresa" value={form.empresa} onChange={update("empresa")} disabled={loading} />
          <input className={inputClass} aria-label="Segmento ou tipo de negócio" placeholder="Segmento / tipo de negócio" value={form.tipo} onChange={update("tipo")} disabled={loading} />
        </div>

        <input
          className={inputClass}
          aria-label="Investimento mensal em marketing"
          placeholder="Quanto sua empresa investe em marketing mensalmente?"
          value={form.investimento}
          onChange={update("investimento")}
          disabled={loading}
        />

        <textarea
          className={`${inputClass} resize-none`}
          style={{ minHeight: 110 }}
          aria-label="Como podemos te ajudar"
          placeholder="Como podemos te ajudar? Conte um pouco sobre o problema que está enfrentando hoje."
          value={form.ajuda}
          onChange={update("ajuda")}
          disabled={loading}
        />

        {/* Consentimento (LGPD) */}
        <div className="mt-1 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setChecked(!checked)}
            disabled={loading}
            className="flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 border-accent-bright/50 transition-colors disabled:opacity-60"
            style={{ background: checked ? "#c6ff4d" : "transparent" }}
            aria-checked={checked}
            role="checkbox"
          >
            {checked && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4L4 7.5L10 1" stroke="#0a0d06" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span className="text-left text-[13px] leading-[1.4] text-muted-foreground">
            Aceito receber e-mails personalizados com estratégias e materiais sobre marketing digital
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-accent-bright px-8 py-3 text-[15px] font-semibold text-accent-foreground transition-opacity disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
          {status === "success" && <span className="text-[14px] text-accent-bright">{message}</span>}
          {status === "error" && <span className="text-[14px] text-destructive">{message}</span>}
        </div>
      </form>
      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="mx-auto mt-5 block w-full max-w-3xl rounded-2xl border border-accent-bright/30 bg-secondary/40 py-4 text-center text-[15px] font-semibold uppercase tracking-[0.2em] text-accent-bright transition-colors hover:bg-accent-bright/10"
      >
        Solicite seu orçamento, agora mesmo
      </button>
    </section>
  );
}
