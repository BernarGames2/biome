import { beforeAfter, testimonials, site } from "@/data/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EditorialTitle } from "@/components/ui/EditorialTitle";
import { BeforeAfter } from "@/components/ui/BeforeAfter";
import { Photo } from "@/components/ui/Photo";
import { BotanicalArt } from "@/components/ui/BotanicalArt";
import { Button } from "@/components/ui/Button";
import { Instagram } from "@/components/ui/Icons";
import { Testimonials } from "./Testimonials";

const isDev = process.env.NODE_ENV === "development";

/**
 * Antes e depois / Feedbacks.
 * Só exibe fotos e depoimentos REAIS e autorizados (data/site.ts).
 * Sem dados: em produção mostra apenas o convite para ver os feedbacks no Instagram;
 * em desenvolvimento mostra uma demonstração do comparador com arte botânica.
 */
export function Proof() {
  const pairs = beforeAfter;
  const showDemo = isDev && pairs.length === 0;

  return (
    <section id="feedbacks" data-section data-tone="light" aria-labelledby="proof-title" className="section-y relative bg-offwhite">
      <div className="container-x grid-editorial gap-y-12">
        <div className="col-span-12 lg:col-span-5">
          <SectionLabel index="05">Feedback</SectionLabel>
          <EditorialTitle id="proof-title" className="mt-8">
            Histórias que <em>falam por si.</em>
          </EditorialTitle>
          <p className="lead mt-8 max-w-[30rem] text-muted" data-reveal>
            Cachos, curtinhos, cores. As transformações e os recados das nossas clientes ficam guardados no destaque “Feedback” do nosso Instagram.
          </p>
          <div className="mt-10" data-reveal>
            <Button href={site.contact.instagram.url} variant="outline-dark" icon={<Instagram size={18} />}>Ver feedbacks no Instagram</Button>
          </div>
        </div>

        {(pairs.length > 0 || showDemo) && (
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            {pairs.map((p) => (
              <BeforeAfter
                key={p.id}
                label={`Comparar antes e depois: ${p.label}`}
                className="aspect-[4/5] rounded-[var(--radius-lg)]"
                before={<Photo slot={p.before} sizes="(min-width:1024px) 45vw, 100vw" />}
                after={<Photo slot={p.after} sizes="(min-width:1024px) 45vw, 100vw" />}
              />
            ))}
            {showDemo && (
              <>
                <BeforeAfter
                  label="Demonstração do comparador (somente desenvolvimento)"
                  className="aspect-[4/5] rounded-[var(--radius-lg)]"
                  before={<BotanicalArt variant="seed" tone="areia" />}
                  after={<BotanicalArt variant="sunflower" tone="musgo" />}
                />
                <p className="mt-3 font-mono text-xs text-muted">DEV: demonstração. Em produção só aparece com fotos reais autorizadas em data/site.ts → beforeAfter.</p>
              </>
            )}
          </div>
        )}

        {pairs.length === 0 && !showDemo && (
          <div aria-hidden className="relative col-span-12 hidden h-[460px] lg:col-span-6 lg:col-start-7 lg:block">
            <div className="absolute right-0 top-0 h-[78%] w-[58%] overflow-hidden mask-arch" data-clip-reveal><div className="absolute inset-[-8%_0]" data-inner><BotanicalArt variant="stem" tone="areia" /></div></div>
            <div className="absolute bottom-0 left-[6%] h-[56%] w-[40%] overflow-hidden mask-blob-b" data-clip-reveal><div className="absolute inset-[-8%_0]" data-inner><BotanicalArt variant="seed" tone="musgo" /></div></div>
          </div>
        )}

        {testimonials.length > 0 && (
          <div className="col-span-12">
            <Testimonials items={testimonials} />
          </div>
        )}
      </div>
    </section>
  );
}
