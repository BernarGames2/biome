"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Comparador antes/depois com divisória arrastável.
 * Pointer (mouse/touch), teclado (input range nativo → setas, Home/End) e ARIA.
 * Convite inicial: a divisória "balança" uma vez ao entrar na tela.
 */
export function BeforeAfter({ before, after, label, beforeLabel = "Antes", afterLabel = "Depois", className = "" }: {
  before: ReactNode; after: ReactNode; label: string; beforeLabel?: string; afterLabel?: string; className?: string;
}) {
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const run = (t: number) => {
        const p = Math.min(1, (t - t0) / 1600);
        // oscilação amortecida 50 → 38 → 60 → 50
        setPos(50 + Math.sin(p * Math.PI * 2.2) * 12 * (1 - p));
        if (p < 1 && !dragging.current) raf = requestAnimationFrame(run);
      };
      raf = requestAnimationFrame(run);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  function fromEvent(clientX: number) {
    const r = wrap.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }

  return (
    <div
      ref={wrap}
      className={`relative select-none overflow-hidden touch-pan-y ${className}`}
      data-cursor="arraste"
      onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); fromEvent(e.clientX); }}
      onPointerMove={(e) => dragging.current && fromEvent(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{before}</div>
      <span className="micro pointer-events-none absolute left-4 top-4 rounded-full bg-carvao/75 px-3 py-1.5 text-offwhite">{beforeLabel}</span>
      <span className="micro pointer-events-none absolute right-4 top-4 rounded-full bg-offwhite/90 px-3 py-1.5 text-carvao">{afterLabel}</span>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-offwhite" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-girassol text-carvao shadow-[var(--shadow-soft)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M9 6 3 12l6 6M15 6l6 6-6 6" /></svg>
        </span>
      </div>
      <input
        type="range" min={0} max={100} step={1} value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={`${Math.round(pos)}% ${beforeLabel.toLowerCase()}`}
        className="ba-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0 focus-visible:opacity-0"
        onFocus={(e) => e.currentTarget.parentElement?.classList.add("ring-2", "ring-girassol")}
        onBlur={(e) => e.currentTarget.parentElement?.classList.remove("ring-2", "ring-girassol")}
      />
    </div>
  );
}
