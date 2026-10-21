import { Manifesto } from "@/components/Manifesto";
import { CurtainSection } from "@/components/motion/CurtainSection";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Rings } from "@/components/motion/Rings";
import { Photo } from "@/components/Photo";
import { SectionMarker } from "@/components/SectionHeading";
import { values } from "@/lib/content";
import { photos } from "@/lib/photos";

export function About() {
  return (
    <CurtainSection
      id="nosotros"
      tabIndex={-1}
      aria-labelledby="nosotros-titulo"
      className="relative overflow-hidden bg-petrol-950 py-section text-paper"
    >
      <Rings
        tone="dark"
        draw={false}
        className="absolute -right-[45%] -top-[6%] w-[140%] opacity-20 md:-right-[20%] md:w-[80%] lg:-right-[10%] lg:w-[55%]"
        parallax={{ speed: 0.25, rotate: -10 }}
      />

      <div className="container relative">
        <SectionMarker label="Nosotros" index={2} tone="dark" />

        <Manifesto
          titleId="nosotros-titulo"
          title="Firmeza en el reclamo, *respeto* en el trato."
          body="Somos abogados y contadores trabajando en un mismo equipo. Cada caso se analiza desde lo legal y lo económico, para recuperar lo adeudado sin comprometer la reputación de su empresa."
          className="mt-10 lg:mt-14"
        />

        {/* Banda fotográfica a todo el ancho, virada a petróleo */}
        <Photo
          src={photos.nosotros.src}
          alt={photos.nosotros.alt}
          objectPosition={photos.nosotros.position}
          sizes="(min-width: 1360px) 1264px, 100vw"
          tone="duotone"
          parallax={0.12}
          frameClassName="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
          className="mt-20 lg:mt-28"
          captionTone="dark"
          caption={{ label: "Fig. 2", text: "Abogados y contadores, un mismo equipo por caso." }}
        />

        {/* Valores como articulado de un documento */}
        <div className="mt-24 lg:mt-36">
          <p className="text-eyebrow uppercase text-paper/70">Principios de actuación</p>
          <RevealGroup as="ol" stagger={0.12} className="mt-6 border-t border-paper/20">
            {values.map((value, index) => (
              <RevealItem
                as="li"
                key={value.title}
                className="grid gap-3 border-b border-paper/20 py-8 lg:grid-cols-12 lg:items-baseline lg:gap-8 lg:py-10"
              >
                <span className="font-serif text-lg italic text-gold-light lg:col-span-2">
                  Art. {index + 1}º
                </span>
                <h3 className="text-display-md text-paper lg:col-span-4">{value.title}</h3>
                <p className="max-w-prose text-[0.9375rem] leading-relaxed text-paper/75 lg:col-span-5 lg:col-start-8">
                  {value.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </CurtainSection>
  );
}
