"use client";

import { useRef } from "react";
import { habitats, site } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { useGsap } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { OrganicMask } from "@/components/ui/OrganicMask";
import { Photo } from "@/components/ui/Photo";
import { Vine } from "@/components/ui/Vine";
import { Button } from "@/components/ui/Button";
import { ArrowRight, WhatsApp } from "@/components/ui/Icons";

const toneCls = {
  offwhite: "bg-offwhite text-carvao",
  areia: "bg-areia text-carvao",
  musgo: "bg-musgo text-offwhite",
} as const;
const artTone = { offwhite: "musgo", areia: "musgo", musgo: "areia" } as const;
const shapes = ["arch", "blob-a", "leaf", "arch-inv", "blob-b"] as const;
const bgHex = { offwhite: "#faf6ee", areia: "#efe6d6", musgo: "#2f4a3a" } as const;

export function Habitats() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, ({ gsap, ScrollTrigger }, el) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = el.querySelector<HTMLElement>("[data-track]")!;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", el);
      const dist = () => track.scrollWidth - innerWidth;

      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: el.querySelector("[data-pin]"),
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // caule percorre a seção
      gsap.fromTo(el.querySelector("[data-vine-path]"), { strokeDashoffset: 1 }, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: el.querySelector("[data-pin]"), start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
      });
      const leaves = gsap.utils.toArray<SVGPathElement>("[data-vine-leaf]", el);
      gsap.set(leaves, { scale: 0 });

      panels.forEach((p, i) => {
        const inner = p.querySelector("[data-panel-inner]");
        const mask = p.querySelector("[data-hmask]");
        const img = p.querySelector("[data-inner]");
        // ativo em escala 1, demais 0.96
        gsap.fromTo(inner, { scale: 0.96 }, {
          scale: 1, ease: "none",
          scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 85%", end: "left 25%", scrub: true },
        });
        gsap.to(inner, {
          scale: 0.96, ease: "none", immediateRender: false,
          scrollTrigger: { trigger: p, containerAnimation: tween, start: "right 75%", end: "right 15%", scrub: true },
        });
        if (mask) {
          gsap.fromTo(mask, { clipPath: "inset(0% 0% 100% 0%)" }, {
            clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.out",
            scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 80%", toggleActions: "play none none reverse" },
          });
          gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        }
        // folha do caule nasce em cada habitat + fundo muda de tom
        ScrollTrigger.create({
          trigger: p, containerAnimation: tween, start: "left 55%", end: "right 55%",
          onToggle: (self) => {
            if (self.isActive) {
              const tone = (p.dataset.tone || "offwhite") as keyof typeof bgHex;
              gsap.to(el, { backgroundColor: bgHex[tone], duration: 0.8, ease: "power2.out" });
            }
          },
          onEnter: () => leaves[i] && gsap.to(leaves[i], { scale: 1, duration: 0.9, ease: "back.out(2)" }),
          onLeaveBack: () => leaves[i] && gsap.to(leaves[i], { scale: 0, duration: 0.4 }),
        });
      });
    });

    // mobile / reduced: painéis verticais com stagger de entrada
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-panel]", el).forEach((p) => {
        const items = p.querySelectorAll("[data-m-item]");
        gsap.from(items, { opacity: 0, y: 40, duration: 1, stagger: 0.1, scrollTrigger: { trigger: p, start: "top 82%", once: true } });
        const mask = p.querySelector("[data-hmask]");
        if (mask) gsap.fromTo(mask, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.out", scrollTrigger: { trigger: mask, start: "top 85%", once: true } });
      });
    });
    return () => mm.revert();
  });

  return (
    <section ref={ref} id="habitats" data-section data-tone="light" aria-labelledby="habitats-title" className="habitats relative bg-offwhite">
      <div data-pin className="habitats-pin relative overflow-hidden">
        <div data-track className="habitats-track relative">
          {/* intro */}
          <div data-panel data-tone="offwhite" className="habitats-panel habitats-intro flex flex-col justify-center bg-offwhite pt-[var(--section-y)] lg:pt-0">
            <div data-panel-inner className="container-x lg:max-w-none lg:pl-[var(--gutter)] lg:pr-[6vw]">
              <span data-m-item><SectionLabel index="02">Os Habitats</SectionLabel></span>
              <h2 id="habitats-title" data-m-item className="h2 mt-8 max-w-[11ch]">
                Cada cuidado, <em className="italic-soft font-[300]">um habitat.</em>
              </h2>
              <p data-m-item className="lead mt-8 max-w-[34rem] text-muted">
                Cabelo, pele, corpo, mãos e o próprio espaço. Cinco ambientes que conversam entre si, como num bioma: o que você cuida em um, floresce no outro.
              </p>
              <p data-m-item className="micro mt-10 hidden items-center gap-3 text-muted lg:flex">
                Role para atravessar <ArrowRight size={16} />
              </p>
              <p data-m-item className="micro mt-4 text-muted">{site.pricing}</p>
            </div>
          </div>

          {habitats.map((h, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={h.id}
                id={`habitat-${h.id}`}
                data-panel
                data-tone={h.tone}
                aria-labelledby={`h-${h.id}`}
                className={`habitats-panel habitats-item ${toneCls[h.tone]}`}
              >
                <div data-panel-inner className={`container-x grid h-full grid-cols-12 items-center gap-x-6 gap-y-8 py-20 lg:max-w-none lg:px-[4vw] lg:py-0`}>
                  <div data-m-item className={`col-span-12 sm:col-span-8 lg:col-span-6 ${flip ? "lg:order-2 lg:col-start-7 lg:mt-[12vh]" : "lg:mb-[10vh]"}`}>
                    <div data-hmask className="relative">
                      <OrganicMask shape={shapes[i % shapes.length]} reveal={false} className="aspect-[4/5] w-full shadow-[var(--shadow-soft)] lg:h-[66vh] lg:w-auto lg:max-w-full">
                        <div className="relative h-full w-full" data-cursor="ver">
                          <Photo slot={h.image} sizes="(min-width:1024px) 40vw, 80vw" art={h.art} tone={artTone[h.tone]} />
                        </div>
                      </OrganicMask>
                    </div>
                  </div>

                  <div className={`col-span-12 lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
                    <p data-m-item aria-hidden className={`font-display text-outline text-[clamp(5rem,4rem+6vw,11rem)] font-[300] leading-[0.8] ${h.tone === "musgo" ? "text-girassol" : "text-musgo"}`} style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
                      {h.numeral}
                    </p>
                    <p data-m-item className={`micro mt-6 ${h.tone === "musgo" ? "text-offwhite/80" : "text-muted"}`}>{h.kicker}</p>
                    <h3 id={`h-${h.id}`} data-m-item className="h3 mt-3 max-w-[14ch]">{h.title}</h3>
                    <p data-m-item className={`mt-5 max-w-[28rem] ${h.tone === "musgo" ? "text-offwhite/85" : "text-muted"}`}>{h.text}</p>
                    {h.items.length > 1 && (
                      <ul data-m-item className="mt-6 flex flex-wrap gap-2" aria-label={`Serviços em ${h.title}`}>
                        {h.items.map((it) => <li key={it} className="chip">{it}</li>)}
                      </ul>
                    )}
                    <a
                      data-m-item
                      href={waLink(h.wa)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("whatsapp_click", `habitat-${h.id}`)}
                      className="link-u mt-8 font-medium"
                    >
                      {h.cta} <span className="sr-only">pelo WhatsApp</span><ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}

          {/* fechamento + CTA após os habitats */}
          <div data-panel data-tone="musgo" className="habitats-panel habitats-outro flex flex-col justify-center bg-musgo py-24 text-offwhite lg:py-0">
            <div data-panel-inner className="container-x lg:max-w-none lg:px-[5vw]">
              <p data-m-item className="micro text-offwhite/80">Por onde começar</p>
              <p data-m-item className="font-display mt-6 max-w-[14ch] text-[clamp(2.2rem,1.4rem+3vw,4.2rem)] font-[320] leading-[1.02]" style={{ fontVariationSettings: '"SOFT" 100' }}>
                Não sabe qual habitat é o seu? <em className="italic-soft">A gente conversa.</em>
              </p>
              <div data-m-item className="mt-10">
                <Button href={waLink("geral")} variant="sun-dark" size="lg" section="habitats" icon={<WhatsApp size={18} />}>Reserve seu momento</Button>
              </div>
            </div>
          </div>

          <Vine orientation="horizontal" leaves={habitats.length} length={4200} className="habitats-vine pointer-events-none absolute bottom-[5vh] left-[58vw] hidden h-[60px] w-[420vw] text-folha lg:block" leafColor="var(--girassol)" />
        </div>
      </div>
    </section>
  );
}
