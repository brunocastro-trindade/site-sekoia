declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export interface CapiUserData {
  email?: string;
  phone?: string;
}

export interface CapiCustomData {
  value: number;
  currency: string;
}

export const TRACKING_CURRENCY = "BRL";

export const GOOGLE_ADS_ID = "";

export const GOOGLE_ADS_LABELS = {
  lead: "",
  contact: "",
};

export function initGoogleAdsTag(): void {
  if (!GOOGLE_ADS_ID) return;
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GOOGLE_ADS_ID);
  }
}

function toE164(phone?: string): string | null {
  let d = String(phone || "").replace(/\D/g, "");
  if (!d) return null;
  if ((d.length === 10 || d.length === 11) && !d.startsWith("55")) d = "55" + d;
  return d.length >= 10 ? `+${d}` : null;
}

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

export const LEAD_VALUE = 0;
export const CONTACT_VALUE = 0;

function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

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
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        user_data: userData,
        custom_data: customData,
      }),
    }).catch(() => {});
  } catch {}
}

export function trackGA(event: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

export function trackLead(userData?: CapiUserData): void {
  const eventId = newEventId();
  const valueParams = { value: LEAD_VALUE, currency: TRACKING_CURRENCY };
  trackPixel("Lead", valueParams, eventId);
  sendCapi("Lead", eventId, userData, valueParams);
  trackGA("generate_lead", valueParams);
  trackAdsConversion(GOOGLE_ADS_LABELS.lead, valueParams, userData);
}

export function trackContact(): void {
  const eventId = newEventId();
  const valueParams = { value: CONTACT_VALUE, currency: TRACKING_CURRENCY };
  trackPixel("Contact", valueParams, eventId);
  sendCapi("Contact", eventId, undefined, valueParams);
  trackGA("contact", { method: "whatsapp", ...valueParams });
  trackAdsConversion(GOOGLE_ADS_LABELS.contact, valueParams);
}
