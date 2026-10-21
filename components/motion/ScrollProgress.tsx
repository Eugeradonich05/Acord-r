"use client";

import { useEffect, useRef } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Filete dorado fijo en el borde superior que avanza con el scroll total de
 * la página. Sólo anima `transform: scaleX`. Es decorativo (aria-hidden) y
 * sigue funcionando con prefers-reduced-motion: acompaña el scroll del
 * usuario, no agrega movimiento propio.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    const setScale = gsap.quickSetter(bar, "scaleX");
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: ({ progress }) => setScale(progress),
      onRefresh: ({ progress }) => setScale(progress),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-gold will-change-transform"
    />
  );
}
