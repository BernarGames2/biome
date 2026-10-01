"use client";

import { useEffect, useRef } from "react";
import { BLeaf } from "./Logo";

/**
 * Preloader ≤1,1s: o B-folha se desenha, contagem 00→100 e cortina que sobe.
 * Só na primeira visita da sessão e nunca em reduced-motion (decidido por script inline no <head>).
 * Não bloqueia o LCP: o hero já está renderizado por baixo.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("show-preloader")) return;
    const el = ref.current!;
    const t0 = performance.now();
    const D = 850;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / D);
      const e = 1 - Math.pow(1 - p, 3);
      if (num.current) num.current.textContent = String(Math.round(e * 100)).padStart(2, "0");
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        el.style.transition = "transform .6s cubic-bezier(.76,0,.24,1)";
        el.style.transform = "translateY(-100%)";
        setTimeout(() => {
          html.classList.remove("show-preloader");
          try { sessionStorage.setItem("bioma-preloaded", "1"); } catch {}
        }, 620);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="preloader fixed inset-0 z-[100] flex-col items-center justify-center gap-6 bg-musgo text-areia" aria-hidden>
      <BLeaf size={64} draw className="draw-in" style={{ ["--d" as string]: "0s" }} />
      <span className="micro tabular-nums text-areia/80"><span ref={num}>00</span></span>
      <span className="micro absolute bottom-8 text-areia/70">Bioma Evidence · Uberlândia</span>
    </div>
  );
}
