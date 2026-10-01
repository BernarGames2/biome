/**
 * Eventos de conversão sem dados pessoais.
 * Só envia se GA/Meta Pixel estiverem configurados via env E o usuário aceitar cookies.
 */
type EventName = "whatsapp_click" | "phone_click" | "directions_click" | "instagram_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const analyticsEnabled = Boolean(
  process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID,
);

export function track(name: EventName, section: string) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", name, { section });
    if (name === "whatsapp_click") window.fbq?.("track", "Contact", { section });
  } catch {
    /* noop */
  }
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", name, section);
}
