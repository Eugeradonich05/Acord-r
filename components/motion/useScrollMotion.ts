"use client";

import { useEffect, useRef, type DependencyList, type RefObject } from "react";

import { gsap, MEDIA, type MediaConditions } from "@/lib/gsap";

type Setup<T extends Element> = (
  element: T,
  media: MediaConditions,
) => void | (() => void);

/**
 * Hook único para animaciones GSAP/ScrollTrigger dentro de un componente.
 *
 * - Crea un `gsap.matchMedia` con alcance (scope) en `ref`: los selectores
 *   del setup sólo buscan dentro del componente.
 * - Recibe las condiciones `desktop` / `mobile` / `reduce` y se vuelve a
 *   ejecutar si cambian (rotar el teléfono, activar "reducir movimiento").
 * - En el cleanup revierte todo: tweens, ScrollTriggers, pins y estilos
 *   inline. Sin duplicados al navegar ni con HMR.
 */
export function useScrollMotion<T extends Element>(
  ref: RefObject<T | null>,
  setup: Setup<T>,
  deps: DependencyList = [],
) {
  // La última versión del setup, sin forzar a que sea estable entre renders.
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mm = gsap.matchMedia(element);
    mm.add(MEDIA, (context) =>
      setupRef.current(element, context.conditions as MediaConditions),
    );

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);
}
