"use client";

import Image from "next/image";
import { useRef } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { gsap } from "@/lib/gsap";
import type { SitePhoto } from "@/lib/photos";
import { cn } from "@/lib/utils";

const HIDDEN = "inset(0% 100% 0% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

/**
 * Imagen a sangre del panel de servicio. Se descubre de izquierda a derecha
 * (clip-path) mientras la imagen se asienta (zoom-out):
 * - `scrub`: el panel abierto al cargar se descubre atado al scroll;
 * - si no (panel abierto con un clic), se reproduce solo, en sincronía con la
 *   apertura del acordeón.
 */
export function ServiceMedia({
  photo,
  scrub = false,
  className,
}: {
  photo: SitePhoto;
  scrub?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollMotion(ref, (frame, { reduce }) => {
    if (reduce) return;

    const image = frame.querySelector("[data-media-image]");

    if (scrub) {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: frame, start: "top 85%", end: "top 35%", scrub: 0.6 },
        })
        .fromTo(frame, { clipPath: HIDDEN }, { clipPath: SHOWN }, 0)
        .fromTo(image, { scale: 1.15 }, { scale: 1 }, 0);
      return;
    }

    gsap
      .timeline({ defaults: { duration: 1.1, ease: "power3.inOut" }, delay: 0.1 })
      .fromTo(frame, { clipPath: HIDDEN }, { clipPath: SHOWN }, 0)
      .fromTo(image, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0);
  }, [scrub]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-paper-deep", className)}>
      <div data-media-image className="absolute inset-0 will-change-transform">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          placeholder="blur"
          className={cn("object-cover", !photo.toned && "photo-tone")}
          style={photo.position ? { objectPosition: photo.position } : undefined}
        />
      </div>
    </div>
  );
}
