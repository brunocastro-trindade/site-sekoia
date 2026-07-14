// Vercel Serverless Function: Meta Conversions API com desduplicação.
// Recebe do navegador o MESMO event_id que o fbq disparou e reenvia o evento
// servidor-a-servidor à Graph API — o Meta casa os pares por event_name +
// event_id e conta o evento uma única vez.
//
// Endpoint público: POST /api/meta-capi
// Body: { event_name, event_id, event_source_url?, user_data?: { email?, phone? } }
//
// Variáveis de ambiente (Vercel → Settings → Environment Variables):
//   META_CAPI_ACCESS_TOKEN  (obrigatória) — token gerado no Events Manager:
//     Configurações do pixel → API de Conversões → Configuração manual → Gerar token.
//   META_CAPI_TEST_CODE     (opcional) — código de "Testar eventos" do Events
//     Manager, para validar os envios antes de ir para produção. Remover depois.

import { createHash } from "node:crypto";

const PIXEL_ID = "1217330763796782";
const GRAPH_URL = `https://graph.facebook.com/v23.0/${PIXEL_ID}/events`;

// Só os eventos que o site realmente dispara — qualquer outro nome é rejeitado.
const ALLOWED_EVENTS = new Set(["PageView", "Lead", "Contact"]);

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

/** E-mail normalizado (minúsculas, sem espaços) e hasheado, como o Meta exige. */
function hashEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? sha256(e) : null;
}

/** Telefone normalizado (só dígitos, com DDI; assume Brasil se faltar) e hasheado. */
function hashPhone(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (!d) return null;
  if ((d.length === 10 || d.length === 11) && !d.startsWith("55")) d = "55" + d;
  return d.length >= 10 ? sha256(d) : null;
}

/** Lê um cookie específico do header Cookie da request. */
function readCookie(req, name) {
  const m = String(req.headers.cookie || "").match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]+)`),
  );
  return m ? decodeURIComponent(m[1]) : null;
}

/** IP real do visitante atrás do proxy da Vercel. */
function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "");
  return fwd.split(",")[0].trim() || null;
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "api/meta-capi ativo",
      tokenConfigured: Boolean(process.env.META_CAPI_ACCESS_TOKEN),
    });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token) {
    // Sem token não há o que enviar; o cliente trata como fire-and-forget.
    return res.status(503).json({ error: "META_CAPI_ACCESS_TOKEN não configurado." });
  }

  const b = await readBody(req);
  const eventName = String(b.event_name || "");
  const eventId = String(b.event_id || "").slice(0, 128);
  if (!ALLOWED_EVENTS.has(eventName) || !eventId) {
    return res.status(422).json({ error: "event_name ou event_id inválido." });
  }

  const sourceUrl = String(b.event_source_url || "").slice(0, 1024);

  // fbc: cookie _fbc ou, na ausência, derivado do fbclid da URL (formato oficial).
  let fbc = readCookie(req, "_fbc");
  if (!fbc && sourceUrl) {
    try {
      const fbclid = new URL(sourceUrl).searchParams.get("fbclid");
      if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    } catch { /* URL malformada — segue sem fbc */ }
  }

  // custom_data opcional (value/currency) — o Meta usa para ROAS. Só repassa
  // se vier no formato exigido: número finito ≥ 0 e código de moeda de 3 letras.
  let customData = null;
  if (b.custom_data && typeof b.custom_data === "object") {
    const value = Number(b.custom_data.value);
    const currency = String(b.custom_data.currency || "").trim().toUpperCase();
    if (Number.isFinite(value) && value >= 0 && /^[A-Z]{3}$/.test(currency)) {
      customData = { value, currency };
    }
  }

  const userData = {
    client_ip_address: clientIp(req),
    client_user_agent: String(req.headers["user-agent"] || "") || null,
    fbp: readCookie(req, "_fbp"),
    fbc,
    em: hashEmail(b.user_data?.email) ? [hashEmail(b.user_data.email)] : undefined,
    ph: hashPhone(b.user_data?.phone) ? [hashPhone(b.user_data.phone)] : undefined,
  };
  // Remove campos vazios — a Graph API rejeita null em alguns deles.
  for (const k of Object.keys(userData)) {
    if (userData[k] == null) delete userData[k];
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: sourceUrl || undefined,
        user_data: userData,
        custom_data: customData || undefined,
      },
    ],
  };
  if (process.env.META_CAPI_TEST_CODE) {
    payload.test_event_code = process.env.META_CAPI_TEST_CODE;
  }

  try {
    const r = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      // Não vaza token nem detalhes internos; registra no log da Vercel.
      console.error("meta-capi: Graph API recusou", r.status, data?.error?.message);
      return res.status(502).json({ error: "Graph API recusou o evento." });
    }
    return res.status(200).json({ success: true, events_received: data.events_received });
  } catch (err) {
    console.error("meta-capi: falha de rede", err);
    return res.status(502).json({ error: "Falha ao contatar a Graph API." });
  }
}
