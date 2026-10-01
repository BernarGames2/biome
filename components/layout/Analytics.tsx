"use client";

import { useEffect, useState } from "react";

const GA = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const KEY = "bioma-consent";

function inject() {
  if (GA && !window.gtag) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) { window.dataLayer!.push(args); };
    window.gtag("js", new Date());
    window.gtag("config", GA, { anonymize_ip: true });
  }
  if (PIXEL && !window.fbq) {
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement; t.async = true; t.src = v;
      b.head.appendChild(t);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq!("init", PIXEL);
    window.fbq!("track", "PageView");
  }
}

/** Analytics desligado por padrão. Só existe banner (LGPD) se houver GA/Pixel configurado. */
export function Analytics() {
  const [ask, setAsk] = useState(false);
  useEffect(() => {
    if (!GA && !PIXEL) return;
    let v: string | null = null;
    try { v = localStorage.getItem(KEY); } catch {}
    if (v === "granted") inject();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- consentimento lido só no cliente
    else if (v !== "denied") setAsk(true);
  }, []);
  if (!ask) return null;
  const decide = (ok: boolean) => {
    try { localStorage.setItem(KEY, ok ? "granted" : "denied"); } catch {}
    if (ok) inject();
    setAsk(false);
  };
  return (
    <div role="dialog" aria-label="Preferências de cookies" className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-xl rounded-[var(--radius)] bg-carvao p-5 text-sm text-offwhite shadow-[var(--shadow-soft)] md:left-6 md:right-auto">
      <p>Usamos cookies de medição para entender como o site é usado. Nenhum dado pessoal é coletado nos formulários. Você aceita?</p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => decide(true)} className="btn btn--sun-dark !min-h-[44px] !py-2">Aceitar</button>
        <button type="button" onClick={() => decide(false)} className="btn btn--outline-light !min-h-[44px] !py-2">Recusar</button>
      </div>
    </div>
  );
}
