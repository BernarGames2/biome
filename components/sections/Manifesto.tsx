"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitText } from "@/components/ui/SplitText";
import { BotanicalArt } from "@/components/ui/BotanicalArt";

// A CONFIRMAR com o cliente (frase derivada da bio oficial)
const statement = "Beleza natural como rotina. Cuidado com o cabelo, com a pele e com o tempo que você dedica a si.";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, reduced }, el) => {
    const words = el.querySelectorAll("[data-word]");
    if (reduced) return;
    // palavras acendem de 50% a 100% conforme a rolagem (50% mantém contraste ≥ 3:1 em texto grande)
    gsap.fromTo(words, { opacity: 0.5 }, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: el.querySelector("[data-statement]"), start: "top 80%", end: "bottom 45%", scrub: 0.6 },
    });
  });

  return (
    <section ref={ref} id="manifesto" data-section data-tone="light" aria-labelledby="manifesto-title" className="section-y relative overflow-hidden bg-offwhite">
      <div className="container-x grid-editorial gap-y-10">
        <div className="col-span-12 md:col-span-3">
          <SectionLabel index="01">Manifesto</SectionLabel>
          <h2 id="manifesto-title" className="sr-only">Manifesto da Bioma Evidence</h2>
        </div>

        <p data-statement className="col-span-12 font-display text-[clamp(2rem,1.1rem+3.6vw,4.6rem)] font-[330] leading-[1.06] tracking-[-0.02em] md:col-span-9" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 120' }}>
          <SplitText text={statement} mode="words" />
        </p>

        <div className="col-span-12 grid gap-8 md:col-span-7 md:col-start-6 md:grid-cols-2" data-stagger>
          <p className="text-muted">
            A rotina corre. O cabelo cansa, perde o desenho, e o tempo para você fica sempre para depois.
          </p>
          <p>
            Aqui o cuidado começa com uma conversa: avaliação, escolhas naturais e visagismo, para que a beleza se mantenha no seu dia a dia, e não só no dia do salão.
          </p>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-0 hidden h-[380px] w-[260px] opacity-40 lg:block" data-parallax="14">
        <BotanicalArt variant="stem" tone="offwhite" />
      </div>
    </section>
  );
}
