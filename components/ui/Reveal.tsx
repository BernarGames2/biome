"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { useGsap } from "@/lib/motion";

/** Wrapper semântico: marca um bloco para reveal (fade + subida). */
export function Reveal({ as: Tag = "div", children, className = "", delay = 0, stagger = false }: { as?: ElementType; children: ReactNode; className?: string; delay?: number; stagger?: boolean }) {
  return (
    <Tag className={className} {...(stagger ? { "data-stagger": "" } : { "data-reveal": "" })} data-delay={delay || undefined}>
      {children}
    </Tag>
  );
}

function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return el.querySelectorAll<HTMLElement>(".sw");
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const parts = node.textContent?.split(/(\s+)/) ?? [];
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); continue; }
      const mask = document.createElement("span");
      mask.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em";
      const inner = document.createElement("span");
      inner.className = "sw";
      inner.style.display = "inline-block";
      inner.textContent = part;
      mask.appendChild(inner);
      frag.appendChild(mask);
    }
    node.replaceWith(frag);
  }
  el.dataset.splitDone = "1";
  return el.querySelectorAll<HTMLElement>(".sw");
}

/**
 * Orquestrador global de reveals (montado uma vez). Lê atributos:
 *  [data-reveal]        fade + y
 *  [data-stagger]       filhos em stagger
 *  [data-split-lines]   palavras sobem dentro de máscara
 *  [data-clip-reveal]   clip-path inset 100%→0 + escala interna 1.2→1
 *  [data-parallax="n"]  deslocamento vertical (n = intensidade em %)
 *  [data-inner]         parallax interno de imagens mascaradas
 * Em reduced-motion: apenas fades curtos.
 */
export function RevealManager() {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, ({ gsap, ScrollTrigger, reduced }) => {
    const root = document.getElementById("conteudo") ?? document.body;
    const all = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s));
    const top = innerHeight;
    // Reveals únicos via IntersectionObserver (sem leituras de layout por gatilho → sem reflow em cascata).
    const plays = new Map<Element, () => void>();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        plays.get(e.target)?.();
        plays.delete(e.target);
      }),
      { rootMargin: "0px 0px -10% 0px" },
    );
    const once = (el: Element, play: () => void) => { plays.set(el, play); io.observe(el); };
    // elementos já acima da dobra no momento do init ficam como estão
    const pending = (el: HTMLElement) => el.getBoundingClientRect().top > top * 0.9;

    const reveal = all("[data-reveal]"), stag = all("[data-stagger]"), split = all("[data-split-lines]"), clip = all("[data-clip-reveal]");
    // leitura em lote (uma única passada de layout)
    const todo = new Set([...reveal, ...stag, ...split, ...clip].filter(pending));

    if (reduced) {
      todo.forEach((el) => {
        const targets = el.hasAttribute("data-stagger") ? el.children : el;
        gsap.set(targets, { opacity: 0 });
        once(el, () => gsap.to(targets, { opacity: 1, duration: 0.5, ease: "power1.out" }));
      });
      return () => io.disconnect();
    }

    reveal.filter((el) => todo.has(el)).forEach((el) => {
      gsap.set(el, { opacity: 0, y: 36 });
      once(el, () => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, delay: Number(el.dataset.delay || 0) }));
    });
    stag.filter((el) => todo.has(el)).forEach((el) => {
      gsap.set(el.children, { opacity: 0, y: 40 });
      once(el, () => gsap.to(el.children, { opacity: 1, y: 0, duration: 1.05, stagger: 0.1 }));
    });
    split.filter((el) => todo.has(el)).forEach((el) => {
      const words = splitWords(el);
      gsap.set(words, { yPercent: 110 });
      once(el, () => gsap.to(words, { yPercent: 0, duration: 1.15, stagger: 0.035 }));
    });
    clip.filter((el) => todo.has(el)).forEach((el) => {
      const inner = el.querySelector("[data-inner]");
      gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
      if (inner) gsap.set(inner, { scale: 1.2 });
      once(el, () => {
        gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.out" });
        if (inner) gsap.to(inner, { scale: 1, duration: 1.6 });
      });
    });

    // Efeitos com scrub continuam no ScrollTrigger (poucos).
    all("[data-clip-reveal] [data-inner]").forEach((inner) =>
      gsap.fromTo(inner, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: inner.parentElement, start: "top bottom", end: "bottom top", scrub: true } }),
    );
    all("[data-parallax]").forEach((el) => {
      const n = Number(el.dataset.parallax || 10);
      gsap.fromTo(el, { yPercent: n }, { yPercent: -n, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
    ScrollTrigger.refresh();
    return () => io.disconnect();
  });
  return <div ref={ref} hidden />;
}
