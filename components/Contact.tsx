import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { ContactScene } from "@/components/motion/ContactScene";
import { RevealText } from "@/components/motion/RevealText";
import { SectionMarker } from "@/components/SectionHeading";
import { studioPhotos } from "@/lib/photos";
import { site } from "@/lib/site";

type ContactItem = { icon: LucideIcon; label: string; value: ReactNode };

const items: readonly ContactItem[] = [
  { icon: MapPin, label: "Dirección", value: site.contact.address },
  {
    icon: Mail,
    label: "Email",
    value: (
      <a href={`mailto:${site.contact.email}`} className="link-underline">
        {site.contact.email}
      </a>
    ),
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: (
      <a href={site.contact.phoneHref} className="link-underline">
        {site.contact.phone}
      </a>
    ),
  },
  { icon: Clock, label: "Horario", value: site.contact.hours },
];

const photo = studioPhotos.contacto;

type ContactProps = {
  /** Formulario de contacto (se carga en diferido). */
  form?: ReactNode;
};

/**
 * Contacto como panel partido: a la izquierda la foto del estudio es el fondo
 * de los datos (velo petróleo + texto claro); a la derecha, el formulario.
 * Un solo bloque: alturas igualadas, encuentro a tope y radio sólo en las
 * esquinas externas.
 */
export function Contact({ form }: ContactProps) {
  return (
    <ContactScene
      id="contacto"
      tabIndex={-1}
      aria-labelledby="contacto-titulo"
      className="bg-paper-deep py-section"
    >
      <div className="container">
        <div className="grid overflow-hidden rounded-xl shadow-lift lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)]">
          {/* Mitad izquierda: foto a sangre como fondo del panel de datos */}
          <div data-contact-media className="relative isolate overflow-hidden text-paper">
            <div data-contact-image aria-hidden="true" className="absolute inset-x-0 -inset-y-[8%] -z-10 will-change-transform">
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 1360px) 612px, (min-width: 1024px) 45vw, 100vw"
                placeholder="blur"
                className="object-cover"
                style={{ objectPosition: photo.position }}
              />
            </div>
            {/* Velo petróleo (60 %) + degradé de lectura arriba y abajo, donde va el texto */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-petrol opacity-60" />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-b from-petrol-950/75 via-petrol-950/20 to-petrol-950/90"
            />

            <div className="flex h-full flex-col justify-between gap-16 p-8 sm:p-10 lg:p-12">
              <div>
                <SectionMarker label="Contacto" index={4} tone="dark" />
                <RevealText
                  id="contacto-titulo"
                  text="Hablemos de *su cartera*."
                  className="mt-6 max-w-[14ch] text-display-lg text-paper"
                  emClassName="italic text-gold-light"
                />
                <p className="mt-6 max-w-[36ch] text-[0.9375rem] leading-relaxed text-paper/85">
                  Cuéntenos su situación y un profesional del estudio se comunicará con usted dentro
                  de las 24 horas hábiles.
                </p>
              </div>

              <dl className="border-t border-paper/20">
                {items.map(({ icon: Icon, label, value }) => (
                  // dl > div > dt + dd: el ícono va dentro del dt para que la lista sea válida
                  <div key={label} className="border-b border-paper/15 py-4">
                    <dt className="flex items-center gap-4 text-eyebrow uppercase text-paper/75">
                      <Icon className="size-[1.125rem] shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden="true" />
                      {label}
                    </dt>
                    <dd className="mt-1.5 pl-[2.125rem] text-[0.9375rem] text-paper">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Mitad derecha: formulario sobre off-white, filete dorado del lado de la foto */}
          <div className="border-t-2 border-gold bg-paper p-6 sm:p-10 lg:border-l-2 lg:border-t-0 lg:p-14">
            {form}
          </div>
        </div>
      </div>
    </ContactScene>
  );
}
