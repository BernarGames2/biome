import type { ReactNode, CSSProperties } from "react";

/** Moldura orgânica para imagens. `shape` define a máscara; o conteúdo interno pode ter parallax ([data-inner]). */
export function OrganicMask({ children, shape = "arch", className = "", style, reveal = true }: { children: ReactNode; shape?: "arch" | "arch-inv" | "blob-a" | "blob-b" | "leaf" | "round"; className?: string; style?: CSSProperties; reveal?: boolean }) {
  const shapes = { arch: "mask-arch", "arch-inv": "mask-arch-inv", "blob-a": "mask-blob-a", "blob-b": "mask-blob-b", leaf: "mask-leaf", round: "rounded-[var(--radius-lg)]" };
  return (
    <div className={`relative overflow-hidden ${shapes[shape]} ${className}`} style={{ ...style, transform: "translateZ(0)" }} {...(reveal ? { "data-clip-reveal": "" } : {})}>
      <div className="absolute inset-[-8%_0]" data-inner>{children}</div>
    </div>
  );
}
