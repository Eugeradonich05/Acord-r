// Datos institucionales centralizados. Contacto: datos reales del estudio.
// El CUIT sigue siendo provisorio: reemplazar antes de publicar.

export const site = {
  name: "ACORD@R SRL",
  shortName: "ACORD@R",
  tagline: "Gestión integral de cobranzas",
  description:
    "Estudio jurídico-contable especializado en gestión integral de cobranzas, recupero de créditos y asesoramiento profesional a empresas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.acordar.com.ar",
  contact: {
    location: "Rosario, Santa Fe",
    locality: "Rosario",
    region: "Santa Fe",
    email: "gesinco@gesinco.com.ar",
    pbx: "0810-555-9090",
    pbxHref: "tel:08105559090",
    phone: "+54 341 260-8890",
    phoneHref: "tel:+543412608890",
    hours: "Lun a Vie 8–20 h · Sáb 8–14 h",
    /** Mismo horario en formato schema.org (datos estructurados). */
    openingHours: ["Mo-Fr 08:00-20:00", "Sa 08:00-14:00"],
  },
  legal: {
    cuit: "30-00000000-0",
  },
} as const;

export type NavLink = {
  id: string;
  label: string;
  /** Número de sección (§) que se muestra en el sitio. */
  index?: number;
};

export const navLinks: readonly NavLink[] = [
  { id: "inicio", label: "Inicio" },
  { id: "servicios", label: "Servicios", index: 1 },
  { id: "nosotros", label: "Nosotros", index: 2 },
  { id: "proceso", label: "Proceso", index: 3 },
  { id: "contacto", label: "Contacto", index: 4 },
];

/** "§ 01" a partir del número de sección. */
export function sectionMark(index: number): string {
  return `§ ${String(index).padStart(2, "0")}`;
}
