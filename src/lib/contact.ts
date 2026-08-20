import { trackContact } from "./pixel";
import { siteConfig } from "./siteConfig";

export const WHATSAPP_NUMBER = siteConfig.whatsapp.primaryNumber;

export const WHATSAPP_DEFAULT_MESSAGE = siteConfig.whatsapp.defaultMessage;

export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function openWhatsApp(message?: string): void {
  trackContact();
  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
}

export const WHATSAPP_NUMBER_FOOTER = siteConfig.whatsapp.footerNumber;

export function openWhatsAppNumber(number: string, message?: string): void {
  trackContact();
  const base = `https://wa.me/${number}`;
  const url = message ? `${base}?text=${encodeURIComponent(message)}` : base;
  window.open(url, "_blank", "noopener,noreferrer");
}
