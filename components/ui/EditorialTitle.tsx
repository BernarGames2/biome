import type { ReactNode, ElementType } from "react";

/**
 * Título editorial. Use <em> dentro do conteúdo para o trecho em itálico macio.
 * As linhas recebem [data-lines] para reveal por linha.
 */
export function EditorialTitle({ as: Tag = "h2", children, className = "", id }: { as?: ElementType; children: ReactNode; className?: string; id?: string }) {
  return (
    <Tag id={id} className={`h2 [&_em]:italic-soft [&_em]:font-[300] ${className}`} data-split-lines>
      {children}
    </Tag>
  );
}
