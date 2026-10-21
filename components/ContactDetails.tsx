import { Clock, Mail, MapPin, Phone, Smartphone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Detail = { icon: LucideIcon; label: string; value: ReactNode };

const link = (href: string, text: string) => (
  <a href={href} className="link-underline hover:text-paper">
    {text}
  </a>
);

/** Datos de contacto del estudio, en el orden en que se muestran. */
const DETAILS: readonly Detail[] = [
  { icon: Mail, label: "Email", value: link(`mailto:${site.contact.email}`, site.contact.email) },
  { icon: Phone, label: "PBX", value: link(site.contact.pbxHref, site.contact.pbx) },
  { icon: Smartphone, label: "Teléfono", value: link(site.contact.phoneHref, site.contact.phone) },
  { icon: Clock, label: "Horarios", value: site.contact.hours },
  { icon: MapPin, label: "Ubicación", value: site.contact.location },
];

type ContactDetailsProps = {
  /**
   * `panel`: con rótulo visible sobre cada dato (panel de Contacto).
   * `compact`: ícono + dato, rótulo sólo para lectores de pantalla (Footer).
   */
  variant?: "panel" | "compact";
  className?: string;
};

/**
 * Lista de datos de contacto con íconos finos, sobre fondos oscuros. Una sola
 * fuente para el panel de Contacto y el Footer: los datos salen de `site`.
 */
export function ContactDetails({ variant = "panel", className }: ContactDetailsProps) {
  const panel = variant === "panel";

  return (
    <dl className={cn(panel ? "border-t border-paper/20" : "space-y-3.5", className)}>
      {DETAILS.map(({ icon: Icon, label, value }) => (
        // dl > div > dt + dd: el ícono va dentro del dt para que la lista sea válida
        <div
          key={label}
          className={panel ? "border-b border-paper/15 py-3.5" : "grid grid-cols-[1.125rem_1fr] items-baseline gap-x-3"}
        >
          <dt className={panel ? "flex items-center gap-4 text-eyebrow uppercase text-paper/75" : "self-center"}>
            <Icon className="size-[1.125rem] shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden="true" />
            <span className={panel ? undefined : "sr-only"}>{label}</span>
          </dt>
          <dd className={cn("text-[0.9375rem]", panel ? "mt-1 pl-[2.125rem] text-paper" : "text-paper/85")}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
