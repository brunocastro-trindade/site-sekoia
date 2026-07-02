# Captação de Leads — Site Sekoia

A captação usa um **formulário próprio (identidade da empresa)** que envia os
leads para o **Namtab** através de um proxy PHP no servidor. Os CTAs abrem o
**WhatsApp**.

> Evolução: Supabase próprio → iframe do Namtab → **form da marca + proxy → Namtab**.
> Motivo da última mudança: manter o visual da empresa e ainda cair no Namtab.

## 1. Arquitetura

```
Form da marca (React)  --POST /submit.php-->  Proxy PHP  --POST-->  Namtab (Supabase)
   src/app/ContactForm.tsx        public/submit.php        submit-form-data (agencia 149)
```

Por que o proxy: o endpoint do Namtab só libera CORS para `web.namtab.io`, então
o navegador **não** pode postar direto do nosso domínio. O `submit.php` faz a
chamada **servidor-a-servidor** (CORS não se aplica), repassando o lead.

## 2. Arquivos

| Arquivo | Papel |
|---|---|
| `src/app/ContactForm.tsx` | Formulário da marca (8 campos), validação, envio, feedback. |
| `public/submit.php` | Proxy: valida, anti-spam (honeypot) e repassa ao Namtab. |
| `src/lib/contact.ts` | Número de WhatsApp + `openWhatsApp()` (CTAs). |

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

## 4. Requisitos de deploy (Hostinger)

- `submit.php` precisa de **PHP com cURL** (padrão na hospedagem compartilhada
  Hostinger). Ele vai para a **raiz** do site (é copiado do `public/` para o
  `dist/`), acessível em `https://seudominio/submit.php`.
- **Não há variáveis de ambiente** no frontend. Endpoint e `agencia_id` estão no
  `submit.php`.
- Em ambiente sem PHP (ex.: `npm run dev` do Vite) o envio real não funciona — só
  a UI/validação. Teste o envio no site publicado.

## 5. Manutenção / riscos

- Os endpoints do Namtab são **internos/não-documentados** (engenharia reversa do
  app público). Se o Namtab mudar o contrato, o `submit.php` pode precisar de
  ajuste. Para trocar de formulário, rode `get-form-data?slug=<novo-slug>` e
  atualize `AGENCIA_ID` e o mapa de ids no `submit.php`.
- Plano B à prova de quebra: voltar ao iframe oficial do Namtab.

## 6. CTAs de WhatsApp

Em `src/lib/contact.ts`:
- `WHATSAPP_NUMBER` — `5547992156393` (CTAs principais e botão flutuante).
- `WHATSAPP_NUMBER_FOOTER` — `5547991603130` (links do rodapé).
