"use client";

import { useRef, type ComponentProps } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { gsap } from "@/lib/gsap";

/**
 * Motion de la sección Contacto:
 * - `[data-contact-media]`: la mitad con foto se descubre hacia la derecha,
 *   hacia el formulario (clip-path scrubbeado).
 * - `[data-contact-image]`: parallax leve del fondo.
 * El stagger de los campos vive en el formulario (se carga en diferido).
 * Con prefers-reduced-motion no hay scrub ni parallax.
 */
export function ContactScene(props: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, (section, { mobile, reduce }) => {
    if (reduce) return;

    const media = section.querySelector("[data-contact-media]");
    gsap.fromTo(
      media,
      { clipPath: "inset(0% 100% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: media, start: "top 85%", end: "top 35%", scrub: 0.6 },
      },
    );

    const travel = mobile ? 3 : 6;
    gsap.fromTo(
      "[data-contact-image]",
      { yPercent: -travel },
      {
        yPercent: travel,
        ease: "none",
        scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  return <section ref={ref} {...props} />;
}
