// ============================================================================
// Configuração central de contato da Sekoia.
// Um único lugar para o número de WhatsApp e o gerador de links wa.me,
// usado por todos os CTAs da landing.
// ============================================================================

/**
 * Número de WhatsApp em formato E.164 (sem "+", só dígitos), como o wa.me espera.
 * 55 (Brasil) + 47 (DDD) + 992156393.
 */
export const WHATSAPP_NUMBER = "5547992156393";

/** Mensagem pré-preenchida padrão ao abrir a conversa pelo botão de CTA. */
export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Vim pelo site da Sekoia e gostaria de solicitar um orçamento de tráfego pago.";

/**
 * Monta o link wa.me, opcionalmente com uma mensagem pré-preenchida.
 * Ex.: whatsappLink("Quero falar com um especialista")
 */
export function whatsappLink(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Abre o WhatsApp numa nova aba (handler reutilizável para onClick). */
export function openWhatsApp(message?: string): void {
  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
}
