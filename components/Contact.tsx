import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Photo } from "@/components/Photo";
import { SectionHeading } from "@/components/SectionHeading";
import { photos } from "@/lib/photos";
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

type ContactProps = {
  /** Formulario de contacto (se incorpora en el paso 5). */
  form?: ReactNode;
};

export function Contact({ form }: ContactProps) {
  return (
    <section
      id="contacto"
      tabIndex={-1}
      aria-labelledby="contacto-titulo"
      className="bg-paper-deep py-section"
    >
      <div className="container grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <SectionHeading
            id="contacto-titulo"
            index={4}
            eyebrow="Contacto"
            title="Conversemos sobre *su cartera*."
            intro="Cuéntenos su situación y un profesional del estudio se comunicará con usted dentro de las 24 horas hábiles."
            layout="stacked"
          />

          <Photo
            src={photos.contacto.src}
            alt={photos.contacto.alt}
            sizes="(min-width: 1024px) 28vw, 100vw"
            frameClassName="aspect-[3/2]"
            className="mt-12"
            caption={{ label: "Fig. 3", text: "Toda consulta recibe respuesta por escrito." }}
          />

          <RevealGroup as="dl" delay={0.2} className="mt-12 border-t border-line">
            {items.map(({ icon: Icon, label, value }) => (
              <RevealItem key={label} className="border-b border-line py-5">
                {/* dl > div > dt + dd: el ícono va dentro del dt para que la lista sea válida */}
                <dt className="flex items-center gap-5 text-eyebrow uppercase text-stone">
                  <Icon className="size-5 shrink-0 text-petrol" strokeWidth={1.5} aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-2 pl-10 text-[0.9375rem] text-ink">{value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">{form}</div>
      </div>
    </section>
  );
}
