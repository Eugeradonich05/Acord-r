import type { CSSProperties } from "react";

/** Curva editorial compartida por Framer Motion y GSAP. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Misma curva en formato CSS. */
export const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Duraciones base en segundos. */
export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
} as const;

/** Retardo para las animaciones CSS `.animate-enter` / `.animate-word`. */
export function enterDelay(seconds: number): CSSProperties {
  return { "--delay": `${seconds}s` } as CSSProperties;
}
