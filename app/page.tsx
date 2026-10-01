import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { Analytics } from "@/components/layout/Analytics";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { RevealManager } from "@/components/ui/Reveal";
import { Preloader } from "@/components/ui/Preloader";
import { Cursor } from "@/components/ui/Cursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Marquee } from "@/components/ui/Marquee";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Habitats } from "@/components/sections/Habitats";
import { HairHealth } from "@/components/sections/HairHealth";
import { About } from "@/components/sections/About";
import { Proof } from "@/components/sections/Proof";
import { Community } from "@/components/sections/Community";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Preloader />
      <Header />
      <main id="conteudo">
        <Hero />
        <div className="bg-offwhite text-musgo">
          <Marquee words={["Natural", "Saúde capilar", "Bem-estar", "Visagismo"]} />
        </div>
        <Manifesto />
        <Habitats />
        <HairHealth />
        <About />
        <Proof />
        <Community />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <ScrollProgress />
      <Cursor />
      <RevealManager />
      <Analytics />
    </SmoothScroll>
  );
}
