-- ============================================================================
-- Tabela de captação de leads do site Sekoia
-- ============================================================================
-- Aplique no seu projeto Supabase:
--   - Painel: SQL Editor → cole e rode este script; ou
--   - CLI:    supabase db push  (com este arquivo em supabase/migrations/)
-- ============================================================================

create table if not exists public.leads (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  nome                    text not null,
  sobrenome               text,
  email                   text not null,
  telefone                text,
  empresa                 text,
  cargo                   text,
  num_funcionarios        text,
  site                    text,
  investimento_marketing  text,
  mensagem                text,
  aceite_comunicacao      boolean not null default false,
  origem                  text not null default 'site-sekoia'
);

-- Índices úteis para consulta/dedupe.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
-- O site público usa a chave anônima (anon). Queremos permitir que ela
-- INSIRA leads, mas NUNCA leia/edite/apague. Leitura só pelo painel do
-- Supabase ou pela service_role (backend), que ignora RLS.
-- ----------------------------------------------------------------------------
alter table public.leads enable row level security;

drop policy if exists "anon pode inserir leads" on public.leads;
create policy "anon pode inserir leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- Observação: como não criamos policies de SELECT/UPDATE/DELETE para `anon`,
-- a role anônima fica impedida dessas operações por padrão (RLS nega tudo
-- que não tem policy explícita).
