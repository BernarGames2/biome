import type { ReactNode } from "react";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`badge micro ${className}`}>{children}</span>;
}
