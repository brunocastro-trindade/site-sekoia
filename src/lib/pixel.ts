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

/** Lead (formulário enviado com sucesso) — Meta (navegador + CAPI) + GA4. */
export function trackLead(userData?: CapiUserData): void {
  const eventId = newEventId();
  const valueParams = { value: LEAD_VALUE, currency: TRACKING_CURRENCY };
  trackPixel("Lead", valueParams, eventId);
  sendCapi("Lead", eventId, userData, valueParams);
  trackGA("generate_lead", valueParams);
}

/** Contato (clique em CTA de WhatsApp) — Meta (navegador + CAPI) + GA4. */
export function trackContact(): void {
  const eventId = newEventId();
  const valueParams = { value: CONTACT_VALUE, currency: TRACKING_CURRENCY };
  trackPixel("Contact", valueParams, eventId);
  sendCapi("Contact", eventId, undefined, valueParams);
  trackGA("contact", { method: "whatsapp", ...valueParams });
}
