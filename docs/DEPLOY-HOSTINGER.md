# Deploy na Hostinger (migração da Vercel)

Este projeto é um **SPA estático** (Vite/React). O `npm run build` gera a pasta
`dist/`, que é o que sobe para a Hostinger. O **backend (Supabase)** não muda —
banco e Edge Function continuam no Supabase.

## Visão geral da migração

1. **Preparar** o build (`dist/`) com as variáveis do Supabase.
2. **Subir** o `dist/` para o `public_html` da Hostinger.
3. **Apontar o domínio** para a Hostinger (DNS).
4. **Desligar a Vercel** (remover domínio + projeto lá).
5. **Ajustar CORS** no Supabase para o novo domínio.

## 1. Variáveis de ambiente (antes de buildar)

As `VITE_*` são embutidas no build. Crie `.env.local` na raiz:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

> A `anon key` é pública (segura de expor). Se mudar, precisa **rebuildar**.

## 2. Gerar o build

```bash
npm install
npm run build
```

O `dist/` já inclui o `.htaccess` (SPA routing + HTTPS + cache) copiado de
`public/.htaccess`.

## 3. Subir para a Hostinger

**Opção A — Gerenciador de Arquivos (hPanel):**
1. hPanel → seu site → **Gerenciador de Arquivos** → `public_html`.
2. Apague o conteúdo antigo.
3. Suba um `.zip` com o **conteúdo de dentro** de `dist/` e **Extrair**.
4. Confirme que o `.htaccess` ficou em `public_html` (ative "mostrar ocultos").

**Opção B — FTP (FileZilla):** credenciais em hPanel → **FTP Accounts**; envie o
conteúdo de `dist/` para `public_html`.

## 4. Domínio e SSL

- Domínio na Hostinger: já serve o `public_html`.
- Domínio externo: aponte os **nameservers** para a Hostinger (ou registro A → IP
  do plano, em hPanel → **DNS Zone**).
- hPanel → **SSL** → ative o certificado grátis e force HTTPS.

## 5. Desligar a Vercel

1. Vercel → projeto → **Settings → Domains**: remova o domínio custom.
2. **Settings → General → Delete Project** (ou desconecte o repo do GitHub).
3. Se o DNS do domínio apontava para a Vercel (CNAME `cname.vercel-dns.com` ou
   A `76.76.21.21`), troque para a Hostinger (passo 4).

## 6. Supabase (CORS)

A Edge Function `submit-lead` é chamada pelo navegador a partir do novo domínio.
Garanta que ela responde com `Access-Control-Allow-Origin` liberando
`https://seudominio.com` (ou `*`). Sem isso, o formulário falha por CORS.

## Notas

- **Subdiretório** (ex.: `dominio.com/landing`): setar `base: '/landing/'` no
  `vite.config.ts` antes de buildar. Para domínio raiz, nada muda.
- **Propagação de DNS**: pode levar de minutos a algumas horas.
- **Deploy automático (Git)**: planos Business/Cloud da Hostinger permitem
  conectar o repo e buildar no servidor — configurar comando de build
  (`npm run build`), diretório de saída (`dist`) e as env vars no painel.
