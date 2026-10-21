"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ServiceMedia } from "@/components/ServiceMedia";
import type { Service } from "@/lib/content";
import { ScrollTrigger } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { servicePhotos } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * Índice de servicios: filas tipográficas que se "entintan" al pasar el mouse
 * y se despliegan como acordeón, con la foto del servicio dentro del panel.
 */
export function ServiceIndex({ services }: { services: readonly Service[] }) {
  const [open, setOpen] = useState<number | null>(0);
  // Hasta el primer clic, el panel abierto por defecto se revela con el scroll.
  const [interacted, setInteracted] = useState(false);

  return (
    <RevealGroup as="ul" stagger={0.08} className="border-t border-ink/20">
      {services.map((service, index) => (
        <RevealItem as="li" key={service.slug} className="border-b border-ink/20">
          <ServiceRow
            service={service}
            index={index}
            open={open === index}
            scrubReveal={!interacted}
            onToggle={() => {
              setInteracted(true);
              setOpen((current) => (current === index ? null : index));
            }}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

type ServiceRowProps = {
  service: Service;
  index: number;
  open: boolean;
  scrubReveal: boolean;
  onToggle: () => void;
};

function ServiceRow({ service, index, open, scrubReveal, onToggle }: ServiceRowProps) {
  const uid = useId();
  const buttonId = `${uid}-boton`;
  const panelId = `${uid}-panel`;
  const number = String(index + 1).padStart(2, "0");
  const photo = servicePhotos[service.slug];

  return (
    <>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group relative -mx-4 grid w-[calc(100%+2rem)] grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-4 py-6 text-left lg:-mx-6 lg:w-[calc(100%+3rem)] lg:grid-cols-[5rem_1fr_minmax(0,16rem)_3rem] lg:gap-8 lg:px-6 lg:py-8"
        >
          {/* Barrido de tinta petróleo */}
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-petrol transition-transform duration-700 ease-editorial group-hover:scale-x-100"
          />
          <span className="relative font-serif text-sm italic tabular-nums text-gold-deep transition-colors duration-500 group-hover:text-gold-light">
            {number}
          </span>
          <span className="relative font-serif text-display-md text-ink transition-[color,transform] duration-500 ease-editorial group-hover:translate-x-2 group-hover:text-paper">
            {service.title}
          </span>
          <span className="relative hidden font-sans text-sm text-stone transition-colors duration-500 group-hover:text-paper/80 lg:block">
            {service.summary}
          </span>
          <span
            aria-hidden="true"
            className="relative flex size-10 items-center justify-center justify-self-end rounded-full border border-ink/25 text-ink transition-colors duration-500 group-hover:border-paper/40 group-hover:text-paper"
          >
            <Plus
              className={cn(
                "size-4 transition-transform duration-500 ease-editorial",
                open && "rotate-45",
              )}
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false} onExitComplete={() => ScrollTrigger.refresh()}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            // El acordeón cambia el alto de la página: se recalculan los
            // ScrollTrigger de más abajo (pin del Proceso, reveals).
            onAnimationComplete={() => ScrollTrigger.refresh()}
            className="-mx-4 overflow-hidden lg:-mx-6"
          >
            {/*
              Grilla firme: [imagen 40 %] [descripción 32 %] [sub-ítems 28 %].
              El panel tiene el mismo sangrado que el encabezado (-mx-4 / -mx-6,
              aplicado en el contenedor con overflow-hidden): la imagen
              comparte el borde izquierdo con la franja petróleo y toca el
              borde inferior del panel. Columnas estiradas a la misma altura.
            */}
            <div className="grid lg:grid-cols-[minmax(0,40fr)_minmax(0,32fr)_minmax(0,28fr)]">
              <ServiceMedia photo={photo} scrub={scrubReveal} className="aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" />

              <div className="flex flex-col justify-center px-4 pb-8 pl-[4.5rem] pt-10 lg:px-12 lg:py-14">
                <p className="text-eyebrow uppercase text-gold-deep">Alcance del servicio</p>
                <p className="mt-5 max-w-prose text-lead text-ink-soft">{service.description}</p>
              </div>

              <div className="flex flex-col justify-center px-4 pb-12 pl-[4.5rem] lg:border-l lg:border-ink/15 lg:px-10 lg:py-14">
                <ul className="space-y-3 border-t border-ink/10 pt-6 text-[0.9375rem] text-ink lg:border-t-0 lg:pt-0">
                  {service.items.map((item, itemIndex) => (
                    <li key={item} className="flex items-baseline gap-4 border-b border-ink/10 pb-3 last:border-b-0">
                      <span aria-hidden="true" className="font-serif text-sm italic text-gold-deep">
                        {number}.{itemIndex + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
