import { images, site } from "@/data/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EditorialTitle } from "@/components/ui/EditorialTitle";
import { Photo } from "@/components/ui/Photo";
import { Instagram } from "@/components/ui/Icons";

const arts = ["fern", "sunflower", "seed"] as const;
const tones = ["musgo", "areia", "carvao"] as const;

export function Community() {
  const [a, b, c] = images.community;
  return (
    <section id="experiencias" data-section data-tone="light" aria-labelledby="community-title" className="section-y relative overflow-hidden bg-offwhite pt-0">
      <div className="container-x grid-editorial gap-y-10">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <SectionLabel index="06">Experiência e Comunidade</SectionLabel>
          <EditorialTitle id="community-title" className="mt-8 !text-[clamp(2.2rem,1.4rem+3vw,4.2rem)]">
            Um lugar para <em>voltar.</em>
          </EditorialTitle>
          <p className="mt-8 max-w-[26rem] text-muted" data-reveal>
            O espaço é parte do cuidado: plantas, luz natural e girassóis. E em volta dele, uma comunidade de gente que se reconhece.
          </p>
          <a href={site.contact.instagram.url} target="_blank" rel="noopener noreferrer" className="link-u mt-8 font-medium" data-reveal>
            <Instagram size={18} /> Acompanhe em {site.contact.instagram.handle}
          </a>
        </div>

        {/* galeria leve — colagem com reveals alternados */}
        <div className="relative col-span-12 h-[min(120vw,640px)] md:col-span-6 lg:col-span-7 lg:col-start-6 lg:h-[680px]">
          {[a, b, c].map((img, i) => (
            <figure
              key={i}
              className={`absolute overflow-hidden ${
                i === 0 ? "left-0 top-[8%] h-[62%] w-[52%] mask-arch" : i === 1 ? "right-0 top-0 h-[44%] w-[42%] rounded-[var(--radius-lg)]" : "bottom-0 right-[8%] h-[46%] w-[48%] mask-blob-b"
              }`}
              data-clip-reveal
              data-cursor="ver"
            >
              <div className="absolute inset-[-8%_0]" data-inner>
                <Photo slot={img} sizes="(min-width:1024px) 30vw, 50vw" art={arts[i]} tone={tones[i]} />
              </div>
              {img.available && <figcaption className="sr-only">{img.alt}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
