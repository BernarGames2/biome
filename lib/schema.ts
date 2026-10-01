import { site, images } from "@/data/site";

const dayMap: Record<number, string> = {
  0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday",
};

export function localBusinessSchema() {
  const groups = new Map<string, string[]>();
  for (const h of site.hours) {
    if (!h.open || !h.close) continue;
    const k = `${h.open}-${h.close}`;
    groups.set(k, [...(groups.get(k) ?? []), `https://schema.org/${dayMap[h.day]}`]);
  }
  const { address: a } = site;
  return {
    "@context": "https://schema.org",
    "@type": ["HairSalon", "BeautySalon"],
    "@id": `${site.url}/#salon`,
    name: site.name,
    alternateName: site.legacyNames,
    description: site.description,
    url: site.url,
    image: [`${site.url}${images.hero.available ? images.hero.src : "/opengraph-image"}`],
    telephone: site.contact.phoneMobile.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    ...(a.geo ? { geo: { "@type": "GeoCoordinates", latitude: a.geo.lat, longitude: a.geo.lng } } : {}),
    openingHoursSpecification: [...groups.entries()].map(([k, days]) => {
      const [opens, closes] = k.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    }),
    sameAs: [site.contact.instagram.url],
    areaServed: { "@type": "City", name: "Uberlândia" },
    knowsAbout: ["Saúde capilar", "Cachos", "Corte curto", "Mechas e cores", "Visagismo", "Bem-estar"],
  };
}
