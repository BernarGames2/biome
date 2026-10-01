/**
 * BIOMA EVIDENCE — fonte única de dados do site.
 *
 * Regra: só entram aqui informações REAIS e confirmadas.
 * Tudo marcado com `confirmed: false` / "A CONFIRMAR" depende do cliente
 * (veja também a lista no README). Nunca invente preços, notas, depoimentos,
 * parcerias ou alegações de saúde.
 */

export type ImageSlot = {
  /** Caminho em /public. Se o arquivo ainda não existir, deixe `available: false` e o site usa arte botânica. */
  src: string;
  alt: string;
  width: number;
  height: number;
  available: boolean;
};

export const site = {
  /** A CONFIRMAR: "Bioma Evidence" (atual no Instagram) vs "Evidence Cabelo e Pele". */
  name: "Bioma Evidence",
  nameConfirmed: false,
  legacyNames: ["Evidence Cabelo e Pele", "Evidence Beleza Natural"],
  tagline: "Beleza natural como rotina.",
  invite: "Reserve seu momento",
  city: "Uberlândia",
  state: "MG",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.biomaevidence.com.br").replace(/\/$/, ""),
  description:
    "Bioma Evidence: espaço de beleza natural e saúde capilar em Uberlândia/MG. Cortes, cachos, curtinhos, mechas e cores, nutrição, massagens e manicure, com visagismo, sustentabilidade e bem-estar. Reserve seu momento.",

  /** Bio oficial do Instagram (texto real). */
  bio: [
    "Beleza Natural como Rotina",
    "Sustentabilidade",
    "Saúde Capilar",
    "Bem-estar",
    "Visagismo",
  ],
  /** A CONFIRMAR: significado de "Licenciado @lacesandhair" e se pode aparecer no site. */
  license: { text: "Licenciado @lacesandhair", show: false },

  contact: {
    /** A CONFIRMAR: se é WhatsApp ativo. */
    whatsapp: "5534996466468",
    whatsappConfirmed: false,
    phoneMobile: { display: "(34) 99646-6468", tel: "+5534996466468" },
    /** A CONFIRMAR: se o fixo deve aparecer. */
    phoneLandline: { display: "(34) 3212-6468", tel: "+553432126468", show: true },
    instagram: { handle: "@biomaevidence", url: "https://www.instagram.com/biomaevidence/" },
    /** A CONFIRMAR: conteúdo do hub de links. */
    links: { label: "Mais links", url: "https://sandwiche.me/oficialevidence" },
  },

  address: {
    street: "Rua Pedro Formoso, 375",
    district: "Vigilato Pereira",
    city: "Uberlândia",
    state: "MG",
    postalCode: "38408-628",
    country: "BR",
    /** A CONFIRMAR: coordenadas exatas (deixe null para omitir do schema). */
    geo: null as null | { lat: number; lng: number },
  },

  /** Horário (Google). day: 0=Dom … 6=Sáb */
  hours: [
    { label: "Terça", short: "Ter", day: 2, open: "09:00", close: "19:00" },
    { label: "Quarta", short: "Qua", day: 3, open: "09:00", close: "19:00" },
    { label: "Quinta", short: "Qui", day: 4, open: "09:00", close: "19:00" },
    { label: "Sexta", short: "Sex", day: 5, open: "09:00", close: "20:00" },
    { label: "Sábado", short: "Sáb", day: 6, open: "09:00", close: "20:00" },
    { label: "Domingo", short: "Dom", day: 0, open: null, close: null },
    { label: "Segunda", short: "Seg", day: 1, open: null, close: null },
  ] as { label: string; short: string; day: number; open: string | null; close: string | null }[],

  /** Preços não são públicos. */
  pricing: "Valores sob consulta",

  /** Números REAIS (Instagram). Não acrescente métricas não verificadas. */
  metrics: [
    { value: 12.5, display: "12,5 mil", prefix: "~", suffix: " mil", decimals: 1, label: "pessoas acompanham no Instagram" },
    { value: 4223, display: "4.223", prefix: "", suffix: "", decimals: 0, label: "publicações sobre rotina e cuidado" },
    { value: null, display: "Ter–Sáb", prefix: "", suffix: "", decimals: 0, label: "de portas abertas, das 9h às 19h/20h" },
  ] as { value: number | null; display: string; prefix: string; suffix: string; decimals: number; label: string }[],

  values: [
    { title: "Sustentabilidade", text: "Escolhas conscientes no espaço e na rotina de cuidado." },
    { title: "Saúde capilar", text: "Olhar atento para o fio e o couro cabeludo antes de qualquer técnica." },
    { title: "Bem-estar", text: "Um tempo calmo, sem pressa, dedicado só a você." },
    { title: "Visagismo", text: "O corte e a cor pensados para o seu rosto e a sua identidade." },
  ],
};

/** Mensagens de WhatsApp por contexto. */
export const whatsappMessages = {
  geral: "Oi! Quero reservar meu momento na Bioma Evidence.",
  cabelo: "Oi! Quero agendar um horário para cabelo na Bioma Evidence.",
  cortes: "Oi! Quero agendar corte/cachos.",
  cores: "Oi! Quero saber sobre mechas e cores.",
  pele: "Oi! Quero saber sobre laserterapia.",
  corpo: "Oi! Quero saber sobre massagens.",
  maos: "Oi! Quero saber sobre manicure.",
  espaco: "Oi! Quero conhecer o espaço da Bioma Evidence.",
} as const;
export type WhatsappKey = keyof typeof whatsappMessages;

export type Habitat = {
  id: string;
  numeral: string;
  title: string;
  kicker: string;
  text: string;
  /** Itens vindos dos destaques do Instagram. */
  items: string[];
  wa: WhatsappKey;
  cta: string;
  tone: "offwhite" | "areia" | "musgo";
  art: "leaf" | "seed" | "sunflower" | "fern" | "stem";
  image: ImageSlot;
  /** A CONFIRMAR: escopo e descrição exata do serviço. */
  confirmed: boolean;
};

export const habitats: Habitat[] = [
  {
    id: "cabelo",
    numeral: "I",
    title: "Cabelo e saúde capilar",
    kicker: "Cortes · Curtinhos · Cachos · Mechas e cores · Nutrição",
    text: "Do corte curto aos cachos definidos, cada escolha começa por entender o seu fio e o seu rosto.",
    items: ["Cortes", "Curtinhos", "Cachos", "Mechas e cores", "Nutrição"],
    wa: "cabelo",
    cta: "Reservar cabelo",
    tone: "offwhite",
    art: "leaf",
    image: { src: "/images/habitats/cabelo.jpg", alt: "Cliente com cabelo natural cacheado em meio às plantas do espaço Bioma Evidence", width: 1200, height: 1500, available: false },
    confirmed: true,
  },
  {
    id: "pele",
    numeral: "II",
    title: "Pele e laserterapia",
    kicker: "Laserterapia · avaliação individual",
    text: "Um atendimento que começa por uma conversa e uma avaliação. Pergunte como funciona e se faz sentido para você.",
    items: ["Laserterapia"],
    wa: "pele",
    cta: "Saber sobre laserterapia",
    tone: "areia",
    art: "seed",
    image: { src: "/images/habitats/pele.jpg", alt: "Detalhe do atendimento de laserterapia na Bioma Evidence", width: 1200, height: 1500, available: false },
    confirmed: false,
  },
  {
    id: "corpo",
    numeral: "III",
    title: "Corpo e massagens",
    kicker: "Massagens · pausa · respiro",
    text: "Uma pausa no meio da semana. Toque, silêncio e tempo para desacelerar.",
    items: ["Massagens"],
    wa: "corpo",
    cta: "Saber sobre massagens",
    tone: "musgo",
    art: "fern",
    image: { src: "/images/habitats/corpo.jpg", alt: "Sala de massagem com luz natural e plantas na Bioma Evidence", width: 1200, height: 1500, available: false },
    confirmed: false,
  },
  {
    id: "maos",
    numeral: "IV",
    title: "Mãos e manicure",
    kicker: "Manicure · cuidado em detalhe",
    text: "O cuidado também mora nos detalhes. Unhas feitas com calma, no mesmo ritmo do resto do espaço.",
    items: ["Manicure"],
    wa: "maos",
    cta: "Saber sobre manicure",
    tone: "areia",
    art: "stem",
    image: { src: "/images/habitats/maos.jpg", alt: "Mãos durante atendimento de manicure na Bioma Evidence", width: 1200, height: 1500, available: false },
    confirmed: false,
  },
  {
    id: "espaco",
    numeral: "V",
    title: "Espaço e Comunidade",
    kicker: "Espaço · Comunidade · encontros",
    text: "Plantas, luz natural e gente que se reconhece. Um lugar para voltar, não só para passar.",
    items: ["Espaço", "Comunidade"],
    wa: "espaco",
    cta: "Conhecer o espaço",
    tone: "offwhite",
    art: "sunflower",
    image: { src: "/images/habitats/espaco.jpg", alt: "Interior do espaço Bioma Evidence com folhagens e girassóis", width: 1200, height: 1500, available: false },
    confirmed: true,
  },
];

/** Imagens principais. Troque `available` para true quando o arquivo existir. */
export const images = {
  hero: { src: "/images/hero/hero.jpg", alt: "Cliente com cabelo natural entre folhagens, sob luz natural, no espaço Bioma Evidence", width: 2400, height: 1600, available: false } as ImageSlot,
  /** PNG recortado (pessoa/planta sem fundo) para o modo de camadas no hero. */
  heroCutout: { src: "/images/hero/hero-cutout.png", alt: "", width: 2400, height: 1600, available: false } as ImageSlot,
  /** Vídeo opcional de fundo do hero (até ~2,5MB). */
  heroVideo: { webm: "/images/hero/hero.webm", mp4: "/images/hero/hero.mp4", available: false },
  hairHealth: { src: "/images/editorial/saude-capilar.jpg", alt: "Profissional avaliando o fio e o couro cabeludo de uma cliente", width: 1200, height: 1500, available: false } as ImageSlot,
  space: { src: "/images/editorial/espaco.jpg", alt: "Vista do espaço Bioma Evidence com plantas e luz natural", width: 1600, height: 2000, available: false } as ImageSlot,
  community: [
    { src: "/images/editorial/comunidade-1.jpg", alt: "Encontro da comunidade Bioma Evidence", width: 1200, height: 1500, available: false },
    { src: "/images/editorial/comunidade-2.jpg", alt: "Girassóis no espaço Bioma Evidence", width: 1200, height: 1200, available: false },
    { src: "/images/editorial/comunidade-3.jpg", alt: "Detalhe de plantas e produtos no espaço", width: 1200, height: 1500, available: false },
  ] as ImageSlot[],
};

/** Hero: "cutout" (texto entre fundo e recorte) ou "leaves" (folhas SVG + blend). */
export const heroMode: "cutout" | "leaves" = images.heroCutout.available ? "cutout" : "leaves";

/** A CONFIRMAR: equipe (nomes, títulos, fotos, autorização). Vazio = bloco não renderiza. */
export const team: { name: string; role: string; image: ImageSlot }[] = [];

/**
 * Antes e depois — SOMENTE fotos reais autorizadas.
 * Vazio = comparador não renderiza em produção.
 */
export const beforeAfter: { id: string; label: string; before: ImageSlot; after: ImageSlot }[] = [];

/**
 * Depoimentos — SOMENTE reais (destaque "Feedback") e com autorização.
 * Vazio = seção não renderiza em produção.
 */
export const testimonials: { quote: string; author: string; context?: string; authorized: true }[] = [];

/** Pendências do cliente (espelhadas no README). */
export const pending = [
  "Autorização de uso das fotos do Instagram (clientes, espaço, equipe, antes e depois, plantas).",
  "Nome oficial no site (Bioma Evidence x Evidence Cabelo e Pele), logotipo em SVG/PNG e cores exatas.",
  "Confirmar WhatsApp (34) 99646-6468 e se o fixo (34) 3212-6468 deve aparecer.",
  "Lista exata de serviços e o que cada um inclui (sem alegações de saúde), especialmente Laserterapia e Nutrição Detox.",
  "Equipe: nomes, formações, fotos e autorização (inclui a profissional da capa de revista).",
  "Significado de \"Licenciado @lacesandhair\", o que é a \"Linha Nutricare\" e marcas que podem ser citadas.",
  "Depoimentos reais (prints do destaque Feedback) com autorização; nota e avaliações do Google.",
  "Preços (se quiser divulgar) e conteúdo de sandwiche.me/oficialevidence.",
  "Domínio final (NEXT_PUBLIC_SITE_URL) e coordenadas do endereço.",
];
