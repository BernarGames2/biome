"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EditorialTitle } from "@/components/ui/EditorialTitle";
import { Button } from "@/components/ui/Button";
import { BotanicalArt } from "@/components/ui/BotanicalArt";
import { ArrowUpRight, Clock, Instagram, LinkIcon, Phone, Pin, WhatsApp } from "@/components/ui/Icons";

const a = site.address;
const fullAddress = `${a.street} – ${a.district}, ${a.city}/${a.state}, ${a.postalCode}`;
const mapsQuery = encodeURIComponent(`${a.street}, ${a.district}, ${a.city} - ${a.state}, ${a.postalCode}`);
const directions = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

function useToday() {
  const [d, setD] = useState<number | null>(null);
  useEffect(() => {
    const wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "America/Sao_Paulo" }).format(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detecção só no cliente (evita mismatch de hidratação)
    setD(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd));
  }, []);
  return d;
}

export function Contact() {
  const today = useToday();
  const [map, setMap] = useState(false);

  return (
    <section id="contato" data-section data-tone="light" aria-labelledby="contact-title" className="section-y relative bg-offwhite pt-0">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-musgo text-offwhite" data-tone="dark">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-20 hidden h-[560px] w-[440px] opacity-40 md:block" data-parallax="8">
            <BotanicalArt variant="fern" tone="musgo" />
          </div>

          <div className="relative grid gap-y-14 p-6 pb-10 pt-12 sm:p-10 md:p-14 lg:grid-cols-12 lg:gap-x-10 lg:p-20">
            <div className="lg:col-span-6">
              <SectionLabel index="07" tone="light">Contato</SectionLabel>
              <EditorialTitle id="contact-title" className="mt-8">
                Reserve seu <em>momento.</em>
              </EditorialTitle>
              <p className="lead mt-8 max-w-[28rem] text-offwhite/85" data-reveal>
                Conte o que você procura e a gente encontra um horário com calma. {site.pricing}.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4" data-reveal>
                <Button href={waLink("geral")} variant="sun-dark" size="lg" section="contato" magnetic ripple icon={<WhatsApp size={20} />}>
                  Chamar no WhatsApp
                </Button>
                <a href={`tel:${site.contact.phoneMobile.tel}`} onClick={() => track("phone_click", "contato")} className="link-u font-medium">
                  <Phone size={18} /> {site.contact.phoneMobile.display}
                </a>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-offwhite/90" data-reveal>
                {site.contact.phoneLandline.show && (
                  <li><a className="link-u" href={`tel:${site.contact.phoneLandline.tel}`} onClick={() => track("phone_click", "contato-fixo")}><Phone size={16} /> {site.contact.phoneLandline.display}</a></li>
                )}
                <li><a className="link-u" href={site.contact.instagram.url} target="_blank" rel="noopener noreferrer" onClick={() => track("instagram_click", "contato")}><Instagram size={16} /> {site.contact.instagram.handle}</a></li>
                <li><a className="link-u" href={site.contact.links.url} target="_blank" rel="noopener noreferrer"><LinkIcon size={16} /> {site.contact.links.label}</a></li>
              </ul>
            </div>

            <div className="grid gap-10 lg:col-span-5 lg:col-start-8">
              <div>
                <h3 className="micro flex items-center gap-2 text-offwhite/80"><Clock size={16} /> Horários</h3>
                <table className="mt-4 w-full border-collapse text-[0.98rem]">
                  <caption className="sr-only">Horário de funcionamento</caption>
                  <tbody data-stagger>
                    {site.hours.map((h) => {
                      const isToday = today === h.day;
                      return (
                        <tr key={h.label} className={`border-b border-[var(--line-light)] ${h.open ? "" : "text-offwhite/65"}`}>
                          <th scope="row" className="py-3 text-left font-normal">
                            {h.label}
                            {isToday && <span className="micro ml-3 rounded-full bg-girassol px-2 py-0.5 text-[0.6rem] text-carvao">Hoje</span>}
                          </th>
                          <td className="py-3 text-right tabular-nums">{h.open ? `${h.open} – ${h.close}` : "Fechado"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="micro flex items-center gap-2 text-offwhite/80"><Pin size={16} /> Endereço</h3>
                <address className="mt-4 not-italic leading-relaxed">{fullAddress}</address>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button href={directions} variant="outline-light" section="contato" icon={<ArrowUpRight size={18} />}>Como chegar</Button>
                  {!map && (
                    <button type="button" onClick={() => setMap(true)} className="link-u text-sm font-medium">Ver mapa aqui</button>
                  )}
                </div>
                {map && (
                  <div className="mt-6 aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-musgo-deep">
                    <iframe
                      title={`Mapa: ${fullAddress}`}
                      src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                      className="h-full w-full border-0 grayscale-[30%]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
