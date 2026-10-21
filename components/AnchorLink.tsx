"use client";

import type { ComponentProps } from "react";

import { useScrollToSection } from "@/components/motion/SmoothScroll";

type AnchorLinkProps = Omit<ComponentProps<"a">, "href"> & {
  /** Id de la sección destino, sin "#". */
  to: string;
};

/** Link de ancla que navega con Lenis (o scroll nativo) y mueve el foco. */
export function AnchorLink({ to, onClick, ...props }: AnchorLinkProps) {
  const scrollToSection = useScrollToSection();
  return (
    <a
      href={`#${to}`}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        scrollToSection(to);
      }}
      {...props}
    />
  );
}
