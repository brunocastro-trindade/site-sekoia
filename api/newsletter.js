
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
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "api/newsletter ativo", runtime: "vercel" });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const b = await readBody(req);


  if (b.website_hp) return res.status(200).json({ success: true });

  const email = String(b.email || "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return res.status(422).json({ error: "Informe um e-mail válido." });
  }

  const origem = String(b.origem || "rodape").trim().slice(0, 80);


  const campos = [
    { id: 1326, nome: "Nome", valor: "Newsletter (rodapé)", campo_extra: false },
    { id: 1327, nome: "Cargo", valor: "", campo_extra: false },
    { id: 1328, nome: "Email", valor: email, campo_extra: false },
    { id: 1329, nome: "Telefone", valor: "", campo_extra: false },
    { id: 1330, nome: "Empresa", valor: "", campo_extra: false },
    { id: 1331, nome: "Tipo", valor: "Newsletter", campo_extra: false },
    {
      id: 1332,
      nome: "Como podemos te ajudar?",
      valor: `Opt-in de newsletter — origem: ${origem}`,
      campo_extra: false,
    },
    { id: 1333, nome: "Investimento", valor: "", campo_extra: false },
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
      .json({ error: "Não foi possível inscrever agora. Tente novamente.", namtab_status: r.status });
  } catch {
    return res.status(502).json({ error: "Não foi possível inscrever agora. Tente novamente." });
  }
}
