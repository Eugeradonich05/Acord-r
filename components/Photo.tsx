"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

import { useParallax } from "@/components/motion/useParallax";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PhotoProps = {
  src: StaticImageData;
  alt: string;
  /** Atributo `sizes` de next/image según el ancho real en cada breakpoint. */
  sizes: string;
  /** Clases del marco (relación de aspecto, ancho, posición). */
  frameClassName?: string;
  className?: string;
  /** `natural`: corrección de color sutil. `duotone`: viraje petróleo. */
  tone?: "natural" | "duotone";
  /** `mount`: telón CSS al cargar (hero). `scroll`: al entrar en viewport. */
  reveal?: "mount" | "scroll" | false;
  /** Parallax interno de la imagen dentro del marco (fracción del viewport). */
  parallax?: number;
  objectPosition?: string;
  priority?: boolean;
  /** Epígrafe editorial: "Fig. N — texto". */
  caption?: { label: string; text: string };
  captionTone?: "light" | "dark";
};

// Revelado al entrar en viewport: el marco se abre de abajo hacia arriba y la
// imagen, que arranca ampliada, se asienta en su lugar (zoom-out).
const frameVariants: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.3, ease: EASE } },
};

const imageVariants: Variants = {
  hidden: { scale: 1.2 },
  visible: { scale: 1, transition: { duration: 1.8, ease: EASE } },
};

/**
 * Fotografía editorial: marco con revelado tipo telón, parallax interno y
 * epígrafe. La imagen se optimiza con next/image (AVIF/WebP, lazy-load).
 */
export function Photo({
  src,
  alt,
  sizes,
  frameClassName,
  className,
  tone = "natural",
  reveal = "scroll",
  parallax = 0,
  objectPosition,
  priority = false,
  caption,
  captionTone = "light",
}: PhotoProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  useParallax(innerRef, { speed: parallax });

  const scrollReveal = reveal === "scroll" && !reduceMotion;

  return (
    <figure className={className}>
      <motion.div
        className={cn(
          "relative overflow-hidden bg-paper-deep",
          reveal === "mount" && "animate-curtain",
          frameClassName,
        )}
        variants={scrollReveal ? frameVariants : undefined}
        initial={scrollReveal ? "hidden" : false}
        whileInView={scrollReveal ? "visible" : undefined}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      >
        {/* Capa más alta que el marco: margen para el parallax interno */}
        <div ref={innerRef} className={cn("absolute inset-x-0", parallax ? "-inset-y-[12%]" : "inset-y-0")}>
          <motion.div className="absolute inset-0" variants={scrollReveal ? imageVariants : undefined}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              placeholder="blur"
              className={cn(
                "object-cover",
                tone === "duotone" ? "photo-duotone" : "photo-tone",
                reveal === "mount" && "animate-settle",
              )}
              style={objectPosition ? { objectPosition } : undefined}
            />
          </motion.div>
        </div>
        {tone === "duotone" && (
          <div aria-hidden="true" className="absolute inset-0 bg-petrol-900 mix-blend-multiply opacity-55" />
        )}
      </motion.div>

      {caption && (
        <figcaption
          className={cn(
            "mt-3 flex items-baseline gap-3 text-xs",
            captionTone === "dark" ? "text-paper/70" : "text-stone",
          )}
        >
          <span
            className={cn(
              "font-serif text-sm italic",
              captionTone === "dark" ? "text-gold-light" : "text-gold-deep",
            )}
          >
            {caption.label}
          </span>
          {caption.text}
        </figcaption>
      )}
    </figure>
  );
}
