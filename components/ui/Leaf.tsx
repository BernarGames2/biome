import type { SVGProps } from "react";

/** Folha preenchida com nervuras (primeiro plano do hero, decorações). */
export function Leaf({ fill = "#22372b", vein = "#6f8f5e", ...p }: SVGProps<SVGSVGElement> & { fill?: string; vein?: string }) {
  return (
    <svg viewBox="0 0 120 260" aria-hidden focusable="false" {...p}>
      <path d="M60 255 C 8 200, -6 90, 58 4 C 128 92, 118 200, 60 255Z" fill={fill} />
      <path d="M60 258 Q 66 140 58 6" stroke={vein} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".7" />
      {[40, 70, 100, 130, 160, 190, 215].map((y, i) => (
        <g key={y} stroke={vein} strokeWidth="1" fill="none" opacity=".45" strokeLinecap="round">
          <path d={`M${61 + i * 0.4} ${y + 16} Q ${40 - i} ${y + 4} ${22 + i * 1.2} ${y - 12}`} />
          <path d={`M${61 + i * 0.4} ${y + 16} Q ${82 + i} ${y + 4} ${98 - i * 1.2} ${y - 12}`} />
        </g>
      ))}
    </svg>
  );
}
