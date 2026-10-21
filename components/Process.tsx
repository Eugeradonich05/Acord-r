"use client";

import { ArrowRight } from "lucide-react";
import { useRef } from "react";

import { AnchorLink } from "@/components/AnchorLink";
import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { RevealText } from "@/components/motion/RevealText";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { steps } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const ACTIVE = "is-active";
/** Con motion activo, los entregables esperan a que la línea llegue a su paso. */
const MOTION_READY = "motion-ready";

/**
 * Proceso. Desktop: la sección se fija y los pasos se desplazan en horizontal
 * mientras una línea se dibuja de izquierda a derecha; al final del recorrido,
 * una tarjeta invita a empezar. Mobile/tablet: lista vertical con la línea
 * dibujándose hacia abajo. Cada paso muestra su entregable cuando la línea lo
 * alcanza. Sin movimiento (o sin JS): todo visible.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useScrollMotion(sectionRef, (section, { desktop, reduce }) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const line = lineRef.current;
    if (!viewport || !track || !line) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-step]", track);
    const setActive = (isActive: (item: HTMLElement) => boolean) =>
      items.forEach((item) => item.classList.toggle(ACTIVE, isActive(item)));

    if (reduce) {
      setActive(() => true);
      return () => setActive(() => false);
    }

    section.classList.add(MOTION_READY);
    const cleanup = () => {
      section.classList.remove(MOTION_READY);
      setActive(() => false);
    };

    // Desktop: scroll horizontal fijado (pin) + línea en X.
    if (desktop) {
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => {
              const reach = progress * track.scrollWidth;
              setActive((item) => item.offsetLeft + 12 <= reach + viewport.clientWidth * 0.35);
            },
          },
        })
        .to(track, { x: () => -distance(), ease: "none" }, 0)
        .fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);

      return cleanup;
    }

    // Mobile/tablet: línea vertical y pasos que se encienden al alcanzarlos.
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: track, start: "top 62%", end: "bottom 62%", scrub: 0.6 },
      },
    );
    items.forEach((item) =>
      ScrollTrigger.create({
        trigger: item,
        start: "top+=12 62%",
        onEnter: () => item.classList.add(ACTIVE),
        onLeaveBack: () => item.classList.remove(ACTIVE),
      }),
    );

    return cleanup;
  });

  return (
    <section
      ref={sectionRef}
      id="proceso"
      tabIndex={-1}
      aria-labelledby="proceso-titulo"
      className="overflow-hidden py-section lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0 lg:pt-nav lg:motion-reduce:h-auto lg:motion-reduce:py-section"
    >
      <div className="container">
        <SectionHeading
          id="proceso-titulo"
          index={3}
          eyebrow="Proceso"
          title="Un método claro, de la primera reunión al *cobro efectivo*."
          intro="Cada etapa tiene objetivos, plazos y responsables definidos. Usted sabe en todo momento qué se hizo y qué sigue."
        />
      </div>

      <div ref={viewportRef} className="container mt-14 lg:mt-12 lg:max-w-none lg:px-0 short:mt-8 lg:motion-reduce:max-w-[1360px] lg:motion-reduce:px-[1.25rem]">
        {/*
          Pista: los pasos y, al final, la tarjeta de cierre (se desplaza en
          desktop). Con movimiento reducido no hay pin: grilla de 2 × 2.
        */}
        <div ref={trackRef} className="lg:flex lg:w-max lg:items-start lg:pr-[10vw] lg:motion-reduce:block lg:motion-reduce:w-auto lg:motion-reduce:pr-0">
          <ol className="relative lg:flex lg:pl-[max(1.25rem,calc((100vw-1360px)/2+1.25rem))] lg:motion-reduce:grid lg:motion-reduce:grid-cols-2 lg:motion-reduce:gap-y-16 lg:motion-reduce:pl-0">
            {/* Riel y línea: vertical en mobile, horizontal en desktop */}
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-[11px] top-3 w-px bg-line lg:inset-x-0 lg:bottom-auto lg:top-[11px] lg:h-px lg:w-auto lg:motion-reduce:hidden"
            />
            <span
              ref={lineRef}
              aria-hidden="true"
              className="absolute bottom-3 left-[11px] top-3 w-px origin-top bg-petrol lg:inset-x-0 lg:bottom-auto lg:top-[11px] lg:h-px lg:w-auto lg:origin-left lg:motion-reduce:hidden"
            />

            {steps.map((step, index) => (
              <li
                key={step.title}
                data-step
                className="group relative pb-14 pl-14 last:pb-0 sm:pl-20 lg:w-[30rem] lg:pb-0 lg:pl-0 lg:pr-16 lg:pt-14 xl:w-[34rem] short:pt-10 lg:motion-reduce:w-auto"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 flex size-6 items-center justify-center rounded-full border border-line bg-paper transition-colors duration-600 ease-editorial group-[.is-active]:border-petrol"
                >
                  <span className="size-2 scale-0 rounded-full bg-gold transition-transform duration-600 ease-editorial group-[.is-active]:scale-100" />
                </span>

                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <span
                    aria-hidden="true"
                    className="font-serif text-display-md tabular-nums leading-none text-ink/50 transition-colors duration-900 ease-editorial group-[.is-active]:text-petrol lg:text-display-xl short:text-display-lg"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-eyebrow uppercase text-stone">{step.timing}</span>
                </div>
                <h3 className="mt-5 text-display-sm text-ink lg:mt-6 short:mt-4">{step.title}</h3>
                <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-stone">
                  {step.description}
                </p>

                {/*
                  Entregable de la etapa: aparece cuando la línea alcanza el paso.
                  Oculto sólo con `motion-ready` (lo pone el JS): sin JS se ve siempre.
                */}
                <div className="mt-6 max-w-[38ch] border-l-2 short:mt-4 short:py-3 border-gold bg-paper-deep/70 py-3.5 pl-4 pr-5 transition-[opacity,transform] duration-700 ease-editorial [.motion-ready_&]:translate-y-3 [.motion-ready_&]:opacity-0 group-[.is-active]:!translate-y-0 group-[.is-active]:!opacity-100">
                  <p className="text-eyebrow uppercase text-gold-deep">Entregable</p>
                  <p className="mt-1.5 font-serif text-lg leading-snug text-ink">{step.deliverable.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-stone">{step.deliverable.description}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Cierre del recorrido: invitación a empezar por el primer paso */}
          <div className="mt-16 rounded-xl bg-petrol p-8 text-paper sm:p-10 lg:ml-4 lg:mt-0 lg:w-[26rem] lg:self-center xl:w-[28rem] lg:motion-reduce:ml-0 lg:motion-reduce:mt-16 lg:motion-reduce:w-auto lg:motion-reduce:max-w-xl">
            <p className="text-eyebrow uppercase text-gold-light">Primer paso</p>
            <RevealText
              as="h3"
              text="¿Empezamos por el *diagnóstico*?"
              className="mt-4 text-display-md text-paper"
              emClassName="italic text-gold-light"
            />
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-paper/85">
              Todo empieza con una conversación sobre la cartera: con esa información armamos el
              informe y la propuesta de gestión.
            </p>
            <Button asChild size="lg" variant="inverse" className="mt-8">
              <AnchorLink to="contacto">
                Solicitar diagnóstico <ArrowRight />
              </AnchorLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
