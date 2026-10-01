import type { SVGProps } from "react";

/**
 * Símbolo provisório "B-folha": caule + dois lóbulos de folha formando um B.
 * Substituir pelo arquivo oficial do cliente (SVG) quando disponível.
 */
export function BLeaf({ size = 28, className, draw = false, ...p }: SVGProps<SVGSVGElement> & { size?: number; draw?: boolean }) {
  const pl = draw ? { pathLength: 1 } : {};
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 40 50" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className} {...p}>
      <path {...pl} d="M12 47V5" />
      <path {...pl} d="M12 6c13-1.5 19 5 17 11.5C27.6 22 21 24 12 24" />
      <path {...pl} d="M12 24c15-1 22.5 6.5 20.5 14C30.6 45 22 47.5 12 46.5" />
      <path {...pl} d="M12 15.5c5-.5 9-1.8 12.5-4.8" />
      <path {...pl} d="M12 36c6-.6 11.5-2.6 16-6.6" />
      <path {...pl} d="M12 47c-3-1-5.5-3.5-6.5-6.5" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.55em] font-display font-medium tracking-[0.16em] ${className}`} style={{ fontVariationSettings: '"SOFT" 30, "opsz" 24' }}>
      BIOMA<span aria-hidden className="inline-block h-[1em] w-px bg-current opacity-60" />EVIDENCE
    </span>
  );
}
