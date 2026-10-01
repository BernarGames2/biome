import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree, Allura } from "next/font/google";
import { site } from "@/data/site";
import { localBusinessSchema } from "@/lib/schema";
import "@/styles/globals.css";

const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT"], style: "normal", variable: "--font-fraunces", display: "swap" });
// itálico separado e sem preload: só aparece em frases de destaque, não bloqueia o LCP
const frauncesItalic = Fraunces({ subsets: ["latin"], axes: ["opsz"], style: "italic", variable: "--font-fraunces-italic", display: "swap", preload: false });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const script = Allura({ subsets: ["latin"], weight: "400", variable: "--font-script-face", display: "swap", preload: false });

const title = "Bioma Evidence · Beleza natural e saúde capilar em Uberlândia";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s · Bioma Evidence" },
  description: site.description,
  applicationName: site.name,
  keywords: ["salão de beleza em Uberlândia", "saúde capilar", "cachos", "corte curto", "mechas e cores", "visagismo", "beleza natural", "Bioma Evidence"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#2f4a3a",
  width: "device-width",
  initialScale: 1,
};

// Executa antes do primeiro paint: marca JS ativo e decide o preloader (1ª visita da sessão, sem reduced-motion).
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r&&!sessionStorage.getItem('bioma-preloaded')){d.classList.add('show-preloader');d.style.setProperty('--intro-delay','.35s');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${frauncesItalic.variable} ${figtree.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
