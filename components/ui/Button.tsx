"use client";

import { useRef, type ReactNode, type MouseEvent, type PointerEvent } from "react";
import { track } from "@/lib/analytics";
import { ArrowRight } from "./Icons";

type Variant = "musgo" | "sun" | "sun-dark" | "outline-light" | "outline-dark";

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  icon?: ReactNode | false;
  /** Seção para analytics (WhatsApp/telefone/rotas detectados pelo href). */
  section?: string;
  magnetic?: boolean;
  ripple?: boolean;
  className?: string;
  ariaLabel?: string;
  cursor?: string;
};

export function Button({ href, children, variant = "musgo", size = "md", icon, section = "geral", magnetic = false, ripple = false, className = "", ariaLabel, cursor }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const external = /^https?:/.test(href);
  const cls = `btn ${variant === "musgo" ? "" : `btn--${variant}`} ${size === "lg" ? "btn--lg" : ""} ${className}`;

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (href.includes("wa.me")) track("whatsapp_click", section);
    else if (href.startsWith("tel:")) track("phone_click", section);
    else if (href.includes("google.com/maps")) track("directions_click", section);
    if (ripple && ref.current) {
      const r = ref.current.getBoundingClientRect();
      const s = document.createElement("span");
      const d = Math.max(r.width, r.height) * 2.2;
      Object.assign(s.style, {
        position: "absolute", left: `${e.clientX - r.left}px`, top: `${e.clientY - r.top}px`, width: `${d}px`, height: `${d}px`,
        borderRadius: "50%", background: "currentColor", pointerEvents: "none", animation: "ripple .7s cubic-bezier(.16,1,.3,1) forwards",
      });
      ref.current.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
  }

  function onMove(e: PointerEvent<HTMLAnchorElement>) {
    if (!magnetic || e.pointerType !== "mouse" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
    ref.current.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <a
      ref={ref}
      href={href}
      className={cls}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={ariaLabel}
      data-cursor={cursor}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      {icon === false ? null : icon ?? <ArrowRight size={18} className="btn-arrow" />}
    </a>
  );
}
