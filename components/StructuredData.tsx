import { services } from "@/lib/content";
import { site } from "@/lib/site";

/** Datos estructurados (schema.org) para buscadores. */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.street,
      addressLocality: site.contact.locality,
      addressRegion: site.contact.region,
      addressCountry: "AR",
    },
    openingHours: "Mo-Fr 09:00-18:00",
    areaServed: { "@type": "Country", name: "Argentina" },
    knowsAbout: services.map((service) => service.title),
  };

  return (
    <script
      type="application/ld+json"
      // Contenido propio y estático: sin datos del usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
