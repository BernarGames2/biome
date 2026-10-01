import { site } from "@/data/site";
import { BLeaf } from "@/components/ui/Logo";
import { Instagram, ArrowUpRight } from "@/components/ui/Icons";

/** Footer com wordmark gigante em contorno; cada letra reage ao hover (sobe 6px e vira girassol). */
export function Footer() {
  const word = "BIOMA EVIDENCE";
  return (
    <footer className="relative overflow-hidden bg-carvao pb-20 pt-20 text-offwhite md:pb-0" data-tone="dark">
      <div className="container-x grid-editorial gap-y-10">
        <div className="col-span-12 md:col-span-5">
          <BLeaf size={30} className="text-girassol" />
          <p className="font-display mt-6 text-[clamp(1.8rem,1.2rem+2vw,3rem)] font-[320] italic leading-tight" style={{ fontVariationSettings: '"SOFT" 100' }}>
            {site.tagline}
          </p>
        </div>
        <div className="col-span-6 md:col-span-3 md:col-start-7">
          <p className="micro text-offwhite/70">Onde</p>
          <address className="mt-3 not-italic leading-relaxed text-offwhite/90">
            {site.address.street}<br />{site.address.district}<br />{site.address.city}/{site.address.state}
          </address>
        </div>
        <div className="col-span-6 md:col-span-3">
          <p className="micro text-offwhite/70">Siga</p>
          <ul className="mt-3 space-y-2">
            <li><a className="link-u" href={site.contact.instagram.url} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> {site.contact.instagram.handle}</a></li>
            <li><a className="link-u" href={site.contact.links.url} target="_blank" rel="noopener noreferrer">{site.contact.links.label} <ArrowUpRight size={14} /></a></li>
            <li><a className="link-u" href="#topo">Voltar ao topo</a></li>
          </ul>
        </div>
      </div>

      <p className="mt-16 flex w-full flex-wrap justify-center whitespace-nowrap px-2 font-display text-[18vw] md:text-[clamp(3rem,12.6vw,16rem)] font-[400] leading-[0.82] tracking-[-0.04em] text-folha" aria-label={word} role="text" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
        {[...word].map((ch, i) =>
          ch === " " ? <span key={i} aria-hidden className="block basis-full md:inline-block md:basis-auto md:w-[0.25em]" /> : (
            <span key={i} aria-hidden className="text-outline inline-block transition-[transform,color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:text-girassol [-webkit-text-stroke-width:1.2px]">
              {ch}
            </span>
          ),
        )}
      </p>

      <div className="container-x flex flex-col gap-2 border-t border-[var(--line-light)] py-6 text-xs text-offwhite/70 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. Beleza natural · {site.address.city}/{site.address.state}.</p>
        <p>{site.pricing} · Reservas pelo WhatsApp.</p>
      </div>
    </footer>
  );
}
