import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { stats, statsFootnote, type Stat } from "@/lib/content";

/**
 * Cifra dentro de la oración. El valor final, invisible, reserva el ancho
 * exacto en la misma celda: el texto no salta mientras el contador avanza.
 */
function Figure({ stat }: { stat: Stat }) {
  const final = `${stat.prefix ?? ""}${new Intl.NumberFormat("es-AR").format(stat.value)}${stat.suffix ?? ""}`;
  return (
    <span className="inline-grid text-gold">
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 tabular-nums">
        {final}
      </span>
      <span className="col-start-1 row-start-1 text-right">
        <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
      </span>
    </span>
  );
}

export function Stats() {
  return (
    <section aria-labelledby="trayectoria-titulo" className="bg-ink py-section text-paper">
      <div className="container">
        <Reveal as="p" className="eyebrow text-gold">
          Trayectoria
        </Reveal>
        <h2 id="trayectoria-titulo" className="sr-only">
          Trayectoria en cifras
        </h2>

        <Reveal
          as="p"
          delay={0.1}
          className="mt-10 max-w-[26ch] font-serif text-display-lg leading-[1.2] text-paper/90 lg:mt-14"
        >
          En <Figure stat={stats.years} /> años gestionamos más de <Figure stat={stats.cases} />{" "}
          casos para <Figure stat={stats.clients} /> empresas, con un recupero promedio del{" "}
          <Figure stat={stats.recovery} />
          <sup className="ml-1 font-sans text-[0.35em] text-gold">
            <a href="#nota-recupero" aria-describedby="nota-recupero" className="hover:underline">
              1<span className="sr-only">, ver nota</span>
            </a>
          </sup>{" "}
          en mora temprana.
        </Reveal>

        <Reveal
          as="p"
          delay={0.2}
          className="mt-16 max-w-measure border-t border-paper/15 pt-5 text-xs text-paper/70"
        >
          <span id="nota-recupero">
            <sup className="mr-1 text-gold">1</sup>
            {statsFootnote}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
