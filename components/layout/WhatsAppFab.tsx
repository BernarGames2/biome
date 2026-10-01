"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { WhatsApp } from "@/components/ui/Icons";

export function WhatsAppFab() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(scrollY > innerHeight * 0.6);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <a
      href={waLink("geral")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", "fab")}
      aria-label="Reserve seu momento pelo WhatsApp"
      className={`group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-3 rounded-full bg-girassol pl-4 pr-4 text-carvao shadow-[var(--shadow-soft)] transition-[transform,opacity,padding] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:bottom-8 md:right-16 md:hover:pr-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      tabIndex={show ? 0 : -1}
    >
      <WhatsApp size={24} />
      <span className="micro hidden max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-500 md:inline md:group-hover:max-w-[12rem]">Reserve seu momento</span>
    </a>
  );
}
