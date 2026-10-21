"use client";

import { useRef } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { gsap } from "@/lib/gsap";

/**
 * Marca de agua del pie: capa de fondo a todo el ancho, por detrás del
 * contenido. Sube desde abajo mientras el footer entra en pantalla. SVG con
 * textLength para que ocupe exactamente el ancho disponible.
 */
export function FooterWatermark() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollMotion(ref, (element, { reduce }) => {
    if (reduce) return;

    gsap.fromTo(
      "svg",
      { yPercent: 55, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: element.parentElement ?? element,
          start: "top 85%",
          end: "bottom bottom",
          scrub: true,
        },
      },
    );
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-[0.5vw] left-1/2 -z-10 w-[104%] -translate-x-1/2 select-none"
    >
      <svg focusable="false" viewBox="0 0 1000 200" className="block w-full fill-paper/[0.07]">
        <text
          x="0"
          y="172"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="228"
        >
          ACORD<tspan fontStyle="italic">@</tspan>R
        </text>
      </svg>
    </div>
  );
}
