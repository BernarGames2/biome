"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { waLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { BLeaf, Wordmark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Phone, WhatsApp, Instagram } from "@/components/ui/Icons";

const nav = [
  { href: "#habitats", label: "Habitats" },
  { href: "#a-bioma", label: "A Bioma" },
  { href: "#experiencias", label: "Experiências" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(scrollY > 40);
      // tom da seção sob o header
      const els = document.querySelectorAll<HTMLElement>("[data-tone]");
      let dark = false;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 40 && r.bottom > 40) dark = el.dataset.tone === "dark";
      });
      setOnDark(dark);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  // menu mobile: Esc fecha, foco preso, rolagem travada
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const btn = menuBtn.current;
    document.documentElement.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>("a,button"));
        const [a, b] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      removeEventListener("keydown", onKey);
      (prev ?? btn)?.focus();
    };
  }, [open]);

  const light = onDark || open;
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,transform] duration-500 ${
          scrolled && !open ? (light ? "bg-carvao/35 backdrop-blur-md" : "bg-offwhite/85 shadow-[0_1px_0_var(--line)] backdrop-blur-md") : ""
        } ${light ? "text-offwhite" : "text-carvao"}`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center gap-6">
          <a href="#topo" className="hero-drop group flex items-center gap-3" style={{ ["--d" as string]: "0.35s" }}>
            <BLeaf size={22} className="transition-transform duration-500 group-hover:-rotate-6" />
            <span className="flex flex-col leading-none">
              <Wordmark className="text-[0.95rem]" />
              <span className="micro mt-1.5 hidden whitespace-nowrap text-[0.58rem] opacity-75 sm:block">Beleza natural · Uberlândia</span>
              <span className="sr-only">, voltar ao início</span>
            </span>
          </a>

          <nav aria-label="Principal" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-6 whitespace-nowrap xl:gap-8">
              {nav.map((n, i) => (
                <li key={n.href} className="hero-drop" style={{ ["--d" as string]: `${0.45 + i * 0.08}s` }}>
                  <a href={n.href} className="micro link-u">{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={`tel:${site.contact.phoneMobile.tel}`}
            onClick={() => track("phone_click", "header")}
            className="hero-drop link-u ml-auto hidden items-center gap-2 whitespace-nowrap text-sm font-medium md:inline-flex lg:hidden xl:ml-4 xl:inline-flex"
            style={{ ["--d" as string]: "0.8s" }}
          >
            <Phone size={16} /> {site.contact.phoneMobile.display}
          </a>

          <div className="hero-drop ml-auto hidden sm:block md:ml-0 lg:ml-4 xl:ml-0" style={{ ["--d" as string]: "0.88s" }}>
            <Button href={waLink("geral")} variant={light ? "sun" : "musgo"} section="header" icon={<WhatsApp size={17} />} className="!min-h-[44px] whitespace-nowrap !py-2.5 !text-[0.85rem]">
              {site.invite}
            </Button>
          </div>

          <button
            ref={menuBtn}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="micro ml-auto flex h-12 w-[4.5rem] items-center justify-center bg-girassol text-carvao sm:ml-0 lg:hidden"
          >
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
      </header>

      <div
        id="menu-mobile"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col bg-musgo px-[var(--gutter)] pb-10 pt-[calc(var(--header-h)+2rem)] text-offwhite lg:hidden"
      >
        <nav aria-label="Menu móvel">
          <ul className="space-y-2">
            {nav.map((n, i) => (
              <li key={n.href} className="border-b border-[var(--line-light)]">
                <a href={n.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-3">
                  <span className="micro text-girassol tabular-nums">0{i + 1}</span>
                  <span className="font-display text-[2.6rem] font-[350] leading-tight" style={{ fontVariationSettings: '"SOFT" 100' }}>{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto space-y-5">
          <Button href={waLink("geral")} variant="sun-dark" size="lg" section="menu" icon={<WhatsApp size={18} />} className="w-full justify-center">
            {site.invite}
          </Button>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a href={`tel:${site.contact.phoneMobile.tel}`} onClick={() => track("phone_click", "menu")} className="link-u"><Phone size={16} /> {site.contact.phoneMobile.display}</a>
            <a href={site.contact.instagram.url} target="_blank" rel="noopener noreferrer" className="link-u"><Instagram size={16} /> {site.contact.instagram.handle}</a>
          </div>
        </div>
      </div>
    </>
  );
}
