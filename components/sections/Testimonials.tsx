"use client";

import { useRef } from "react";
import type { testimonials as T } from "@/data/site";

/** Carrossel arrastável com inércia (somente depoimentos reais autorizados). */
export function Testimonials({ items }: { items: typeof T }) {
  const ref = useRef<HTMLUListElement>(null);
  const st = useRef({ down: false, x: 0, sl: 0, v: 0, last: 0, raf: 0 });

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // touch usa rolagem nativa
    const s = st.current;
    cancelAnimationFrame(s.raf);
    s.down = true; s.x = e.clientX; s.sl = ref.current!.scrollLeft; s.v = 0; s.last = e.clientX;
  };
  const onMove = (e: React.PointerEvent) => {
    const s = st.current;
    if (!s.down) return;
    ref.current!.scrollLeft = s.sl - (e.clientX - s.x);
    s.v = e.clientX - s.last; s.last = e.clientX;
  };
  const onUp = () => {
    const s = st.current;
    if (!s.down) return;
    s.down = false;
    const glide = () => {
      s.v *= 0.94;
      ref.current!.scrollLeft -= s.v;
      if (Math.abs(s.v) > 0.4) s.raf = requestAnimationFrame(glide);
    };
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) s.raf = requestAnimationFrame(glide);
  };

  return (
    <ul
      ref={ref}
      className="no-scrollbar -mx-[var(--gutter)] flex snap-x gap-5 overflow-x-auto px-[var(--gutter)] pb-4"
      data-cursor="arraste"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      aria-label="Depoimentos de clientes"
      tabIndex={0}
    >
      {items.map((t, i) => (
        <li key={i} className="card-lift w-[min(86vw,26rem)] shrink-0 snap-start rounded-[var(--radius)] bg-areia p-8">
          <blockquote>
            <p className="font-display text-xl italic leading-snug" style={{ fontVariationSettings: '"SOFT" 100' }}>“{t.quote}”</p>
            <footer className="micro mt-6 text-muted">{t.author}{t.context ? ` · ${t.context}` : ""}</footer>
          </blockquote>
        </li>
      ))}
    </ul>
  );
}
