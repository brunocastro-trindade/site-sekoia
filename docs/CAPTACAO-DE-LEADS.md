# Captação de Leads — Site Sekoia

Documentação do fluxo de captação de leads do formulário de contato e da sua
persistência no **Supabase**, além da conexão dos CTAs com o **WhatsApp**.

## 1. Visão geral

O formulário de contato (`src/app/ContactForm.tsx`) coleta os dados de um
potencial cliente e os grava na tabela `marketing_leads`. Para não expor a
escrita no banco ao frontend, a gravação passa por uma **Edge Function**
(`submit-lead`), que valida, aplica anti-spam e insere usando a `service_role`:

```
Formulário (React)  →  submitLead()   →  Edge Function `submit-lead`  →  tabela public.marketing_leads
   ContactForm.tsx      src/lib/leads.ts    supabase/functions/submit-lead     (Postgres + RLS deny-all)
```

A chave `anon` (pública) do frontend **não toca a tabela diretamente** — ela só
serve para autenticar a chamada à Edge Function. Quem insere é a `service_role`,
que vive apenas no servidor (segredo da função) e ignora o RLS.

## 2. Arquivos do backend

| Arquivo | Papel |
|---|---|
| `src/app/ContactForm.tsx` | Formulário controlado, validação, envio e feedback. |
| `src/lib/leads.ts` | Tipo `LeadInput` + `submitLead()` que chama a Edge Function. |
| `src/lib/contact.ts` | Número de WhatsApp + helper `openWhatsApp()` (CTAs). |
| `supabase/functions/submit-lead/index.ts` | Valida, anti-spam (honeypot) e insere o lead; e-mail opcional via Resend. |
| `supabase/migrations/0001_create_marketing_leads_table.sql` | Schema da tabela `marketing_leads` + RLS. |
| `.env.example` | Modelo das variáveis públicas do Supabase (frontend). |

## 3. Esquema do banco (`public.marketing_leads`)

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `created_at` | `timestamptz` | `now()` |
| `nome` | `text` | obrigatório |
| `sobrenome` | `text` | |
| `email` | `text` | obrigatório |
| `telefone` | `text` | telefone/WhatsApp |
| `empresa` | `text` | |
| `cargo` | `text` | |
| `funcionarios` | `text` | nº de funcionários |
| `site` | `text` | |
| `investimento` | `text` | investimento mensal em marketing |
| `mensagem` | `text` | descrição da necessidade |
| `consent` | `boolean` | consentimento de comunicações (LGPD) |
| `source` | `text` | default `landing-trafego-pago` |
| `user_agent` | `text` | preenchido pela Edge Function |

### Segurança (RLS)

Row Level Security está **habilitado e sem nenhuma policy pública** → `anon` e
`authenticated` ficam em **deny-all**. Apenas a Edge Function, usando a
`SUPABASE_SERVICE_ROLE_KEY`, consegue inserir (a service role ignora RLS). A
leitura dos leads acontece pelo **painel do Supabase** (Table Editor) ou por um
backend com a service role.

## 4. Configuração (passo a passo)

1. **Crie/escolha um projeto** no [Supabase](https://supabase.com/).
2. **Crie a tabela**: rode o conteúdo de
   `supabase/migrations/0001_create_marketing_leads_table.sql` no **SQL Editor**
   (ou `supabase db push` via CLI).
3. **Deploy da Edge Function**:
   ```bash
   supabase functions deploy submit-lead
   ```
4. **Defina os segredos da função** (NÃO vão no `.env` do frontend):
   ```bash
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...   # Settings → API
   # Opcionais — notificação por e-mail de cada lead (Resend):
   supabase secrets set RESEND_API_KEY=...
   supabase secrets set LEAD_NOTIFY_EMAIL=voce@empresa.com
   supabase secrets set LEAD_FROM_EMAIL=onboarding@resend.dev
   ```
   > `SUPABASE_URL` já é injetada automaticamente no runtime da função.
5. **Configure o frontend** (`.env.local`):
   ```bash
   cp .env.example .env.local
   # VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (Settings → API)
   ```
6. **Rode e teste**:
   ```bash
   npm install && npm run dev
   ```
   Preencha o formulário e confira a linha nova em *Table Editor → marketing_leads*.

## 5. CTAs de WhatsApp

Todos os botões de chamada para ação abrem uma conversa no WhatsApp da Sekoia.
O número e o gerador de link ficam centralizados em **`src/lib/contact.ts`**:

- `WHATSAPP_NUMBER` — `5547992156393` (55 Brasil + 47 DDD + 992156393).
- `openWhatsApp(mensagem?)` — abre `https://wa.me/<número>?text=<mensagem>`.

CTAs ligados: botão verde "SOLICITE SEU ORÇAMENTO" (form e landing),
"Nos chame no WhatsApp", "Fale com um especialista" e "Fale com a Sekoia!".
Para trocar o número, edite apenas `src/lib/contact.ts`.

## 6. Deploy do frontend

Ao publicar (Vercel, Netlify, etc.), defina `VITE_SUPABASE_URL` e
`VITE_SUPABASE_ANON_KEY` nas variáveis de ambiente da plataforma. Por serem
`VITE_*`, são embutidas no bundle no momento do build.

## 7. Próximos passos sugeridos

- Notificação por Slack além do e-mail.
- Validação mais rica de e-mail/telefone no frontend.
- Painel interno de leads autenticado (lendo via service role).
- Rastreamento de origem (UTM) preenchendo `source` com a campanha.
