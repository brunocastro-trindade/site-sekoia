-- ============================================================================
-- Tabela de captação de leads do site Sekoia (landing de tráfego pago)
-- ============================================================================
-- Aplique no seu projeto Supabase:
--   - Painel: SQL Editor -> cole e rode este script; ou
--   - CLI:    supabase db push  (com este arquivo em supabase/migrations/)
--
-- Fluxo de gravação (ver docs/CAPTACAO-DE-LEADS.md):
--   Formulário (React) -> submitLead() -> Edge Function `submit-lead`
--     -> insert nesta tabela usando a SERVICE_ROLE_KEY (ignora RLS).
-- A chave anon do frontend NUNCA toca a tabela diretamente.
-- ============================================================================

create table if not exists public.marketing_leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  nome          text not null,
  sobrenome     text,
  email         text not null,
  telefone      text,
  empresa       text,
  cargo         text,
  funcionarios  text,
  site          text,
  investimento  text,
  mensagem      text,
  consent       boolean not null default false,  -- aceite LGPD de comunicações
  source        text not null default 'landing-trafego-pago',
  user_agent    text
);

-- Índices úteis para listar os mais recentes e deduplicar por e-mail.
create index if not exists marketing_leads_created_at_idx
  on public.marketing_leads (created_at desc);
create index if not exists marketing_leads_email_idx
  on public.marketing_leads (email);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
-- RLS ligado SEM nenhuma policy pública => deny-all para anon/authenticated.
-- Apenas a Edge Function (SERVICE_ROLE_KEY) consegue inserir, pois a service
-- role ignora RLS. A leitura dos leads acontece pelo painel do Supabase
-- (Table Editor) ou por um backend usando a service role.
-- ----------------------------------------------------------------------------
alter table public.marketing_leads enable row level security;
