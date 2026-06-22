create table if not exists public.marketing_leads (
  id            uuid primary key default gen_random_uuid(),
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
  consent       boolean not null default false,
  source        text not null default 'landing-trafego-pago',
  user_agent    text,
  created_at    timestamptz not null default now()
);

create index if not exists marketing_leads_created_at_idx
  on public.marketing_leads (created_at desc);

-- RLS ligado SEM políticas públicas => deny-all para anon/authenticated.
-- Só a Edge Function (service role key) consegue inserir.
alter table public.marketing_leads enable row level security;
