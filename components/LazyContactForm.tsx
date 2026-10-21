"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// El formulario (react-hook-form + zod) queda fuera del bundle inicial: se
// descarga recién cuando el usuario se acerca a la sección de contacto.
const ContactForm = dynamic(
  () => import("@/components/ContactForm").then((mod) => mod.ContactForm),
  { ssr: false, loading: () => <FormPlaceholder /> },
);

export function LazyContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{near ? <ContactForm /> : <FormPlaceholder />}</div>;
}

/** Reserva el alto del formulario para evitar saltos de layout (CLS). */
function FormPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[46rem] rounded-sm border border-line bg-card sm:min-h-[40rem]"
    />
  );
}
