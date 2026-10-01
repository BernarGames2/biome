"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import { useMotionKit, type MotionKit } from "@/components/ui/SmoothScroll";

/**
 * Executa animações GSAP escopadas em `scope` assim que o kit estiver carregado.
 * Tudo criado dentro do callback é revertido no unmount (gsap.context).
 * O callback pode retornar uma função extra de cleanup (RAFs, listeners).
 */
// Fila de inicialização: cada seção monta suas animações em uma tarefa separada
// (evita uma única long task no init e mantém a ordem do documento).
const queue: (() => void)[] = [];
let flushing = false;
function schedule(job: () => void) {
  queue.push(job);
  if (flushing) return;
  flushing = true;
  const next = () => {
    const j = queue.shift();
    if (!j) { flushing = false; return; }
    j();
    setTimeout(next, 0);
  };
  setTimeout(next, 0);
}

export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (kit: MotionKit, el: HTMLElement) => void | (() => void),
  deps: DependencyList = [],
) {
  const kit = useMotionKit();
  useEffect(() => {
    if (!kit || !scope.current) return;
    const el = scope.current;
    let extra: void | (() => void);
    let ctx: ReturnType<typeof kit.gsap.context> | null = null;
    let alive = true;
    schedule(() => {
      if (!alive) return;
      ctx = kit.gsap.context(() => {
        extra = setup(kit, el);
      }, el);
    });
    return () => {
      alive = false;
      extra?.();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kit, ...deps]);
}

/** Pausa um callback de RAF quando o elemento sai da tela. */
export function observeVisibility(el: Element, cb: (visible: boolean) => void) {
  const io = new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin: "120px" });
  io.observe(el);
  return () => io.disconnect();
}
