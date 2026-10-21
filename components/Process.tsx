"use client";

import { useRef } from "react";

import { useScrollMotion } from "@/components/motion/useScrollMotion";
import { SectionHeading } from "@/components/SectionHeading";
import { steps } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const ACTIVE = "is-active";

/**
 * Proceso. Desktop: la sección se fija y los pasos se desplazan en horizontal
 * mientras una línea se dibuja de izquierda a derecha. Mobile/tablet: lista
 * vertical con la línea dibujándose hacia abajo. Sin movimiento: todo visible.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
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

      return () => setActive(() => false);
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

    return () => setActive(() => false);
  });

  return (
    <section
      ref={sectionRef}
      id="proceso"
      tabIndex={-1}
      aria-labelledby="proceso-titulo"
      className="overflow-hidden py-section lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0 lg:pt-nav"
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

      <div ref={viewportRef} className="container mt-16 lg:mt-16 lg:max-w-none lg:px-0">
        <ol
          ref={trackRef}
          className="relative lg:flex lg:w-max lg:pl-[max(3rem,calc((100vw-1360px)/2+3rem))] lg:pr-[12vw]"
        >
          {/* Riel y línea: vertical en mobile, horizontal en desktop */}
          <span
            aria-hidden="true"
            className="absolute bottom-3 left-[11px] top-3 w-px bg-line lg:inset-x-0 lg:bottom-auto lg:top-[11px] lg:h-px lg:w-auto"
          />
          <span
            ref={lineRef}
            aria-hidden="true"
            className="absolute bottom-3 left-[11px] top-3 w-px origin-top bg-petrol lg:inset-x-0 lg:bottom-auto lg:top-[11px] lg:h-px lg:w-auto lg:origin-left"
          />

          {steps.map((step, index) => (
            <li
              key={step.title}
              data-step
              className="group relative pb-14 pl-14 last:pb-0 sm:pl-20 lg:w-[30rem] lg:pb-0 lg:pl-0 lg:pr-16 lg:pt-16 xl:w-[34rem]"
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
                  className="font-serif text-display-md tabular-nums leading-none text-ink/50 transition-colors duration-900 ease-editorial group-[.is-active]:text-petrol lg:text-display-xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-eyebrow uppercase text-stone">{step.timing}</span>
              </div>
              <h3 className="mt-5 text-display-sm text-ink lg:mt-8">{step.title}</h3>
              <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-stone">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
