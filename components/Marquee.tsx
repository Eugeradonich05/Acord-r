"use client";

import { Fragment, useRef } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    words: ["Cobranzas", "Recupero de créditos", "Asesoramiento jurídico", "Gestión contable"],
    className: "text-ink",
    from: 0,
    to: -28,
  },
  {
    words: ["Confidencialidad", "Ética profesional", "Resultados medibles", "Trato respetuoso"],
    className: "italic text-petrol",
    from: -28,
    to: 0,
  },
] as const;

/**
 * Banda tipográfica entre secciones: dos renglones que se desplazan en
 * direcciones opuestas al ritmo del scroll (no se mueven solos). Decorativa:
 * repite contenido que ya está en la página.
 */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollMotion(ref, (element, { mobile, reduce }) => {
    if (reduce) return;

    const factor = mobile ? 0.6 : 1;
    gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row, index) => {
      const { from, to } = ROWS[index] ?? ROWS[0];
      gsap.fromTo(
        row,
        { xPercent: from * factor },
        {
          xPercent: to * factor,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="select-none overflow-hidden border-y border-line bg-paper-deep py-10 lg:py-16"
    >
      {ROWS.map((row, index) => (
        <div
          key={index}
          data-row
          className={cn(
            "flex w-max whitespace-nowrap font-serif text-[clamp(2.75rem,8vw,7.5rem)] leading-[1.1] tracking-[-0.02em] will-change-transform",
            row.className,
          )}
        >
          {/* Tres copias: siempre hay texto cubriendo el ancho mientras se desplaza */}
          {[0, 1, 2].map((copy) => (
            <Fragment key={copy}>
              {row.words.map((word) => (
                <span key={word} className="flex items-center">
                  {word}
                  <span className="mx-[0.45em] inline-block size-[0.14em] rounded-full bg-gold" />
                </span>
              ))}
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
