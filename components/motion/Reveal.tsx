"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

import { DURATION, EASE } from "@/lib/motion";

const elements = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  article: motion.article,
  figure: motion.figure,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  dl: motion.dl,
  p: motion.p,
  span: motion.span,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type RevealTag = keyof typeof elements;

type BaseProps = Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileInView" | "variants"> & {
  as?: RevealTag;
};

const VIEWPORT_MARGIN = "0px 0px -12% 0px";

/** Variantes del ítem: fade + translate Y con la curva editorial. */
export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

type RevealProps = BaseProps & {
  delay?: number;
  /** Distancia inicial en px. */
  y?: number;
  once?: boolean;
};

/** Revela un único elemento cuando entra en viewport. */
export function Reveal({ as = "div", delay = 0, y = 28, once = true, ...props }: RevealProps) {
  const Component = elements[as] as typeof motion.div;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: VIEWPORT_MARGIN }}
      transition={{ duration: DURATION.base, ease: EASE, delay }}
      {...props}
    />
  );
}

type RevealGroupProps = BaseProps & {
  stagger?: number;
  delay?: number;
  once?: boolean;
};

/** Contenedor que revela a sus `RevealItem` en cascada (stagger). */
export function RevealGroup({
  as = "div",
  stagger = 0.09,
  delay = 0,
  once = true,
  ...props
}: RevealGroupProps) {
  const Component = elements[as] as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: VIEWPORT_MARGIN }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...props}
    />
  );
}

/** Hijo de `RevealGroup`: hereda el estado y aparece en su turno. */
export function RevealItem({ as = "div", ...props }: BaseProps) {
  const Component = elements[as] as typeof motion.div;
  return <Component variants={revealItemVariants} {...props} />;
}
