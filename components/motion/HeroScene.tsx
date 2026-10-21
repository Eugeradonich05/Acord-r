"use client";

import { useRef, type ComponentProps } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { gsap } from "@/lib/gsap";

/**
 * Escena del hero, tipo "entrar en la foto". Al hacer scroll:
 * - `[data-hero-zoom]`: la imagen escala 1 → 1,15 y baja levemente.
 * - `[data-hero-overlay]`: el velo petróleo pasa de 40 % a 70 %.
 * - `[data-hero-content]`: el texto se va con fundido y desplazamiento.
 * - `[data-hero-rings]`: los aros con parallax propio, más lento, y giro sutil.
 *
 * Desktop: la sección queda fija (pin) mientras dura la escena. Mobile: sin
 * pin, la escena acompaña el scroll con menos intensidad. Sin movimiento: nada.
 */
export function HeroScene(props: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, (section, { desktop, reduce }) => {
    if (reduce) return;

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: desktop
        ? { trigger: section, start: "top top", end: "+=75%", pin: true, scrub: 0.8, refreshPriority: 1 }
        : { trigger: section, start: "top top", end: "bottom top", scrub: 0.5 },
    });

    timeline
      .fromTo("[data-hero-zoom]", { scale: 1, yPercent: 0 }, { scale: desktop ? 1.15 : 1.08, yPercent: desktop ? 4 : 6 }, 0)
      .fromTo("[data-hero-overlay]", { opacity: 0.4 }, { opacity: 0.7 }, 0)
      .fromTo("[data-hero-rings]", { yPercent: 0, rotate: 0 }, { yPercent: desktop ? -12 : -6, rotate: 10 }, 0)
      .to("[data-hero-content]", { y: desktop ? -90 : -40, opacity: 0, duration: 0.75 }, 0);
  });

  return <section ref={ref} {...props} />;
}
