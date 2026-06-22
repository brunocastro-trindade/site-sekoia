const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export type LeadInput = {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
  funcionarios: string;
  site: string;
  investimento: string;
  mensagem: string;
  consent: boolean;
  website_hp?: string;
};

export async function submitLead(data: LeadInput): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Configuração do Supabase ausente (.env).");
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ ...data, source: "landing-trafego-pago" }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || "Falha ao enviar. Tente novamente.");
  }
}
