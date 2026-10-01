"use client";

import { useRef } from "react";
import { site, images, team } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import { useGsap } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EditorialTitle } from "@/components/ui/EditorialTitle";
import { OrganicMask } from "@/components/ui/OrganicMask";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { BLeaf } from "@/components/ui/Logo";
import { WhatsApp } from "@/components/ui/Icons";

export function About() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, ({ gsap, reduced }, el) => {
    // contadores animam até os números reais
    el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
      const target = Number(n.dataset.count);
      const dec = Number(n.dataset.dec || 0);
      const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (reduced) return;
      const o = { v: 0 };
      gsap.to(o, {
        v: target, duration: 2, ease: "power3.out",
        scrollTrigger: { trigger: n, start: "top 90%", once: true },
        onUpdate: () => { n.textContent = fmt(o.v); },
      });
    });
  });

  return (
    <section ref={ref} id="a-bioma" data-section data-tone="light" aria-labelledby="about-title" className="section-y relative overflow-hidden bg-areia">
      <div className="container-x grid-editorial gap-y-14">
        <div className="col-span-12 lg:col-span-6">
          <SectionLabel index="04">A Bioma</SectionLabel>
          <EditorialTitle id="about-title" className="mt-8">
            Um espaço que <em>cresce com quem chega.</em>
          </EditorialTitle>
          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1fr] lg:max-w-[40rem]" data-stagger>
            <p className="lead">Plantas, luz natural e tempo. A Bioma Evidence foi pensada para que cuidar de si seja um hábito calmo, não uma urgência.</p>
            <p className="text-muted">Trabalhamos com sustentabilidade, saúde capilar, bem-estar e visagismo. Quatro raízes que orientam cada escolha, do corte à forma como recebemos você.</p>
          </div>
        </div>

        <div className="relative col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-5 lg:col-start-8 lg:-mt-6">
          <OrganicMask shape="blob-a" className="aspect-[4/5] w-full">
            <div className="relative h-full w-full" data-cursor="ver">
              <Photo slot={images.space} sizes="(min-width:1024px) 40vw, 90vw" art="sunflower" tone="musgo" />
            </div>
          </OrganicMask>
          <FloatingCard tone="offwhite" className="absolute -bottom-8 left-0 max-w-[15rem] sm:-left-10 lg:-left-20">
            <p className="micro text-muted">Da nossa bio</p>
            <p className="font-display mt-2 text-xl italic leading-snug" style={{ fontVariationSettings: '"SOFT" 100' }}>“Beleza natural como rotina.”</p>
          </FloatingCard>
        </div>

        {/* valores — lista editorial, não cards iguais */}
        <ol className="col-span-12 mt-10 grid border-t border-[var(--line)] md:grid-cols-2 lg:grid-cols-4" data-stagger>
          {site.values.map((v, i) => (
            <li key={v.title} className={`border-b border-[var(--line)] py-8 md:pr-8 ${i % 2 ? "md:pt-14" : ""} lg:border-b-0 ${i ? "lg:border-l lg:pl-8" : ""}`}>
              <span className="micro text-muted tabular-nums">0{i + 1}</span>
              <h3 className="h-small mt-4 text-[1.5rem]">{v.title}</h3>
              <p className="mt-2 text-muted">{v.text}</p>
            </li>
          ))}
        </ol>

        {/* métricas reais */}
        <dl className="col-span-12 grid gap-y-10 sm:grid-cols-3" data-stagger>
          {site.metrics.map((m) => (
            <div key={m.label} className="flex flex-col-reverse gap-2">
              <dt className="max-w-[16rem] text-muted">{m.label}</dt>
              <dd className="font-display text-[clamp(3rem,2rem+4vw,5.5rem)] font-[300] leading-none tracking-[-0.03em]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
                {m.value === null ? m.display : (
                  <>
                    {m.prefix}
                    <span data-count={m.value} data-dec={m.decimals}>{m.value.toLocaleString("pt-BR", { minimumFractionDigits: m.decimals })}</span>
                    {m.suffix}
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>

        {team.length > 0 && (
          <div className="col-span-12">
            <h3 className="micro text-muted">Equipe</h3>
            <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((p) => (
                <li key={p.name}>
                  <OrganicMask shape="arch" className="aspect-[3/4]"><Photo slot={p.image} sizes="25vw" /></OrganicMask>
                  <p className="h-small mt-4 text-xl">{p.name}</p>
                  <p className="text-muted">{p.role}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="col-span-12 flex flex-wrap items-center gap-6" data-reveal>
          <Button href={waLink("geral")} size="lg" section="a-bioma" icon={<WhatsApp size={18} />}>Reserve seu momento</Button>
          <span className="micro flex items-center gap-2 text-muted"><BLeaf size={12} /> {site.pricing}</span>
        </div>
      </div>
    </section>
  );
}
