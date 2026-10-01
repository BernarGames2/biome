"use client";

import { useRef } from "react";
import { useGsap, observeVisibility } from "@/lib/motion";
import { BLeaf } from "./Logo";

/** Marquee de palavras em contorno; velocidade e skew reagem à rolagem; pausa fora da tela. */
export function Marquee({ words, className = "" }: { words: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, ({ gsap, ScrollTrigger, reduced }, el) => {
    if (reduced) return;
    const track = el.querySelector<HTMLElement>(".marquee-track")!;
    const half = () => track.scrollWidth / 2;
    let x = 0, speed = 1, visible = true;
    const skewTo = gsap.quickTo(track, "skewX", { duration: 0.6, ease: "power3.out" });
    const st = ScrollTrigger.create({
      trigger: el, start: "top bottom", end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        speed = 1 + Math.min(Math.abs(v) / 260, 7);
        if (v !== 0) speed *= Math.sign(v);
        skewTo(gsap.utils.clamp(-8, 8, v / -320));
      },
    });
    const tick = (_t: number, dt: number) => {
      if (!visible) return;
      x -= 0.06 * dt * speed;
      speed += (Math.sign(speed || 1) - speed) * 0.05;
      const w = half();
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      gsap.set(track, { x });
    };
    gsap.ticker.add(tick);
    const stop = observeVisibility(el, (v) => { visible = v; if (!v) skewTo(0); });
    return () => { gsap.ticker.remove(tick); st.kill(); stop(); };
  });

  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="font-display text-outline whitespace-nowrap px-[0.35em] text-[clamp(3.5rem,11vw,10rem)] font-[350] leading-none tracking-[-0.03em]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>{w}</span>
          <BLeaf size={34} className="shrink-0 text-girassol" />
        </span>
      ))}
    </div>
  );
  return (
    <div ref={ref} className={`overflow-hidden py-6 ${className}`} aria-label={words.join(", ")} role="text">
      <div className="marquee-track" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}
