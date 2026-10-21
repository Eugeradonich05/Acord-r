import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { sectionMark } from "@/lib/site";
import { cn } from "@/lib/utils";

type SectionMarkerProps = {
  label: string;
  /** Número de sección: se muestra como "§ 01". */
  index?: number;
  tone?: "light" | "dark";
  className?: string;
};

/** Rótulo de sección con signo de párrafo, como en un texto jurídico. */
export function SectionMarker({ label, index, tone = "light", className }: SectionMarkerProps) {
  return (
    <Reveal
      as="p"
      className={cn("eyebrow", tone === "dark" && "text-gold-light", className)}
    >
      {index !== undefined && <span className="tabular-nums">{sectionMark(index)}</span>}
      {label}
    </Reveal>
  );
}

type SectionHeadingProps = {
  /** Id del título, para `aria-labelledby` de la sección. */
  id: string;
  eyebrow: string;
  index?: number;
  /** Lo que va entre *asteriscos* se destaca en itálica. */
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  /** `split`: título a la izquierda e intro a la derecha (desktop). */
  layout?: "split" | "stacked";
  className?: string;
};

/** Encabezado editorial de sección: rótulo §, título revelado e introducción. */
export function SectionHeading({
  id,
  eyebrow,
  index,
  title,
  intro,
  tone = "light",
  layout = "split",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "grid gap-8",
        layout === "split" && "lg:grid-cols-12 lg:items-end lg:gap-12",
        className,
      )}
    >
      <div className={cn(layout === "split" && "lg:col-span-7")}>
        <SectionMarker label={eyebrow} index={index} tone={tone} />
        <RevealText
          id={id}
          text={title}
          className={cn("mt-6 max-w-[20ch] text-display-lg", dark ? "text-paper" : "text-ink")}
          emClassName={cn("italic", dark ? "text-gold-light" : "text-petrol")}
        />
      </div>
      {intro && (
        <Reveal
          as="p"
          delay={0.2}
          className={cn(
            "max-w-measure text-lead",
            dark ? "text-paper/75" : "text-stone",
            layout === "split" && "lg:col-span-4 lg:col-start-9",
          )}
        >
          {intro}
        </Reveal>
      )}
    </div>
  );
}
