// Helper para disparar eventos do Meta Pixel de forma segura.
// O `fbq` é carregado no index.html (Meta Pixel Code). Aqui só o usamos.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Dispara um evento padrão do Meta Pixel (ex.: "Lead", "Contact").
 * Não faz nada se o pixel ainda não carregou (ex.: bloqueado por adblock).
 */
export function trackPixel(event: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}
