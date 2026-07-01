# Captação de Leads — Site Sekoia

A captação de leads é feita pelo **Namtab** (ferramenta de formulários/CRM),
embutido na landing via **iframe**. Quem preenche vira lead direto no sistema do
Namtab, que dispara o **webhook** configurado lá. Além disso, os CTAs abrem o
**WhatsApp**.

> Histórico: antes essa captação passava por Supabase (Edge Function + Postgres).
> Migramos para o Namtab para simplificar (sem backend próprio) — todo o código
> de Supabase foi removido.

## 1. Formulário (Namtab via iframe)

- **Onde:** `src/app/ContactForm.tsx` renderiza um iframe dentro de um card da
  marca (verde-escuro), na seção de contato da landing.
- **URL do formulário:** `https://web.namtab.io/form/sekoia-marketing-149`
  (constante `NAMTAB_FORM_URL` no componente).
- **Fluxo:** pessoa preenche no iframe → vira lead no Namtab → webhook do Namtab
  dispara. Nada trafega pelo código do site além de exibir o formulário.

```
Pessoa preenche  →  iframe Namtab  →  lead no Namtab  →  webhook
                    (ContactForm.tsx)     (sistema Namtab)
```

### Trocar o formulário

Para apontar para outro formulário do Namtab, edite `NAMTAB_FORM_URL` em
`src/app/ContactForm.tsx`. O gerenciamento dos campos, validação, notificações e
webhook fica todo no painel do Namtab.

### Observações

- O iframe do Namtab tem o **visual padrão da ferramenta** (dentro de um card
  verde da marca). Ajustes de estilo do formulário são feitos no Namtab.
- **Altura:** fixada em `560px`. Se o formulário do Namtab ficar maior, ele rola
  internamente; dá para ajustar a altura no componente.
- **LGPD/cookies:** por ser um iframe de terceiro (namtab.io), convém mencionar
  na Política de Privacidade.

## 2. CTAs de WhatsApp

Os botões de chamada para ação abrem o WhatsApp. Número e gerador de link ficam
em **`src/lib/contact.ts`**:

- `WHATSAPP_NUMBER` — `5547992156393` (CTAs principais e botão flutuante).
- `WHATSAPP_NUMBER_FOOTER` — `5547991603130` (links Cursos/Mentoria/Palestras/
  Contato do rodapé).
- `openWhatsApp(mensagem?)` / `openWhatsAppNumber(numero, mensagem?)`.

CTAs ligados: botão verde "SOLICITE SEU ORÇAMENTO", header "Quero uma equipe
profissional", botão flutuante (`WhatsAppFab`), e os links do rodapé.

## 3. Deploy

O site é estático (Vite/React) — o `npm run build` gera o `dist/`, que sobe para
a Hostinger (ver `docs/DEPLOY-HOSTINGER.md`). Como o formulário é um iframe
externo, **não há variáveis de ambiente nem backend** para configurar.
