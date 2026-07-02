# Captação de Leads — Site Sekoia

A captação usa um **formulário próprio (identidade da empresa)** que envia os
leads para o **Namtab** através de uma **Serverless Function na Vercel**. Os CTAs
abrem o **WhatsApp**.

> Hospedagem: o site roda na **Vercel** (domínio da Hostinger apontado via DNS).
> A Vercel **não executa PHP** — por isso o proxy é uma function Node em `/api/`,
> não um `submit.php`.

## 1. Arquitetura

```
Form da marca (React)  --POST /api/submit-->  Serverless (Vercel)  --POST-->  Namtab (Supabase)
   src/app/ContactForm.tsx          api/submit.js            submit-form-data (agencia 149)
```

Por que a function: o endpoint do Namtab só libera CORS para `web.namtab.io`,
então o navegador **não** pode postar direto do nosso domínio. A function faz a
chamada **servidor-a-servidor** (CORS não se aplica), repassando o lead.

## 2. Arquivos

| Arquivo | Papel |
|---|---|
| `src/app/ContactForm.tsx` | Formulário da marca (8 campos), validação, envio, feedback. |
| `api/submit.js` | Serverless Function (Vercel): valida, anti-spam e repassa ao Namtab. |
| `src/lib/contact.ts` | Número de WhatsApp + `openWhatsApp()` (CTAs). |

Auto-teste: abrir `https://SEU-DOMINIO/api/submit` (GET) deve retornar
`{"ok":true,"message":"api/submit ativo","runtime":"vercel"}`.

## 3. Mapeamento dos campos (form → Namtab)

Descoberto via `get-form-data?slug=sekoia-marketing-149`. `agencia_id = 149`.

| Campo (form) | id Namtab | Obrigatório |
|---|---|---|
| Nome | 1326 | ✅ |
| Cargo | 1327 | |
| Email | 1328 | ✅ |
| Telefone | 1329 | |
| Empresa | 1330 | |
| Tipo/segmento | 1331 | |
| Como podemos te ajudar? | 1332 | |
| Investimento | 1333 | |

Payload enviado ao Namtab:
`POST submit-form-data { agencia_id: 149, campos: [{ id, nome, valor, campo_extra:false }] }`

## 4. Deploy (Vercel)

- O deploy é automático: push na branch `main` do GitHub → a Vercel builda
  (`npm run build`, saída `dist/`) e publica as functions de `api/` sozinha
  (zero-config). Não precisa subir zip.
- **Sem variáveis de ambiente** no frontend. Endpoint e `agencia_id` estão em
  `api/submit.js`.
- `npm run dev` (Vite) **não** roda a function `/api/submit` — o envio real só
  funciona no site publicado (Vercel). Para testar local com functions, usar
  `vercel dev`.

## 5. Manutenção / riscos

- Os endpoints do Namtab são **internos/não-documentados** (engenharia reversa do
  app público). Se o Namtab mudar o contrato, `api/submit.js` pode precisar de
  ajuste. Para trocar de formulário: rode `get-form-data?slug=<novo-slug>` e
  atualize `AGENCIA_ID` e o mapa de ids.
- Plano B à prova de quebra: voltar ao iframe oficial do Namtab.

## 6. CTAs de WhatsApp

Em `src/lib/contact.ts`:
- `WHATSAPP_NUMBER` — `5547992156393` (CTAs principais e botão flutuante).
- `WHATSAPP_NUMBER_FOOTER` — `5547991603130` (links do rodapé).
