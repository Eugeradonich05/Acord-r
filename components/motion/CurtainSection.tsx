"use client";

import { useRef, type ComponentProps } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { gsap } from "@/lib/gsap";

/**
 * Sección que entra como un "telón": llega recortada, con márgenes laterales y
 * esquinas redondeadas, y se abre a todo el ancho a medida que sube (scrub).
 */
export function CurtainSection(props: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, (element, { mobile, reduce }) => {
    if (reduce) return;

    const side = mobile ? 3 : 5;
    const radius = mobile ? 20 : 40;
    gsap.fromTo(
      element,
      { clipPath: `inset(0% ${side}% 0% ${side}% round ${radius}px)` },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        scrollTrigger: { trigger: element, start: "top bottom", end: "top 25%", scrub: true },
      },
    );
  });

  return <section ref={ref} {...props} />;
}
