# Captação de Leads — Site Sekoia

Documentação do fluxo de captação de leads do formulário de contato e da sua
persistência no **Supabase**.

## 1. Visão geral

O formulário de contato (`src/app/ContactForm.tsx`) coleta os dados de um
potencial cliente e os grava na tabela `leads` de um projeto Supabase. O fluxo é:

```
Formulário (React)  →  submitLead()  →  Supabase client  →  tabela public.leads
   ContactForm.tsx       src/lib/leads.ts    src/lib/supabase.ts        (Postgres + RLS)
```

### Antes vs. depois

- **Antes:** o formulário era puramente visual — os campos não tinham estado,
  não havia botão de envio e nada era persistido. Todo lead se perdia.
- **Depois:** formulário controlado, com validação, botão "Enviar", estados de
  carregamento/sucesso/erro e gravação no banco via Supabase.

## 2. Arquivos criados / modificados

| Arquivo | Papel |
|---|---|
| `src/lib/supabase.ts` | Cria o cliente Supabase (singleton) a partir das env vars. |
| `src/lib/leads.ts` | Tipo `LeadInput` + função `submitLead()` que insere o lead. |
| `src/app/ContactForm.tsx` | Formulário controlado, validação, envio e feedback. |
| `supabase/migrations/0001_create_leads_table.sql` | Schema da tabela `leads` + RLS. |
| `.env.example` | Modelo das variáveis de ambiente do Supabase. |
| `package.json` | Adiciona a dependência `@supabase/supabase-js`. |

## 3. Esquema do banco (`public.leads`)

| Coluna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `created_at` | `timestamptz` | `now()` |
| `nome` | `text` | obrigatório |
| `sobrenome` | `text` | |
| `email` | `text` | obrigatório, salvo em minúsculas |
| `telefone` | `text` | telefone/WhatsApp |
| `empresa` | `text` | |
| `cargo` | `text` | |
| `num_funcionarios` | `text` | |
| `site` | `text` | |
| `investimento_marketing` | `text` | investimento mensal em marketing |
| `mensagem` | `text` | descrição da necessidade |
| `aceite_comunicacao` | `boolean` | consentimento (LGPD) |
| `origem` | `text` | default `site-sekoia` |

### Segurança (RLS)

Row Level Security está **habilitado**. Existe **apenas** uma policy de `INSERT`
para a role `anon` (o site público). Não há policies de `SELECT/UPDATE/DELETE`
para `anon`, então a chave pública **não consegue ler nem alterar** os leads —
ela só pode inserir. A leitura dos leads acontece:

- pelo **painel do Supabase** (Table Editor), ou
- por um backend usando a **service_role** (que ignora RLS).

> A chave `anon` é pública por design e segura de expor no frontend — quem
> protege os dados é o RLS, não o segredo da chave.

## 4. Como configurar (passo a passo)

1. **Crie um projeto** no [Supabase](https://supabase.com/) (ou use um existente).
2. **Crie a tabela** rodando o conteúdo de
   `supabase/migrations/0001_create_leads_table.sql` no **SQL Editor** do painel
   (ou via `supabase db push` se usar a CLI).
3. **Pegue as credenciais** em *Settings → API*: a `Project URL` e a `anon public key`.
4. **Configure o ambiente** local:
   ```bash
   cp .env.example .env.local
   # edite .env.local com a URL e a anon key
   ```
5. **Instale e rode:**
   ```bash
   npm install
   npm run dev
   ```
6. **Teste** preenchendo o formulário no site e confira a linha nova no
   *Table Editor → leads* do Supabase.

## 5. Deploy

Ao publicar (Vercel, Netlify, etc.), defina as mesmas variáveis
`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nas configurações de ambiente da
plataforma. Por serem `VITE_*`, elas são embutidas no bundle no momento do build.

## 6. Próximos passos sugeridos

- Notificação por e-mail/Slack a cada novo lead (Supabase Edge Function + trigger).
- Proteção anti-spam (honeypot ou Cloudflare Turnstile) antes do `insert`.
- Validação mais rica de e-mail/telefone no frontend.
- Painel interno de leads autenticado (lendo via service_role num backend).
