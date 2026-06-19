import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// As credenciais públicas vêm das variáveis de ambiente do Vite.
// Copie o arquivo `.env.example` para `.env.local` e preencha os valores
// do seu projeto Supabase (Settings → API).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

/**
 * Retorna o cliente Supabase (singleton).
 * Lança um erro claro caso as variáveis de ambiente não estejam configuradas,
 * em vez de quebrar o carregamento da página inteira.
 */
export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local (veja .env.example).",
    );
  }
  if (!client) {
    client = createClient(url, anonKey);
  }
  return client;
}

/** Indica se as credenciais do Supabase estão presentes no ambiente. */
export const isSupabaseConfigured = Boolean(url && anonKey);
