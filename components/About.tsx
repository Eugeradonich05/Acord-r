import Image from "next/image";

import { AboutScene } from "@/components/motion/AboutScene";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { SectionMarker } from "@/components/SectionHeading";
import { stats, statsFootnote, values, type Stat } from "@/lib/content";
import { studioPhotos } from "@/lib/photos";

const photo = studioPhotos.nosotros;
const format = new Intl.NumberFormat("es-AR");

// Orden de la franja: años, casos, % de recupero, clientes.
const METRICS = [stats.years, stats.cases, stats.recovery, stats.clients] as const;

/**
 * Cifra de la franja. El valor final, invisible, reserva el ancho exacto en
 * la misma celda: nada se corre mientras el contador avanza.
 */
function Metric({ stat, note }: { stat: Stat; note?: boolean }) {
  const final = format.format(stat.value);
  return (
    <div className="flex flex-col gap-2 border-paper/20 lg:border-l lg:py-2 lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
      <p className="font-serif text-display-lg leading-none text-gold-light">
        <span className="sr-only">
          {stat.prefix}
          {final}
          {stat.suffix}
        </span>
        <span aria-hidden="true" className="inline-grid tabular-nums">
          <span className="invisible col-start-1 row-start-1">{final}</span>
          <span data-count={stat.value} className="col-start-1 row-start-1 text-right">
            {final}
          </span>
        </span>
        <span aria-hidden="true">{stat.suffix}</span>
        {note && (
          <sup className="ml-1 font-sans text-[0.35em] text-gold-light">
            <a href="#nota-recupero" aria-describedby="nota-recupero" className="hover:underline">
              1<span className="sr-only">, ver nota</span>
            </a>
          </sup>
        )}
      </p>
      <p className="text-sm text-paper/80">{stat.label}</p>
    </div>
  );
}

export function About() {
  return (
    <AboutScene
      id="nosotros"
      tabIndex={-1}
      aria-labelledby="nosotros-titulo"
      className="relative bg-paper"
    >
      {/*
        Dos columnas a todo el ancho: texto 55 % / foto 45 %. La columna de
        texto alinea su borde izquierdo con el `container` del resto del sitio
        (el padding en % se calcula sobre la celda, que es el 55 % del ancho).
      */}
      <div className="lg:grid lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
        <div className="container py-section lg:mx-0 lg:max-w-none lg:pl-[max(1.25rem,calc((100%/0.55_-_1360px)/2_+_1.25rem))] lg:pr-16 xl:pr-24">
          <SectionMarker label="Nosotros" index={2} />
          <RevealText
            id="nosotros-titulo"
            text="Firmeza en el reclamo, *respeto* en el trato."
            className="mt-6 max-w-[16ch] text-display-xl text-ink"
          />
          <Reveal as="p" delay={0.15} className="mt-8 max-w-[44ch] text-lead text-stone">
            Somos abogados y contadores trabajando en un mismo equipo. Cada caso se analiza desde lo
            legal y lo económico, para recuperar lo adeudado sin comprometer la reputación de su
            empresa.
          </Reveal>

          {/* Principios: mismo lenguaje que los sub-ítems de Servicios */}
          <p className="mt-14 text-eyebrow uppercase text-stone lg:mt-20">Principios de actuación</p>
          <ol className="mt-5 border-t border-ink/15">
            {values.map((value, index) => (
              <li
                key={value.title}
                data-value
                className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-ink/10 py-6 lg:py-7"
              >
                <span aria-hidden="true" className="pt-1.5 font-serif text-sm italic tabular-nums text-gold-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-display-sm text-ink">{value.title}</h3>
                  <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-stone">
                    {value.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/*
          Foto a sangre: pegada al borde derecho, a toda la altura de la columna,
          filete dorado del lado del texto. En desktop la imagen queda fija a la
          altura de la pantalla (sticky) dentro de la columna: la columna se ve
          siempre cubierta y la foto no se amplía de más. `overflow-clip` (no
          `hidden`) para que el sticky siga funcionando.
        */}
        <figure
          data-about-frame
          className="relative aspect-[4/3] overflow-clip border-t-2 border-gold sm:aspect-[16/10] lg:aspect-auto lg:border-l-2 lg:border-t-0"
        >
          <div className="absolute inset-0 overflow-hidden lg:sticky lg:inset-auto lg:top-0 lg:h-svh">
            {/* Margen sólo abajo para el parallax: los rostros (arriba) no se cortan */}
            <div data-about-image className="absolute inset-x-0 -bottom-[6%] top-0 will-change-transform">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                placeholder="blur"
                className="object-cover"
                style={{ objectPosition: photo.position }}
              />
            </div>
            {/* Velo petróleo sutil: tiñe sin tapar los rostros */}
            <div aria-hidden="true" className="absolute inset-0 bg-petrol opacity-20 mix-blend-multiply" />
          </div>
        </figure>
      </div>

      {/* Franja de métricas: transición hacia la sección siguiente */}
      <div data-metrics className="bg-petrol text-paper">
        <div className="container py-10 lg:py-16">
          <h3 className="sr-only">Trayectoria en cifras</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {METRICS.map((stat) => (
              <Metric key={stat.label} stat={stat} note={stat === stats.recovery} />
            ))}
          </div>
          <p id="nota-recupero" className="mt-8 border-t border-paper/15 pt-5 text-xs text-paper/75 lg:mt-12">
            <sup className="mr-1 text-gold-light">1</sup>
            {statsFootnote}
          </p>
        </div>
      </div>
    </AboutScene>
  );
}
