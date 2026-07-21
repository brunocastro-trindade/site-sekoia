// Rastreamento de conversões: dispara os eventos no Meta Pixel (fbq) e no
// Google Analytics 4 (gtag) de uma vez. Ambos os scripts são carregados no
// index.html; aqui só os usamos, de forma segura (não quebra se um adblock
// bloquear qualquer um deles).
//
// Desduplicação Meta (navegador + servidor): cada evento gera um event_id
// único, passado ao fbq (4º argumento) E enviado a /api/meta-capi, que reenvia
// o evento à Conversions API com o MESMO id — o Meta casa o par e conta uma
// única vez. Como /api/meta-capi é first-party, o canal servidor também
// recupera eventos de visitantes com adblock (que bloqueia facebook.com/tr).

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Dados opcionais do usuário para advanced matching na CAPI (hasheados no servidor). */
export interface CapiUserData {
  email?: string;
  phone?: string;
}

/** value/currency do evento — o Meta usa para calcular ROAS. */
export interface CapiCustomData {
  value: number;
  currency: string;
}

/** Moeda dos eventos com valor (código de 3 letras exigido pelo Meta). */
export const TRACKING_CURRENCY = "BRL";

// ============================================================================
// Google Ads (conversões de site)
//
// A ação de conversão "de site" no Google Ads só registra se a tag AW- estiver
// instalada E o evento de conversão disparar com o send_to correto. Enquanto os
// valores abaixo estiverem vazios, todo o bloco é inerte (nada muda no site).
//
// Onde pegar os valores (Google Ads → Metas → Conversões → ação de conversão →
// "Configurar a tag" → "Instalar a tag você mesmo"): o snippet mostra algo como
//   gtag('event', 'conversion', { send_to: 'AW-123456789/AbCdEfGhIj' });
// → GOOGLE_ADS_ID = "AW-123456789" e o label é a parte depois da barra.
//
// Alternativa recomendada (sem tocar em código): importar os eventos
// generate_lead/contact do GA4 como conversões — ver docs/CONVERSOES-GOOGLE-ADS.md.
// ============================================================================

/** ID da tag do Google Ads (formato "AW-XXXXXXXXX"). Vazio = desativado. */
export const GOOGLE_ADS_ID = "";

/** Labels de cada ação de conversão (parte após a barra no send_to). */
export const GOOGLE_ADS_LABELS = {
  /** Formulário enviado com sucesso (ex.: ação "Solicitar cotação"). */
  lead: "",
  /** Clique em CTA de WhatsApp. */
  contact: "",
};

/**
 * Registra a tag do Google Ads no gtag. Chamar uma vez no boot do app
 * (src/main.tsx) — precisa rodar no carregamento da página para a tag capturar
 * o gclid dos cliques em anúncios.
 */
export function initGoogleAdsTag(): void {
  if (!GOOGLE_ADS_ID) return;
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GOOGLE_ADS_ID);
  }
}

/** Telefone em E.164 (+55...) para enhanced conversions; null se irrecuperável. */
function toE164(phone?: string): string | null {
  let d = String(phone || "").replace(/\D/g, "");
  if (!d) return null;
  if ((d.length === 10 || d.length === 11) && !d.startsWith("55")) d = "55" + d;
  return d.length >= 10 ? `+${d}` : null;
}

/**
 * Conversão do Google Ads (gtag "conversion" com send_to). Com email/telefone
 * disponíveis, envia também user_data para enhanced conversions (o Google
 * hasheia no próprio gtag antes de transmitir).
 */
function trackAdsConversion(
  label: string,
  valueParams: CapiCustomData,
  userData?: CapiUserData,
): void {
  if (!GOOGLE_ADS_ID || !label) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (userData?.email || userData?.phone) {
    window.gtag("set", "user_data", {
      email: userData.email || undefined,
      phone_number: toE164(userData.phone) || undefined,
    });
  }
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    value: valueParams.value,
    currency: valueParams.currency,
  });
}

/**
 * Valor estimado (em BRL) de cada conversão, para o ROAS do Events Manager.
 * AJUSTAR conforme o negócio: quanto vale, em média, um lead qualificado e um
 * contato de WhatsApp para a Sekoia. Zero é válido para o Meta, mas ROAS fica 0.
 */
export const LEAD_VALUE = 0;
export const CONTACT_VALUE = 0;

/** Gera um event_id único para casar o evento do navegador com o do servidor. */
function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Evento padrão do Meta Pixel (ex.: "Lead", "Contact"), com id de desduplicação. */
export function trackPixel(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string,
): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (eventId) {
      window.fbq("track", event, params ?? {}, { eventID: eventId });
    } else {
      window.fbq("track", event, params);
    }
  }
}

/** Reenvia o evento à Conversions API (fire-and-forget; nunca quebra a página). */
export function sendCapi(
  eventName: string,
  eventId: string,
  userData?: CapiUserData,
  customData?: CapiCustomData,
): void {
  if (typeof window === "undefined" || typeof fetch !== "function") return;
  try {
    fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // keepalive: sobrevive à navegação (ex.: clique de WhatsApp abre outra aba)
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        user_data: userData,
        custom_data: customData,
      }),
    }).catch(() => {});
  } catch {
    /* nunca propaga erro de tracking */
  }
}

/** Evento do Google Analytics 4 (ex.: "generate_lead", "contact"). */
export function trackGA(event: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

/** Lead (formulário enviado com sucesso) — Meta (navegador + CAPI) + GA4 + Google Ads. */
export function trackLead(userData?: CapiUserData): void {
  const eventId = newEventId();
  const valueParams = { value: LEAD_VALUE, currency: TRACKING_CURRENCY };
  trackPixel("Lead", valueParams, eventId);
  sendCapi("Lead", eventId, userData, valueParams);
  trackGA("generate_lead", valueParams);
  trackAdsConversion(GOOGLE_ADS_LABELS.lead, valueParams, userData);
}

/** Contato (clique em CTA de WhatsApp) — Meta (navegador + CAPI) + GA4 + Google Ads. */
export function trackContact(): void {
  const eventId = newEventId();
  const valueParams = { value: CONTACT_VALUE, currency: TRACKING_CURRENCY };
  trackPixel("Contact", valueParams, eventId);
  sendCapi("Contact", eventId, undefined, valueParams);
  trackGA("contact", { method: "whatsapp", ...valueParams });
  trackAdsConversion(GOOGLE_ADS_LABELS.contact, valueParams);
}
