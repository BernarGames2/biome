"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Indicador de rolagem: um caule vertical que cresce com a rolagem e solta uma folha
 * a cada seção atravessada, com contador "01 / 07". Desktop apenas.
 */
export function ScrollProgress() {
  const stem = useRef<SVGPathElement>(null);
  const [state, setState] = useState({ i: 1, n: 7, marks: [] as number[], p: 0 });

  useEffect(() => {
    let raf = 0;
    let sections: HTMLElement[] = [];
    let marks: number[] = [];
    const measure = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
      const max = document.documentElement.scrollHeight - innerHeight;
      marks = sections.map((s) => Math.min(1, Math.max(0, (s.getBoundingClientRect().top + scrollY) / max)));
    };
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      let i = 0;
      sections.forEach((s, k) => { if (s.getBoundingClientRect().top < innerHeight * 0.5) i = k; });
      if (stem.current) stem.current.style.strokeDashoffset = String(1 - p);
      setState((prev) => (prev.i === i + 1 && prev.n === sections.length && prev.marks === marks && Math.abs(prev.p - p) < 0.01 ? prev : { i: i + 1, n: sections.length, marks, p }));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };
    measure();
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onResize); ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden h-[42vh] -translate-y-1/2 flex-col items-center gap-4 mix-blend-difference text-offwhite lg:flex" aria-hidden>
      <span className="micro tabular-nums [writing-mode:vertical-rl]">{pad(state.i)} / {pad(state.n)}</span>
      <svg viewBox="0 0 20 100" preserveAspectRatio="none" className="h-full w-5 overflow-visible">
        <line x1="10" y1="0" x2="10" y2="100" stroke="currentColor" strokeOpacity=".25" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path ref={stem} d="M10 0 C 12 25, 8 50, 10 75 S 10 100, 10 100" pathLength={1} stroke="currentColor" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 top-8">
        {state.marks.map((m, k) => (
          <span
            key={k}
            className="absolute left-1/2 block h-[7px] w-[13px] rounded-[0_100%_0_100%] bg-current transition-[transform,opacity] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
            style={{
              top: `${m * 100}%`,
              transform: `translateX(${k % 2 ? "-110%" : "10%"}) rotate(${k % 2 ? 30 : -30}deg) scale(${state.p + 0.001 >= m ? 1 : 0})`,
              opacity: state.p + 0.001 >= m ? 1 : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
