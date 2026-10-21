// Datos institucionales centralizados. Valores provisorios: reemplazar por
// los reales antes de publicar.

export const site = {
  name: "ACORD@R SRL",
  shortName: "ACORD@R",
  tagline: "Gestión integral de cobranzas",
  description:
    "Estudio jurídico-contable especializado en gestión integral de cobranzas, recupero de créditos y asesoramiento profesional a empresas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.acordar.com.ar",
  contact: {
    address: "Tucumán 1359, piso 8, Rosario, Santa Fe",
    street: "Tucumán 1359, piso 8",
    locality: "Rosario",
    region: "Santa Fe",
    email: "consultas@acordar.com.ar",
    phone: "+54 341 400-0000",
    phoneHref: "tel:+543414000000",
    hours: "Lunes a viernes, de 9 a 18 h",
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
