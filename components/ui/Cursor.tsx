"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionKit } from "./SmoothScroll";

/** Cursor customizado (desktop pointer:fine): ponto + anel com lerp; rótulos "VER" / "ARRASTE". */
export function Cursor() {
  const kit = useMotionKit();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const enabled = !!kit?.fine;

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0, shown = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; rx = mx; ry = my; dot.current!.style.opacity = ring.current!.style.opacity = "1"; }
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const c = t.closest<HTMLElement>("[data-cursor]");
      setLabel(c?.dataset.cursor ?? "");
      setHover(!!t.closest("a,button,input,[role=button],label,summary"));
    };
    const leave = () => { shown = false; dot.current!.style.opacity = ring.current!.style.opacity = "0"; };
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.current!.style.transform = `translate3d(${mx}px,${my}px,0)`;
      ring.current!.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      html.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  const big = !!label;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <div ref={dot} className="absolute left-0 top-0 opacity-0 mix-blend-difference">
        <span className={`block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-offwhite transition-transform duration-300 ${big ? "scale-0" : ""}`} />
      </div>
      <div ref={ring} className="absolute left-0 top-0 opacity-0">
        <span
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
            big ? "h-20 w-20 border border-transparent bg-girassol text-carvao" : hover ? "h-14 w-14 border border-girassol/80" : "h-9 w-9 border border-folha/70"
          }`}
        >
          {big && <span className="micro">{label}</span>}
        </span>
      </div>
    </div>
  );
}
