import { images } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EditorialTitle } from "@/components/ui/EditorialTitle";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { Sprout, WhatsApp } from "@/components/ui/Icons";

const steps = [
  { t: "Avaliação primeiro", d: "Olhamos o fio, o couro cabeludo e a sua rotina antes de sugerir qualquer técnica." },
  { t: "Visagismo", d: "O corte e a cor pensados para o formato do rosto, o estilo e a identidade de cada pessoa." },
  { t: "Cachos, curtinhos, mechas e cores", d: "Técnicas escolhidas para respeitar a natureza do seu cabelo." },
  { t: "Uma rotina possível", d: "Orientação de cuidado para casa, simples o bastante para caber no seu dia." },
];

export function HairHealth() {
  return (
    <section id="saude-capilar" data-section data-tone="dark" aria-labelledby="hh-title" className="relative overflow-hidden bg-musgo text-offwhite">
      <div className="grid lg:grid-cols-2">
        <div className="container-x section-y order-2 lg:order-1 lg:max-w-[46rem] lg:justify-self-end lg:pr-[5vw]">
          <SectionLabel index="03" tone="light">Saúde capilar</SectionLabel>
          <EditorialTitle id="hh-title" className="mt-8">
            Antes da técnica, <em>o seu cabelo.</em>
          </EditorialTitle>
          <p className="lead mt-8 max-w-[34rem] text-offwhite/85" data-reveal>
            Saúde capilar é a nossa especialidade. Cada atendimento parte de uma conversa e de uma avaliação, para que o resultado faça sentido no seu rosto e na sua{" "}
            <span className="script text-[1.6em] leading-none text-girassol">rotina</span>.
          </p>
          <ul className="mt-10 space-y-5" data-stagger>
            {steps.map((s) => (
              <li key={s.t} className="flex gap-4 border-t border-[var(--line-light)] pt-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-areia text-musgo" aria-hidden><Sprout size={18} /></span>
                <span>
                  <span className="h-small block text-[1.2rem]">{s.t}</span>
                  <span className="mt-1 block text-offwhite/80">{s.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-12" data-reveal>
            <span className="breathe inline-block">
              <Button href={waLink("cabelo")} variant="sun-dark" size="lg" section="saude-capilar" icon={<WhatsApp size={18} />}>Reserve seu momento</Button>
            </span>
          </div>
        </div>

        <div className="relative order-1 min-h-[70svh] lg:order-2 lg:min-h-full">
          <div className="absolute inset-0 overflow-hidden lg:rounded-bl-[200px]" data-clip-reveal data-cursor="ver">
            <div className="absolute inset-[-8%_0]" data-inner>
              <Photo slot={images.hairHealth} sizes="(min-width:1024px) 50vw, 100vw" art="leaf" tone="areia" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
