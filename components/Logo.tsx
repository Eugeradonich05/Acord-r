import { useId } from "react";

import { cn } from "@/lib/utils";

type Tone = "dark" | "light";

type RingsMarkProps = {
  tone?: Tone;
  className?: string;
};

/**
 * Isotipo: dos aros entrelazados. El cruce "por encima / por debajo" se
 * resuelve con máscaras, así funciona sobre cualquier fondo.
 */
export function RingsMark({ tone = "dark", className }: RingsMarkProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const left = tone === "dark" ? "rgb(var(--petrol))" : "rgb(var(--paper))";
  const right = "rgb(var(--gold))";
  const stroke = 5;
  const cut = stroke + 5;

  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <clipPath id={`${uid}-top`}>
          <rect x="0" y="0" width="120" height="40" />
        </clipPath>
        <clipPath id={`${uid}-bottom`}>
          <rect x="0" y="40" width="120" height="40" />
        </clipPath>
        {/* El aro izquierdo pasa por debajo en el cruce superior */}
        <mask id={`${uid}-left`} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="80">
          <rect width="120" height="80" fill="white" />
          <circle
            cx="76"
            cy="40"
            r="26"
            stroke="black"
            strokeWidth={cut}
            clipPath={`url(#${uid}-top)`}
          />
        </mask>
        {/* El aro derecho pasa por debajo en el cruce inferior */}
        <mask id={`${uid}-right`} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="80">
          <rect width="120" height="80" fill="white" />
          <circle
            cx="44"
            cy="40"
            r="26"
            stroke="black"
            strokeWidth={cut}
            clipPath={`url(#${uid}-bottom)`}
          />
        </mask>
      </defs>
      <circle cx="44" cy="40" r="26" stroke={left} strokeWidth={stroke} mask={`url(#${uid}-left)`} />
      <circle cx="76" cy="40" r="26" stroke={right} strokeWidth={stroke} mask={`url(#${uid}-right)`} />
    </svg>
  );
}

type LogoProps = {
  tone?: Tone;
  className?: string;
};

/** Logo completo: isotipo + logotipo. */
export function Logo({ tone = "dark", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <RingsMark tone={tone} className="h-7 w-auto lg:h-8" />
      <span
        className={cn(
          "font-serif text-[1.3rem] leading-none tracking-[-0.01em] transition-colors duration-400",
          tone === "dark" ? "text-ink" : "text-paper",
        )}
      >
        ACORD<span className="italic text-gold">@</span>R{" "}
        <span
          className={cn(
            "ml-0.5 align-top font-sans text-[0.6rem] font-medium tracking-[0.2em]",
            tone === "dark" ? "text-stone" : "text-paper/70",
          )}
        >
          SRL
        </span>
      </span>
    </span>
  );
}
