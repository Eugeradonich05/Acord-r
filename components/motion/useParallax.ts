"use client";

import type { RefObject } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { gsap } from "@/lib/gsap";

export type ParallaxOptions = {
  /** Desplazamiento vertical total, como fracción del alto del viewport. */
  speed?: number;
  /** Rotación total en grados durante el recorrido. */
  rotate?: number;
  /** Elemento que define el recorrido; por defecto, el padre. */
  trigger?: RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
};

/** En pantallas chicas el parallax se reduce a la mitad. */
const MOBILE_FACTOR = 0.5;

/**
 * Parallax con GSAP ScrollTrigger (scrub): el elemento se desplaza más lento
 * o más rápido que el scroll. Se desactiva con prefers-reduced-motion.
 */
export function useParallax<T extends Element>(
  ref: RefObject<T | null>,
  { speed = 0.15, rotate = 0, trigger, start = "top bottom", end = "bottom top" }: ParallaxOptions = {},
) {
  useScrollMotion(
    ref,
    (element, { mobile, reduce }) => {
      if (reduce || (speed === 0 && rotate === 0)) return;

      const factor = mobile ? MOBILE_FACTOR : 1;
      const travel = () => (speed * factor * window.innerHeight) / 2;

      gsap.fromTo(
        element,
        { y: () => -travel(), rotate: (-rotate * factor) / 2 },
        {
          y: () => travel(),
          rotate: (rotate * factor) / 2,
          ease: "none",
          scrollTrigger: {
            trigger: trigger?.current ?? element.parentElement ?? element,
            start,
            end,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    [speed, rotate, trigger, start, end],
  );
}
