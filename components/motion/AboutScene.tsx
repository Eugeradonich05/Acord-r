"use client";

import { useRef, type ComponentProps } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const format = new Intl.NumberFormat("es-AR");

/**
 * Motion de la sección Nosotros (todo atado a data-attributes del markup):
 * - `[data-value]`: los valores entran en cascada (ScrollTrigger.batch).
 * - `[data-about-frame]`: la foto se descubre de arriba hacia abajo
 *   (clip-path scrubbeado) y `[data-about-image]` tiene parallax leve.
 * - `[data-count]`: contadores de 0 al valor, una sola vez.
 * Con prefers-reduced-motion: sólo un fundido corto de los valores; la foto y
 * las cifras se muestran directamente.
 */
export function AboutScene(props: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);
  const countedRef = useRef(false);

  useScrollMotion(ref, (section, { mobile, reduce }) => {
    const items = gsap.utils.toArray<HTMLElement>("[data-value]");
    gsap.set(items, reduce ? { opacity: 0 } : { opacity: 0, y: 40 });
    ScrollTrigger.batch(items, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, reduce
          ? { opacity: 1, duration: 0.4, stagger: 0.05 }
          : { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }),
    });

    if (reduce) return;

    const frame = section.querySelector("[data-about-frame]");
    gsap.fromTo(
      frame,
      { clipPath: "inset(0% 0% 100% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top 85%", end: mobile ? "top 30%" : "top 15%", scrub: 0.6 },
      },
    );

    // Parallax hacia arriba: el margen de la imagen está abajo (ver About).
    gsap.fromTo(
      "[data-about-image]",
      { yPercent: 0 },
      {
        yPercent: -2,
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
      },
    );

    // Contadores: arrancan en 0 (la franja está debajo del pliegue al cargar)
    // y cuentan una sola vez, aunque la escena se rearme al cambiar de breakpoint.
    if (countedRef.current) return;
    const counters = gsap.utils.toArray<HTMLElement>("[data-count]");
    counters.forEach((element) => (element.textContent = "0"));

    ScrollTrigger.create({
      trigger: section.querySelector("[data-metrics]"),
      start: "top 85%",
      once: true,
      onEnter: () => {
        countedRef.current = true;
        counters.forEach((element, index) => {
          const proxy = { value: 0 };
          gsap.to(proxy, {
            value: Number(element.dataset.count),
            duration: 2,
            delay: index * 0.12,
            ease: "power2.out",
            onUpdate: () => {
              element.textContent = format.format(Math.round(proxy.value));
            },
          });
        });
      },
    });

    // Si la escena se desarma (antes o durante la cuenta), las cifras quedan
    // en su valor final.
    return () =>
      counters.forEach((element) => (element.textContent = format.format(Number(element.dataset.count))));
  });

  return <section ref={ref} {...props} />;
}
