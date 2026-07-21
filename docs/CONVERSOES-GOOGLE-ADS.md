# Conversões Google Ads — Site Sekoia

Runbook para resolver o aviso do Google Ads:

> "1 ação de conversão inativa ou não verificada de Site para a meta Solicitar
> cotações — Solicitar cotação, Não verificado, valor US$ 1,00"

## Diagnóstico (jul/2026)

Auditoria feita no site publicado (sekoiamarketing.com.br):

| Item | Status |
|---|---|
| Tag base GA4 `G-WL23JBFN9W` (index.html) | ✅ carrega e coleta (`analytics.google.com/g/collect` confirmado) |
| Evento GA4 `generate_lead` (form enviado com sucesso) | ✅ programado em `src/lib/pixel.ts` |
| Evento GA4 `contact` (clique em CTA de WhatsApp) | ✅ programado em `src/lib/pixel.ts` |
| Tag do Google Ads (`AW-…`) | ❌ **não existe no site** |
| Snippet de conversão (`gtag('event','conversion',{send_to})`) | ❌ **não existe no site** |

**Causa do aviso:** a ação "Solicitar cotação" foi criada no Google Ads com
origem **Site**, ou seja, ela espera receber hits da tag `AW-` — que nunca foi
instalada. Sem um único hit, o Google Ads mantém a ação como "inativa / não
verificada" para sempre. O GA4 em si está instalado corretamente; ele não é o
problema.

O "US$ 1,00" é o valor padrão de criação manual (e está em dólar — ajustar para
BRL ao refazer a ação).

## Solução A — Importar do GA4 (recomendada, sem código)

O site já dispara os eventos certos no GA4. Basta o Google Ads passar a
importá-los:

1. **GA4** (propriedade do `G-WL23JBFN9W`) → Administrador → *Exibição de dados*
   → **Eventos** → marcar `generate_lead` como **evento principal** (key event).
   Marcar também `contact` — a maioria das cotações entra pelo WhatsApp, não
   pelo formulário; só o form subnotifica.
2. **GA4** → Administrador → *Vinculações de produtos* → confirmar que a conta
   do **Google Ads está vinculada** (e com personalização de anúncios ativa).
3. **Google Ads** → Metas → Conversões → **Nova ação de conversão** → Importar →
   *Propriedades do Google Analytics 4* → Web → selecionar `generate_lead`
   (meta "Solicitar cotações") e `contact` (contato/WhatsApp).
4. **Excluir ou pausar** a ação antiga "Solicitar cotação" de origem Site — ela
   nunca vai verificar sem tag.
5. Definir moeda BRL e o valor por conversão, se quiser otimizar por valor.

Prazo: a ação importada sai de "não verificada" após o primeiro evento real
(um lead de teste do form ou um clique de WhatsApp já resolve).

## Solução B — Manter a conversão "de Site" (tag AW- própria)

O código já está preparado; falta só colar os IDs. No Google Ads, abrir a ação
de conversão → **Configurar a tag** → *Instalar a tag você mesmo*. O snippet
mostra:

```js
gtag('event', 'conversion', { send_to: 'AW-123456789/AbCdEfGhIj' });
```

Em [`src/lib/pixel.ts`](../src/lib/pixel.ts), preencher:

```ts
export const GOOGLE_ADS_ID = "AW-123456789";      // parte antes da barra
export const GOOGLE_ADS_LABELS = {
  lead: "AbCdEfGhIj",     // label da ação do formulário ("Solicitar cotação")
  contact: "XyZ...",      // label da ação de WhatsApp (criar no Google Ads)
};
```

Pronto — com isso o site passa a:

- registrar a tag `AW-` no carregamento (`initGoogleAdsTag()` em `src/main.tsx`),
  o que também captura o `gclid` dos cliques em anúncio;
- disparar `conversion` junto com `generate_lead` (form) e `contact` (WhatsApp);
- enviar **enhanced conversions** (email/telefone hasheados pelo próprio gtag)
  no lead do formulário — ativar "Conversões otimizadas" na ação do Google Ads
  para usar.

Enquanto `GOOGLE_ADS_ID` estiver vazio, nada disso roda (zero efeito no site).

## Pendência relacionada — Meta CAPI sem token na Vercel

`GET https://sekoiamarketing.com.br/api/meta-capi` retorna
`"tokenConfigured": false`, e todo `POST` responde **503**: a variável
`META_CAPI_ACCESS_TOKEN` **não está configurada na Vercel**. O canal
servidor-a-servidor do Meta (deduplicação + recuperação de adblock) está
inoperante — só o Pixel de navegador está contando.

Correção (sem código): Events Manager → Configurações do pixel `1217330763796782`
→ API de Conversões → *Configuração manual* → **Gerar token** → Vercel →
Settings → Environment Variables → `META_CAPI_ACCESS_TOKEN` → redeploy.
Validar com o código de "Testar eventos" em `META_CAPI_TEST_CODE` (remover
depois).
