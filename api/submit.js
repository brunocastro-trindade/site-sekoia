// Vercel Serverless Function: recebe o formulário da marca (mesmo domínio) e
// repassa o lead para o Namtab servidor-a-servidor (sem esbarrar em CORS).
// Endpoint público: POST /api/submit
//
// Substitui o antigo submit.php (a Vercel não executa PHP).

const NAMTAB_ENDPOINT =
  "https://qbdofrofxcnkcfhyroot.supabase.co/functions/v1/submit-form-data";
const AGENCIA_ID = 149;

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
  // Auto-teste: GET confirma que a function está ativa.
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "api/submit ativo", runtime: "vercel" });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const b = await readBody(req);

  // Anti-spam: honeypot preenchido = descarta silenciosamente.
  if (b.website_hp) return res.status(200).json({ success: true });

  const nome = String(b.nome || "").trim();
  const email = String(b.email || "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!nome || !emailOk) {
    return res.status(422).json({ error: "Preencha o nome e um e-mail válido." });
  }

  const val = (k) => String(b[k] || "").trim();
  const campos = [
    { id: 1326, nome: "Nome", valor: nome, campo_extra: false },
    { id: 1327, nome: "Cargo", valor: val("cargo"), campo_extra: false },
    { id: 1328, nome: "Email", valor: email, campo_extra: false },
    { id: 1329, nome: "Telefone", valor: val("telefone"), campo_extra: false },
    { id: 1330, nome: "Empresa", valor: val("empresa"), campo_extra: false },
    { id: 1331, nome: "Tipo", valor: val("tipo"), campo_extra: false },
    { id: 1332, nome: "Como podemos te ajudar?", valor: val("ajuda"), campo_extra: false },
    { id: 1333, nome: "Investimento", valor: val("investimento"), campo_extra: false },
  ];

  try {
    const r = await fetch(NAMTAB_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agencia_id: AGENCIA_ID, campos }),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok && data && data.success) {
      return res.status(200).json({ success: true });
    }
    return res
      .status(502)
      .json({ error: "Não foi possível enviar agora. Tente novamente.", namtab_status: r.status });
  } catch {
    return res.status(502).json({ error: "Não foi possível enviar agora. Tente novamente." });
  }
}
