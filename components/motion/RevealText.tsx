"use client";

import { motion, type Variants } from "framer-motion";
import { Fragment, useMemo, type ReactNode } from "react";

import { EASE, enterDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Word = { text: string; em: boolean; spaceBefore: boolean };

/** Parte "texto *énfasis* texto" en palabras, conservando la puntuación pegada. */
function parse(text: string): Word[] {
  const words: Word[] = [];
  let trailingSpace = false;
  for (const segment of text.split(/(\*[^*]+\*)/)) {
    if (!segment) continue;
    const em = segment.startsWith("*") && segment.endsWith("*");
    const body = em ? segment.slice(1, -1) : segment;
    const leadingSpace = trailingSpace || /^\s/.test(body);
    body
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token, index) => {
        words.push({
          text: token,
          em,
          spaceBefore: words.length > 0 && (index > 0 || leadingSpace),
        });
      });
    trailingSpace = /\s$/.test(body);
  }
  return words;
}

const container: Variants = {
  hidden: {},
  visible: ({ stagger, delay }: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: stagger, delayChildren: delay },
  }),
};

const word: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 1.1, ease: EASE } },
};

type RevealTextProps = {
  /**
   * Texto a revelar. Lo que va entre *asteriscos* se renderiza como énfasis;
   * cada "\n" abre una línea nueva (ver `lineClassNames`).
   */
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  emClassName?: string;
  /** Clases por línea, p. ej. sangrías para componer el título en escalera. */
  lineClassNames?: readonly string[];
  stagger?: number;
  delay?: number;
  /** `mount`: al cargar (hero). `inView`: al entrar en viewport. */
  trigger?: "mount" | "inView";
};

/**
 * Título que aparece palabra por palabra desde una máscara. Los lectores de
 * pantalla reciben el texto completo; las palabras animadas van ocultas.
 */
export function RevealText({
  text,
  as: Tag = "h2",
  id,
  className,
  emClassName = "italic text-petrol",
  lineClassNames,
  stagger = 0.06,
  delay = 0,
  trigger = "inView",
}: RevealTextProps) {
  const lines = useMemo(() => text.split("\n").map(parse), [text]);
  const plain = useMemo(() => text.replace(/\*/g, "").replace(/\n/g, " "), [text]);
  const multiline = lines.length > 1;

  const renderLines = (renderWord: (content: ReactNode, index: number) => ReactNode) => {
    let index = 0;
    return lines.map((words, lineIndex) => {
      const content = words.map((w) => {
        const current = index++;
        return (
          <Fragment key={current}>
            {w.spaceBefore && " "}
            <span
              className={cn(
                "-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom",
                w.em && "-mr-[0.08em] pr-[0.08em]",
              )}
            >
              {renderWord(w.em ? <em className={emClassName}>{w.text}</em> : w.text, current)}
            </span>
          </Fragment>
        );
      });
      return multiline ? (
        <span key={lineIndex} className={cn("block", lineClassNames?.[lineIndex])}>
          {content}
        </span>
      ) : (
        <Fragment key={lineIndex}>{content}</Fragment>
      );
    });
  };

  // Al montar (hero): animación CSS que arranca con el primer pintado, sin
  // esperar la hidratación. Mejora el LCP en mobile.
  if (trigger === "mount") {
    return (
      <Tag id={id} className={className}>
        <span className="sr-only">{plain}</span>
        <span aria-hidden="true" className="block">
          {renderLines((content, index) => (
            <span className="animate-word inline-block" style={enterDelay(delay + index * stagger)}>
              {content}
            </span>
          ))}
        </span>
      </Tag>
    );
  }

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{plain}</span>
      <motion.span
        aria-hidden="true"
        className="block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        custom={{ stagger, delay }}
        variants={container}
      >
        {renderLines((content) => (
          <motion.span variants={word} className="inline-block will-change-transform">
            {content}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
