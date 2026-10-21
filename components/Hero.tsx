import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { AnchorLink } from "@/components/AnchorLink";
import { HeroScene } from "@/components/motion/HeroScene";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { RevealText } from "@/components/motion/RevealText";
import { Rings } from "@/components/motion/Rings";
import { Button } from "@/components/ui/button";
import { heroFacts, heroMeta } from "@/lib/content";
import { enterDelay } from "@/lib/motion";
import { studioPhotos } from "@/lib/photos";

// La entrada del hero usa animaciones CSS (`.animate-enter`, `.animate-word`,
// `.animate-settle`): arrancan con el primer pintado, sin esperar la
// hidratación (LCP en mobile). Si hay preloader se aplican recién cuando el
// overlay empieza a subir, así intro y hero son una sola secuencia.

const ROMAN = ["i", "ii", "iii", "iv"] as const;
const photo = studioPhotos.hero;

export function Hero() {
  return (
    <HeroScene
      id="inicio"
      tabIndex={-1}
      aria-labelledby="inicio-titulo"
      className="relative isolate overflow-hidden bg-petrol-950 text-paper"
    >
      {/* Fotografía a sangre con velo petróleo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 animate-settle">
          <div data-hero-zoom className="absolute inset-0 will-change-transform">
            <Image
              data-hero-image
              src={photo.src}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              className="object-cover"
              style={{ objectPosition: photo.position }}
            />
          </div>
        </div>
        {/* Velo base (40 % → 70 % con el scroll) */}
        <div data-hero-overlay className="absolute inset-0 bg-petrol opacity-40" />
        {/* Degradé de lectura: garantiza contraste AA donde va el texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-petrol-950/95 via-petrol-950/70 to-petrol-950/35 lg:bg-gradient-to-r lg:from-petrol-950/90 lg:via-petrol-950/70 lg:to-petrol-950/25" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-petrol-950/85 to-transparent" />
      </div>

      {/* Aros de la marca: parallax propio (ver HeroScene) */}
      <div
        data-hero-rings
        className="pointer-events-none absolute -right-[45%] top-[10%] -z-10 w-[150%] animate-enter sm:-right-[25%] sm:w-[95%] lg:-right-[8%] lg:top-[14%] lg:w-[58%]"
        style={enterDelay(0.9)}
      >
        <Rings tone="dark" draw={false} parallax={false} className="opacity-50" />
      </div>

      <div data-hero-content className="container relative flex min-h-svh flex-col pt-nav">
        {/* Membrete: encabezado de documento */}
        <div
          className="mt-4 flex items-center justify-between gap-6 border-y border-paper/20 py-3 text-eyebrow uppercase text-paper/75 animate-enter"
          style={enterDelay(0.05)}
        >
          {heroMeta.map((item, index) => (
            <span key={item} className={index === 0 ? "text-gold-light" : "hidden md:inline"}>
              {item}
            </span>
          ))}
          <span className="tabular-nums md:hidden">§</span>
        </div>

        {/* Título en escalera */}
        <div className="flex flex-1 items-end py-12 lg:items-center lg:py-16">
          <RevealText
            as="h1"
            id="inicio-titulo"
            trigger="mount"
            delay={0.15}
            stagger={0.05}
            text={"Cobranzas con\ncriterio jurídico\ny *rigor contable*."}
            lineClassNames={["", "sm:pl-[8%] lg:pl-[6%]", "sm:pl-[3%] lg:pl-[12%]"]}
            className="w-full max-w-5xl text-display-2xl text-paper"
            emClassName="italic text-gold-light"
          />
        </div>

        {/* Pie del hero: acciones, bajada y cláusulas */}
        <div className="grid gap-10 border-t border-paper/20 py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
          <div className="flex flex-wrap gap-3 animate-enter lg:col-span-4" style={enterDelay(0.55)}>
            <MagneticButton>
              <Button asChild size="lg" variant="inverse">
                <AnchorLink to="contacto">
                  Consultar <ArrowRight />
                </AnchorLink>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild size="lg" variant="outline-inverse">
                <AnchorLink to="servicios">Nuestros servicios</AnchorLink>
              </Button>
            </MagneticButton>
          </div>

          <p
            className="max-w-measure text-lead text-paper/85 animate-enter lg:col-span-4 lg:col-start-6"
            style={enterDelay(0.4)}
          >
            Gestionamos su cartera con método, confidencialidad y trato respetuoso hacia cada
            deudor. Resultados medibles, sin atajos.
          </p>

          <ol className="space-y-3 text-sm lg:col-span-3 lg:col-start-10">
            {heroFacts.map((fact, index) => (
              <li
                key={fact.title}
                className="grid grid-cols-[2rem_1fr] animate-enter"
                style={enterDelay(0.65 + index * 0.08)}
              >
                <span aria-hidden="true" className="font-serif italic text-gold-light">
                  {ROMAN[index]}.
                </span>
                <span>
                  <span className="font-medium text-paper">{fact.title}</span>
                  <span className="text-paper/75"> — {fact.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </HeroScene>
  );
}
