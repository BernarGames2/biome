/**
 * Caule em SVG que "cresce" (stroke-dashoffset via pathLength=1) e solta folhas.
 * Orientação vertical ou horizontal. O progresso é controlado por GSAP via [data-vine-path] e [data-vine-leaf].
 */
export function Vine({ orientation = "vertical", leaves = 6, className = "", color = "currentColor", leafColor = "currentColor", length = 1000 }: { length?: number; orientation?: "vertical" | "horizontal"; leaves?: number; className?: string; color?: string; leafColor?: string }) {
  const H = orientation === "vertical";
  const W = H ? 40 : length, L = H ? length : 60;
    // caule ondulado
  const d = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    const main = t * length;
    const wob = Math.sin(t * Math.PI * (leaves + 1)) * 7;
    return H ? `${i ? "L" : "M"}${(20 + wob).toFixed(1)} ${main.toFixed(1)}` : `${i ? "L" : "M"}${main.toFixed(1)} ${(30 + wob).toFixed(1)}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${L}`} preserveAspectRatio="none" className={className} aria-hidden fill="none">
      <path d={d} pathLength={1} stroke={color} strokeWidth={H ? 1.2 : 1.4} vectorEffect="non-scaling-stroke" data-vine-path style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
      {Array.from({ length: leaves }, (_, i) => {
        const p = ((i + 0.5) / leaves) * length;
        const side = i % 2 ? 1 : -1;
        const x = H ? 20 : p, y = H ? p : 30;
        const rot = H ? (side > 0 ? -35 : 215) : side > 0 ? -55 : 55;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <path data-vine-leaf d="M0 0 Q 9 -7 22 0 Q 9 7 0 0Z" fill={leafColor} vectorEffect="non-scaling-stroke" style={{ transformOrigin: "0 0", transformBox: "fill-box" }} />
          </g>
        );
      })}
    </svg>
  );
}
