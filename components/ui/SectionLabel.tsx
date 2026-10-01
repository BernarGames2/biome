import { BLeaf } from "./Logo";

/** Rótulo de seção: B-folha + numeração + nome em microtipografia. */
export function SectionLabel({ index, children, className = "", tone = "dark" }: { index?: string; children: string; className?: string; tone?: "dark" | "light" }) {
  return (
    <p className={`micro flex items-center gap-3 ${tone === "light" ? "text-offwhite/80" : "text-muted"} ${className}`} data-reveal>
      <BLeaf size={14} className={tone === "light" ? "text-girassol" : "text-musgo"} />
      {index && <span className="tabular-nums">{index}</span>}
      {index && <span aria-hidden className="h-px w-8 bg-current opacity-50" />}
      <span>{children}</span>
    </p>
  );
}
