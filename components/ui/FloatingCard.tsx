import type { ReactNode } from "react";

export function FloatingCard({ children, className = "", tone = "offwhite" }: { children: ReactNode; className?: string; tone?: "offwhite" | "areia" | "musgo" | "girassol" }) {
  const tones = {
    offwhite: "bg-offwhite text-carvao",
    areia: "bg-areia text-carvao",
    musgo: "bg-musgo text-offwhite",
    girassol: "bg-girassol text-carvao",
  } as const;
  return <div className={`rounded-[var(--radius)] p-5 shadow-[var(--shadow-soft)] md:p-6 ${tones[tone]} ${className}`} data-float>{children}</div>;
}
