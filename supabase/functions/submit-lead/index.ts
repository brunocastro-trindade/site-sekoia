import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function clean(val: unknown, max = 500): string {
  return typeof val === "string" ? val.trim().slice(0, max) : "";
}

function isEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const payload = await req.json();

    // Honeypot anti-spam
    if (clean(payload.website_hp)) {
      return Response.json({ ok: true }, { headers: CORS });
    }

    const nome  = clean(payload.nome, 100);
    const email = clean(payload.email, 200);

    if (!nome)           return Response.json({ error: "Nome é obrigatório." },  { status: 400, headers: CORS });
    if (!isEmail(email)) return Response.json({ error: "E-mail inválido." },     { status: 400, headers: CORS });

    const lead = {
      nome,
      sobrenome:    clean(payload.sobrenome,    100),
      email,
      telefone:     clean(payload.telefone,      50),
      empresa:      clean(payload.empresa,      100),
      cargo:        clean(payload.cargo,        100),
      funcionarios: clean(payload.funcionarios,  50),
      site:         clean(payload.site,         200),
      investimento: clean(payload.investimento, 200),
      mensagem:     clean(payload.mensagem,    2000),
      consent:      payload.consent === true,
      source:       clean(payload.source, 100) || "landing-trafego-pago",
      user_agent:   req.headers.get("user-agent")?.slice(0, 300) ?? null,
    };

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error: dbError } = await supabase.from("marketing_leads").insert(lead);
    if (dbError) throw dbError;

    // E-mail de notificação (opcional — falha não derruba o salvamento)
    const resendKey   = Deno.env.get("RESEND_API_KEY");
    const notifyEmail = Deno.env.get("LEAD_NOTIFY_EMAIL");
    const fromEmail   = Deno.env.get("LEAD_FROM_EMAIL") ?? "onboarding@resend.dev";

    if (resendKey && notifyEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from:    fromEmail,
          to:      notifyEmail.split(",").map((e) => e.trim()),
          subject: `Novo lead: ${nome} (${email})`,
          html:    `<pre>${JSON.stringify(lead, null, 2)}</pre>`,
        }),
      }).catch(() => {});
    }

    return Response.json({ ok: true }, { headers: CORS });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erro interno. Tente novamente." }, { status: 500, headers: CORS });
  }
});
