// Rastreamento de conversões: dispara os eventos no Meta Pixel (fbq) e no
// Google Analytics 4 (gtag) de uma vez. Ambos os scripts são carregados no
// index.html; aqui só os usamos, de forma segura (não quebra se um adblock
// bloquear qualquer um deles).

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Evento padrão do Meta Pixel (ex.: "Lead", "Contact"). */
export function trackPixel(event: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}

/** Evento do Google Analytics 4 (ex.: "generate_lead", "contact"). */
export function trackGA(event: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

/** Lead (formulário enviado com sucesso) — Meta + GA4. */
export function trackLead(): void {
  trackPixel("Lead");
  trackGA("generate_lead");
}

/** Contato (clique em CTA de WhatsApp) — Meta + GA4. */
export function trackContact(): void {
  trackPixel("Contact");
  trackGA("contact", { method: "whatsapp" });
}
