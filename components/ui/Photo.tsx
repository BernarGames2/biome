import Image from "next/image";
import type { ImageSlot } from "@/data/site";
import { BotanicalArt } from "./BotanicalArt";

const BLUR =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Crect width='4' height='5' fill='%23cfc6b0'/%3E%3Ccircle cx='3' cy='1' r='2' fill='%236f8f5e' opacity='.35'/%3E%3C/svg%3E";

/**
 * Slot de imagem: usa a foto real quando `available`, senão arte botânica.
 * Em desenvolvimento mostra uma etiqueta técnica com o caminho esperado (nunca em produção).
 */
export function Photo({ slot, sizes = "100vw", priority = false, art = "leaf", tone = "musgo", className = "" }: {
  slot: ImageSlot; sizes?: string; priority?: boolean; art?: "leaf" | "fern" | "sunflower" | "seed" | "stem"; tone?: "musgo" | "areia" | "offwhite" | "carvao"; className?: string;
}) {
  if (slot.available) {
    return (
      <Image src={slot.src} alt={slot.alt} fill sizes={sizes} priority={priority} placeholder="blur" blurDataURL={BLUR} className={`object-cover ${className}`} />
    );
  }
  return (
    <div className={`absolute inset-0 ${className}`}>
      <BotanicalArt variant={art} tone={tone} />
      {process.env.NODE_ENV === "development" && (
        <span className="absolute bottom-2 left-2 rounded bg-carvao/80 px-2 py-1 font-mono text-[10px] text-offwhite">slot: {slot.src}</span>
      )}
    </div>
  );
}
