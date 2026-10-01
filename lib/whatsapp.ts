import { site, whatsappMessages, type WhatsappKey } from "@/data/site";

export function waLink(key: WhatsappKey = "geral") {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(whatsappMessages[key])}`;
}
