"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * Sistema de motion centralizado:
 * - `MotionConfig reducedMotion="user"`: con prefers-reduced-motion, Framer
 *   Motion anula transformaciones y deja solo los fundidos de opacidad.
 * - `SmoothScroll`: Lenis sincronizado con el ticker de GSAP/ScrollTrigger.
 * - `ScrollProgress`: barra de progreso global.
 * Las animaciones de scroll de cada componente usan `useScrollMotion`.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <ScrollProgress />
        {children}
      </SmoothScroll>
    </MotionConfig>
  );
}
