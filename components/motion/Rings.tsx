"use client";

import { motion } from "framer-motion";
import { useId, useRef, type CSSProperties } from "react";

import { useParallax, type ParallaxOptions } from "@/components/motion/useParallax";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Geometría (viewBox 600 × 400): dos aros de r=170 que se cruzan en x=300.
const LEFT = { cx: 220, cy: 200 };
const RIGHT = { cx: 380, cy: 200 };
const R = 170;
const ECHO_R = 192;

type RingsProps = {
  /** `light`: sobre fondos claros. `dark`: sobre petróleo o carbón. */
  tone?: "light" | "dark";
  /** Grosor del trazo en unidades del viewBox. */
  strokeWidth?: number;
  /** Dibuja los aros al entrar en viewport. */
  draw?: boolean;
  /** Aros de eco punteados con rotación lenta + punto en órbita. */
  orbit?: boolean;
  /** Parallax con ScrollTrigger; `false` para desactivarlo. */
  parallax?: ParallaxOptions | false;
  className?: string;
};

/**
 * Motivo gráfico de la marca: los dos aros entrelazados en línea fina.
 * Es decorativo (aria-hidden). Con prefers-reduced-motion queda estático.
 */
export function Rings({
  tone = "light",
  strokeWidth = 1.25,
  draw = true,
  orbit = true,
  parallax = { speed: 0.18 },
  className,
}: RingsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  useParallax(ref, parallax === false ? { speed: 0, rotate: 0 } : parallax);

  const colors =
    tone === "light"
      ? { left: "rgb(var(--petrol))", right: "rgb(var(--gold))", echo: "rgb(var(--ink) / 0.22)" }
      : { left: "rgb(var(--paper) / 0.85)", right: "rgb(var(--gold))", echo: "rgb(var(--paper) / 0.25)" };

  const cut = strokeWidth * 7;
  const drawProps = (delay: number) =>
    draw
      ? {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: "0px 0px -10% 0px" },
          transition: {
            pathLength: { duration: 2.4, ease: EASE, delay },
            opacity: { duration: 0.4, delay },
          },
        }
      : {};

  const spin = (origin: { cx: number; cy: number }, seconds: number, reverse = false): CSSProperties => ({
    transformBox: "view-box",
    transformOrigin: `${origin.cx}px ${origin.cy}px`,
    animation: `rings-spin ${seconds}s linear infinite${reverse ? " reverse" : ""}`,
  });

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none select-none", className)}>
      <svg viewBox="0 0 600 400" fill="none" className="h-auto w-full overflow-visible">
        <defs>
          <clipPath id={`${uid}-top`}>
            <rect width="600" height="200" />
          </clipPath>
          <clipPath id={`${uid}-bottom`}>
            <rect y="200" width="600" height="200" />
          </clipPath>
          <mask id={`${uid}-left`} maskUnits="userSpaceOnUse" x="-50" y="-50" width="700" height="500">
            <rect x="-50" y="-50" width="700" height="500" fill="white" />
            <circle {...RIGHT} r={R} stroke="black" strokeWidth={cut} clipPath={`url(#${uid}-top)`} />
          </mask>
          <mask id={`${uid}-right`} maskUnits="userSpaceOnUse" x="-50" y="-50" width="700" height="500">
            <rect x="-50" y="-50" width="700" height="500" fill="white" />
            <circle {...LEFT} r={R} stroke="black" strokeWidth={cut} clipPath={`url(#${uid}-bottom)`} />
          </mask>
        </defs>

        {orbit && (
          <>
            <g style={spin(LEFT, 140)}>
              <circle
                {...LEFT}
                r={ECHO_R}
                stroke={colors.echo}
                strokeWidth={strokeWidth * 0.8}
                strokeDasharray="1.5 9"
                strokeLinecap="round"
              />
            </g>
            <g style={spin(RIGHT, 160, true)}>
              <circle
                {...RIGHT}
                r={ECHO_R}
                stroke={colors.echo}
                strokeWidth={strokeWidth * 0.8}
                strokeDasharray="1.5 9"
                strokeLinecap="round"
              />
            </g>
          </>
        )}

        <g mask={`url(#${uid}-left)`}>
          <motion.circle
            {...LEFT}
            r={R}
            stroke={colors.left}
            strokeWidth={strokeWidth}
            transform={`rotate(-90 ${LEFT.cx} ${LEFT.cy})`}
            {...drawProps(0.2)}
          />
        </g>
        <g mask={`url(#${uid}-right)`}>
          <motion.circle
            {...RIGHT}
            r={R}
            stroke={colors.right}
            strokeWidth={strokeWidth}
            transform={`rotate(90 ${RIGHT.cx} ${RIGHT.cy})`}
            {...drawProps(0.45)}
          />
        </g>

        {orbit && (
          <g style={spin(RIGHT, 48)}>
            <circle cx={RIGHT.cx} cy={RIGHT.cy - R} r={strokeWidth * 2.6} fill={colors.right} />
          </g>
        )}
      </svg>
    </div>
  );
}
