"use client";

import { Fragment, useMemo, useRef } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ManifestoProps = {
  /** Título (primera oración). Lo que va entre *asteriscos* se destaca. */
  title: string;
  titleId: string;
  body: string;
  className?: string;
};

type Token = { text: string; em: boolean };

function tokenize(text: string): Token[] {
  return text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .flatMap((segment) => {
      const em = segment.startsWith("*") && segment.endsWith("*");
      const body = em ? segment.slice(1, -1) : segment;
      return body.split(/(\s+)/).filter(Boolean).map((t) => ({ text: t, em }));
    });
}

// Opacidad mínima de las palabras "apagadas": mantiene contraste 3:1 en
// texto grande para no perder legibilidad ni accesibilidad.
const DIM = 0.5;

/**
 * Manifiesto que se "enciende" palabra por palabra al hacer scroll (GSAP,
 * scrub). Con prefers-reduced-motion se muestra completo.
 */
export function Manifesto({ title, titleId, body, className }: ManifestoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleTokens = useMemo(() => tokenize(title), [title]);
  const bodyTokens = useMemo(() => tokenize(body), [body]);

  useScrollMotion(ref, (element, { reduce }) => {
    if (reduce) return;

    gsap.fromTo(
      "[data-word]",
      { opacity: DIM },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 45%",
          scrub: 0.5,
        },
      },
    );
  });

  const render = (tokens: Token[]) =>
    tokens.map((token, index) =>
      /^\s+$/.test(token.text) ? (
        <Fragment key={index}> </Fragment>
      ) : (
        <span
          key={index}
          data-word
          className={cn(token.em && "font-serif italic text-gold-light")}
        >
          {token.text}
        </span>
      ),
    );

  return (
    <div ref={ref} className={className}>
      <h2 id={titleId} className="max-w-[16ch] text-display-xl text-paper">
        {render(titleTokens)}
      </h2>
      <p className="mt-8 max-w-[36ch] font-serif text-display-md text-paper lg:mt-10">{render(bodyTokens)}</p>
    </div>
  );
}
