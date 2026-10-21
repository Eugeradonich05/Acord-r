"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Punto único de registro de plugins: importar gsap siempre desde acá.
// `registerPlugin` es idempotente, así que el HMR no duplica nada.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // En mobile la barra de direcciones cambia el alto del viewport al hacer
  // scroll: sin esto, cada cambio recalcula todos los triggers (salto visible).
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

/**
 * Condiciones compartidas por todas las animaciones de scroll (ver
 * `useScrollMotion`). `desktop` y `mobile` son complementarias, así que el
 * setup siempre corre y se vuelve a ejecutar si cambia alguna de ellas.
 */
export const MEDIA = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023.98px)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export type MediaConditions = Record<keyof typeof MEDIA, boolean>;

export { gsap, ScrollTrigger };
