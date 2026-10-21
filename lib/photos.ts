// Fotografía del sitio.
// - `studioPhotos`: fotos entregadas por el estudio. Los originales están en
//   public/photo/; en assets/fotos/estudio/ hay copias a 2400 px de ancho
//   con el tratamiento de color ya aplicado (desaturación leve, tono neutro;
//   ver README). next/image genera los tamaños finales.
// - `servicePhotos`: Cobranzas usa la foto del estudio; el resto son
//   provisorias de StockSnap (CC0). Créditos en assets/fotos/CREDITOS.md.

import type { StaticImageData } from "next/image";

import studioCobranzas from "@/assets/fotos/estudio/cobranzas.jpg";
import studioContacto from "@/assets/fotos/estudio/contacto.jpg";
import studioHero from "@/assets/fotos/estudio/hero.jpg";
import studioNosotros from "@/assets/fotos/estudio/nosotros.jpg";
import servicioContable from "@/assets/fotos/servicio-contable.jpg";
import servicioJuridico from "@/assets/fotos/servicio-juridico.jpg";
import servicioRecupero from "@/assets/fotos/servicio-recupero.jpg";
import type { Service } from "@/lib/content";

export type SitePhoto = {
  src: StaticImageData;
  alt: string;
  position?: string;
  /** Tratamiento de color ya aplicado al archivo (no se suma el filtro CSS). */
  toned?: boolean;
};

export const studioPhotos = {
  hero: {
    src: studioHero,
    alt: "Mano firmando un documento con una lapicera sobre un escritorio.",
    position: "30% 45%",
    toned: true,
  },
  cobranzas: {
    src: studioCobranzas,
    alt: "Profesional firmando documentación sobre una mesa de reuniones.",
    position: "60% 60%",
    toned: true,
  },
  nosotros: {
    src: studioNosotros,
    alt: "Dos profesionales revisando juntos un documento en la oficina.",
    // Recorte vertical (columna de Nosotros): centra a las dos personas y
    // alinea arriba, donde están los rostros.
    position: "40% 0%",
    toned: true,
  },
  contacto: {
    src: studioContacto,
    alt: "Reunión de trabajo de tres profesionales en una oficina vidriada.",
    // Recorte vertical (mitad del panel de Contacto): centra la mesa y los rostros.
    position: "50% 40%",
    toned: true,
  },
} satisfies Record<string, SitePhoto>;

export const servicePhotos: Record<Service["slug"], SitePhoto> = {
  cobranzas: studioPhotos.cobranzas,
  juridico: { src: servicioJuridico, alt: "Profesional firmando documentación frente a una computadora." },
  contable: { src: servicioContable, alt: "Notas y cálculos manuscritos junto a una computadora portátil." },
  recupero: { src: servicioRecupero, alt: "Mesa de reunión con un portafolios y documentos." },
};
