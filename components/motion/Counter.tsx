"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Duración en segundos. */
  duration?: number;
  className?: string;
};

/**
 * Número que cuenta desde 0 al entrar en viewport. El valor final está
 * siempre disponible para lectores de pantalla y buscadores.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2.2,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();

  const format = useMemo(
    () =>
      new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );

  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => format.format(latest));

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration, count]);

  return (
    <span className={cn("tabular-nums", className)}>
      <span className="sr-only">
        {prefix}
        {format.format(value)}
        {suffix}
      </span>
      <span ref={ref} aria-hidden="true">
        {prefix}
        <motion.span>{display}</motion.span>
        {suffix}
      </span>
    </span>
  );
}
