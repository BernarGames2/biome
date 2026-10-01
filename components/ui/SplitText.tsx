import { Fragment, type ElementType } from "react";

/**
 * Divide texto em palavras ou caracteres no servidor (sem flash).
 * Palavras: [data-word]; caracteres: .hero-char com --i para stagger em CSS.
 * Leitores de tela leem o texto original via aria-label.
 */
export function SplitText({ text, mode = "words", as: Tag = "span", className = "", startIndex = 0, charClass = "hero-char" }: { text: string; mode?: "words" | "chars"; as?: ElementType; className?: string; startIndex?: number; charClass?: string }) {
  const words = text.split(" ");
  let i = startIndex;
  return (
    <Tag className={className} aria-label={text} role="text">
      {words.map((w, wi) => (
        <Fragment key={wi}>
          {mode === "words" ? (
            <span data-word aria-hidden className="inline-block">{w}</span>
          ) : (
            <span aria-hidden className="hero-mask whitespace-nowrap">
              {[...w].map((ch, ci) => (
                <span key={ci} className={charClass} style={{ ["--i" as string]: i++ }}>{ch}</span>
              ))}
            </span>
          )}
          {wi < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
