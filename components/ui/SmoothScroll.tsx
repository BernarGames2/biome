"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as STType } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

export type MotionKit = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof STType;
  lenis: Lenis | null;
  reduced: boolean;
  /** pointer:fine + hover (desktop) */
  fine: boolean;
};

const MotionContext = createContext<MotionKit | null>(null);
export const useMotionKit = () => useContext(MotionContext);

/**
 * Carrega GSAP + ScrollTrigger + Lenis sob demanda (dynamic import),
 * sincroniza o Lenis com o ScrollTrigger e faz refresh após fontes e imagens.
 * Em prefers-reduced-motion o Lenis não é iniciado.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [kit, setKit] = useState<MotionKit | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tickerFn: ((t: number) => void) | null = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // economia de dados → comportamento leve
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

    // Inicia o motion fora do caminho crítico: na 1ª interação ou quando o navegador ficar ocioso após o load.
    const events = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      events.forEach((e) => removeEventListener(e, start));
      init();
    };
    events.forEach((e) => addEventListener(e, start, { passive: true, once: true }));
    const ric = (cb: () => void) => ("requestIdleCallback" in window ? requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 1200));
    if (document.readyState === "complete") ric(start);
    else addEventListener("load", () => ric(start), { once: true });

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.defaults({ ease: "expo.out", duration: 1 });

      let lenis: Lenis | null = null;
      if (!reduced && !saveData) {
        const { default: LenisCtor } = await import("lenis");
        if (cancelled) return;
        lenis = new LenisCtor({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        tickerFn = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
        lenisRef.current = lenis;
        // âncoras internas via Lenis
        document.addEventListener("click", onAnchor);
      }

      setKit({ gsap, ScrollTrigger, lenis, reduced: reduced || saveData, fine: fine && !reduced });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      if (document.readyState === "complete") setTimeout(refresh, 200);
      else window.addEventListener("load", refresh, { once: true });
    };

    function onAnchor(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || !lenisRef.current) return;
      const id = a.getAttribute("href")!;
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenisRef.current.scrollTo(el as HTMLElement, { offset: id === "#topo" ? 0 : -10 });
      history.replaceState(null, "", id);
      // foco acessível no destino
      (el as HTMLElement).setAttribute("tabindex", "-1");
      (el as HTMLElement).focus({ preventScroll: true });
    }

    return () => {
      cancelled = true;
      events.forEach((e) => removeEventListener(e, start));
      document.removeEventListener("click", onAnchor);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      if (tickerFn) import("gsap").then(({ gsap }) => gsap.ticker.remove(tickerFn!));
    };
  }, []);

  return <MotionContext.Provider value={kit}>{children}</MotionContext.Provider>;
}
