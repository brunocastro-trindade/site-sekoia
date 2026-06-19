import { getSupabase } from "./supabase";

/** Dados de um lead capturado pelo formulário de contato. */
export interface LeadInput {
  nome: string;
  sobrenome?: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  num_funcionarios?: string;
  site?: string;
  investimento_marketing?: string;
  mensagem?: string;
  aceite_comunicacao: boolean;
}

/**
 * Insere um lead na tabela `leads` do Supabase.
 * A política de RLS permite apenas INSERT pela role anônima — leituras
 * acontecem somente pelo painel do Supabase / service role.
 */
export async function submitLead(input: LeadInput): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.from("leads").insert({
    nome: input.nome.trim(),
    sobrenome: input.sobrenome?.trim() || null,
    email: input.email.trim().toLowerCase(),
    telefone: input.telefone?.trim() || null,
    empresa: input.empresa?.trim() || null,
    cargo: input.cargo?.trim() || null,
    num_funcionarios: input.num_funcionarios?.trim() || null,
    site: input.site?.trim() || null,
    investimento_marketing: input.investimento_marketing?.trim() || null,
    mensagem: input.mensagem?.trim() || null,
    aceite_comunicacao: input.aceite_comunicacao,
    origem: "site-sekoia",
  });

  if (error) {
    throw new Error(error.message);
  }
}
