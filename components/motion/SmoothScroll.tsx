"use client";

import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/** Instancia activa de Lenis, o `null` si el usuario prefiere menos movimiento. */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Smooth scroll global. Lenis se sincroniza con el ticker de GSAP para que
 * ScrollTrigger y el scroll compartan el mismo frame. Con
 * prefers-reduced-motion no se inicializa y queda el scroll nativo.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      smoothWheel: true,
    });

    const unsubscribe = instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Sincronización con un sistema externo: el contexto expone la instancia.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      unsubscribe();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      setLenis(null);
    };
  }, [reduceMotion]);

  // Las fuentes web cambian alturas después del primer cálculo de
  // ScrollTrigger (que ya se recalcula solo en `load` y `resize`).
  useEffect(() => {
    let active = true;
    void document.fonts.ready.then(() => active && ScrollTrigger.refresh());
    return () => {
      active = false;
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/**
 * Navega a una sección por id: usa Lenis si está activo y, si no, el scroll
 * nativo. Actualiza el hash y mueve el foco al destino (accesibilidad).
 */
export function useScrollToSection() {
  const lenis = useLenis();

  return useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      const navHeight =
        document.querySelector<HTMLElement>("[data-navbar]")?.offsetHeight ?? 0;
      const top = id === "inicio" ? 0 : target;

      if (lenis) {
        lenis.start();
        lenis.scrollTo(top, { offset: -navHeight, duration: 1.4 });
      } else {
        const y =
          typeof top === "number"
            ? 0
            : top.getBoundingClientRect().top + window.scrollY - navHeight;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      }

      history.replaceState(null, "", `#${id}`);
      target.focus({ preventScroll: true });
    },
    [lenis],
  );
}
