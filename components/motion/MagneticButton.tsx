"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  /** Fracción de la distancia al centro que sigue al cursor (0–1). */
  strength?: number;
  className?: string;
};

const SPRING = { stiffness: 180, damping: 16, mass: 0.35 };

/**
 * Atracción magnética sutil hacia el cursor. Solo con mouse: en touch y con
 * prefers-reduced-motion queda estático. La zona de detección no se mueve,
 * así el cálculo no se retroalimenta.
 */
export function MagneticButton({ children, strength = 0.28, className }: MagneticButtonProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse" || !zoneRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={zoneRef}
      className={cn("inline-flex", className)}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      <motion.div className="inline-flex" style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}
