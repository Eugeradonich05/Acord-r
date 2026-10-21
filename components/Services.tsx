import { SectionHeading } from "@/components/SectionHeading";
import { ServiceIndex } from "@/components/ServiceIndex";
import { services } from "@/lib/content";

export function Services() {
  return (
    <section
      id="servicios"
      tabIndex={-1}
      aria-labelledby="servicios-titulo"
      className="overflow-x-clip bg-paper-deep py-section"
    >
      <div className="container">
        <SectionHeading
          id="servicios-titulo"
          index={1}
          eyebrow="Servicios"
          title="Cuatro áreas de práctica, *un mismo criterio*."
          intro="Acompañamos a empresas, entidades financieras y comercios en todo el ciclo del crédito: desde la mora temprana hasta la instancia judicial."
        />

        <div className="mt-16 lg:mt-24">
          <ServiceIndex services={services} />
        </div>
      </div>
    </section>
  );
}
