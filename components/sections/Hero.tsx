"use client";

import { useEffect, useRef, useState } from "react";
import { site, images, heroMode } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import { useGsap } from "@/lib/motion";
import { Photo } from "@/components/ui/Photo";
import { Leaf } from "@/components/ui/Leaf";
import { SplitText } from "@/components/ui/SplitText";
import { Button } from "@/components/ui/Button";
import { ArrowDown, ArrowRight, WhatsApp } from "@/components/ui/Icons";

/** Folhas em primeiro plano (modo "leaves"): posição, tamanho, rotação, profundidade. */
const frontLeaves = [
  { cls: "left-[-9%] bottom-[-18%] w-[27vw] max-w-[360px] min-w-[160px]", rot: 34, depth: 1.6, fill: "#1f3227" },
  { cls: "right-[-5%] top-[6%] w-[22vw] max-w-[300px] min-w-[120px]", rot: -146, depth: 1.25, fill: "#22372b" },
  { cls: "right-[24%] bottom-[-22%] w-[15vw] max-w-[210px] min-w-[90px] hidden md:block", rot: 12, depth: 2, fill: "#2a4334" },
];
const backLeaves = [
  { cls: "left-[38%] top-[-12%] w-[16vw] max-w-[230px] hidden md:block", rot: 170, depth: 0.5, fill: "#3b5a47" },
  { cls: "left-[8%] top-[14%] w-[9vw] max-w-[120px] hidden md:block", rot: -30, depth: 0.4, fill: "#3b5a47" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detecção só no cliente (evita mismatch de hidratação)
    if (images.heroVideo.available && !reduced && !saveData) setVideo(true);
  }, []);

  useGsap(ref, ({ gsap, reduced, fine }, el) => {
    if (reduced) return;
    const bg = el.querySelector("[data-hero-bg]");
    const text = el.querySelector("[data-hero-text]");
    const dim = el.querySelector("[data-hero-dim]");
    const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", el);

    // rolagem: título sobe mais devagar que a imagem; imagem escala e escurece
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
    tl.to(bg, { yPercent: 18, scale: 1.08, ease: "none" }, 0)
      .to(text, { yPercent: 28, ease: "none" }, 0)
      .to(dim, { opacity: 0.65, ease: "none" }, 0);
    layers.forEach((l) => tl.to(l, { yPercent: -40 * Number(l.dataset.depth), ease: "none" }, 0));

    // caule decorativo cresce
    gsap.fromTo(el.querySelectorAll("[data-hero-vine] path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, delay: 0.6, ease: "power3.inOut" });

    if (!fine) return;
    // mouse: título 12px no sentido oposto, imagem 6px, folhas pela profundidade
    const qt = { x: gsap.quickTo(text, "x", { duration: 1.2 }), y: gsap.quickTo(text, "y", { duration: 1.2 }) };
    const qb = { x: gsap.quickTo(bg, "x", { duration: 1.4 }), y: gsap.quickTo(bg, "y", { duration: 1.4 }) };
    const ql = layers.map((l) => ({ x: gsap.quickTo(l, "x", { duration: 1.3 }), y: gsap.quickTo(l, "y", { duration: 1.3 }), d: Number(l.dataset.depth) }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      qt.x(-nx * 24); qt.y(-ny * 24);
      qb.x(nx * 12); qb.y(ny * 12);
      ql.forEach((q) => { q.x(nx * 18 * q.d); q.y(ny * 14 * q.d); });
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  });

  const line1 = "Beleza natural";
  return (
    <section ref={ref} id="topo" data-section data-tone="dark" aria-labelledby="hero-title" className="relative isolate flex h-[100svh] min-h-[620px] flex-col overflow-hidden bg-musgo-deep text-offwhite">
      {/* fundo */}
      <div data-hero-bg className="absolute inset-0 -z-30 will-change-transform">
        <div className="hero-zoom absolute inset-0">
          {video ? (
            <video className="h-full w-full object-cover" autoPlay muted loop playsInline poster={images.hero.available ? images.hero.src : undefined} aria-hidden>
              <source src={images.heroVideo.webm} type="video/webm" />
              <source src={images.heroVideo.mp4} type="video/mp4" />
            </video>
          ) : (
            <Photo slot={images.hero} priority sizes="100vw" art="fern" tone="musgo" className="[&_svg]:opacity-90" />
          )}
        </div>
      </div>
      {/* overlay verde-musgo/carvão suave para legibilidade */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgb(27_27_25/.45)_0%,rgb(34_55_43/.15)_38%,rgb(27_27_25/.72)_100%)]" />
      <div aria-hidden data-hero-dim className="absolute inset-0 -z-20 bg-carvao opacity-0" />

      {/* folhas de fundo */}
      {heroMode === "leaves" && backLeaves.map((l, i) => (
        <div key={i} data-depth={l.depth} aria-hidden className={`absolute -z-10 ${l.cls}`}>
          <div className="hero-rise" style={{ ["--d" as string]: `${0.5 + i * 0.1}s` }}>
            <Leaf fill={l.fill} vein="#6f8f5e" style={{ transform: `rotate(${l.rot}deg)` }} />
          </div>
        </div>
      ))}

      {/* caule decorativo */}
      <svg data-hero-vine aria-hidden viewBox="0 0 200 900" className="pointer-events-none absolute right-[16%] top-0 -z-10 hidden h-full w-[12vw] max-w-[180px] text-girassol/70 md:block" fill="none">
        <path pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} d="M120 0 C 60 160, 170 300, 100 460 S 60 760, 120 900" stroke="currentColor" strokeWidth="1" />
        <path pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} d="M108 300 Q 150 280 168 236 Q 128 248 108 300Z M98 520 Q 48 510 30 470 Q 74 474 98 520Z M118 720 Q 160 700 176 660 Q 136 670 118 720Z" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* topo: microtextos */}
      <div className="container-x relative mt-[calc(var(--header-h)+1.25rem)] flex items-start justify-between gap-6">
        <p className="micro hero-drop max-w-[16rem] text-offwhite/85" style={{ ["--d" as string]: "0.9s" }}>Saúde capilar · Visagismo<br />Bem-estar · Sustentabilidade</p>
        <p className="micro hero-drop hidden text-right text-offwhite/85 sm:block" style={{ ["--d" as string]: "1s" }}>{site.address.city} — {site.address.state}<br />Ter a Sáb · desde as 9h</p>
      </div>

      {/* título */}
      <div data-hero-text className="container-x relative mt-auto will-change-transform">
        <h1 id="hero-title" className="display-hero">
          <span className="sr-only">Bioma Evidence: beleza natural como rotina em Uberlândia.</span>
          <span aria-hidden className="hero-line">
            <SplitText text={line1} mode="chars" />
          </span>
          <span aria-hidden className="hero-line md:pl-[22vw]">
            <span className="italic-soft font-[250]"><SplitText text="como" mode="chars" startIndex={line1.length} /></span>{" "}
            <SplitText text="rotina" mode="chars" startIndex={line1.length + 4} />
            <span className="hero-mask"><span className="hero-char text-girassol" style={{ ["--i" as string]: line1.length + 10 }}>.</span></span>
          </span>
        </h1>
      </div>

      {/* folhas em primeiro plano, passando na frente das letras */}
      {heroMode === "leaves" && frontLeaves.map((l, i) => (
        <div key={i} data-depth={l.depth} aria-hidden className={`pointer-events-none absolute z-10 opacity-90 mix-blend-multiply ${l.cls}`}>
          <div className="hero-rise" style={{ ["--d" as string]: `${0.7 + i * 0.12}s` }}>
            <Leaf fill={l.fill} vein="#6f8f5e" style={{ transform: `rotate(${l.rot}deg)` }} />
          </div>
        </div>
      ))}
      {heroMode === "cutout" && (
        <div data-depth="1.3" aria-hidden className="pointer-events-none absolute inset-0 z-10">
          <Photo slot={images.heroCutout} priority sizes="100vw" />
        </div>
      )}

      {/* base: convite, CTAs, rolagem */}
      <div className="container-x relative z-20 mb-6 mt-8 grid grid-cols-12 items-end gap-y-6 md:mb-8">
        <div className="col-span-12 md:col-span-6 lg:col-span-5">
          <p className="hero-fade max-w-[30rem] text-[0.98rem] leading-relaxed text-offwhite/90" style={{ ["--d" as string]: "1.15s" }}>
            Um ecossistema de cuidado para cabelo, pele, corpo e mãos. Começamos por entender você, e a beleza cresce no seu tempo.
          </p>
          <div className="hero-fade mt-5 flex flex-wrap gap-3" style={{ ["--d" as string]: "1.3s" }}>
            <Button href={waLink("geral")} variant="sun" section="hero" icon={<WhatsApp size={18} />}>{site.invite}</Button>
            <Button href="#habitats" variant="outline-light" icon={<ArrowDown size={18} />}>Explorar habitats</Button>
          </div>
        </div>

        <a href="#manifesto" className="hero-fade col-span-6 hidden flex-col items-center gap-3 justify-self-center md:col-span-2 md:col-start-8 md:flex" style={{ ["--d" as string]: "1.45s" }} aria-label="Rolar para o manifesto">
          <span className="micro text-offwhite/85">Role</span>
          <span className="relative block h-14 w-px overflow-hidden bg-offwhite/25"><span className="scroll-pulse absolute inset-x-0 top-0 h-1/2 bg-girassol" /></span>
          <ArrowDown size={16} className="scroll-pulse" />
        </a>

        <a href={waLink("geral")} target="_blank" rel="noopener noreferrer" className="hero-fade group col-span-12 flex items-center gap-3 justify-self-start md:col-span-3 md:col-start-10 md:justify-self-end" style={{ ["--d" as string]: "1s" }}>
          <span className="font-display text-[clamp(1.35rem,1rem+1.2vw,2rem)] font-[300] italic text-offwhite" style={{ fontVariationSettings: '"SOFT" 100' }}>Reserve seu momento</span>
          <ArrowRight size={20} className="text-girassol transition-transform duration-500 group-hover:translate-x-1.5" />
        </a>
      </div>
    </section>
  );
}
