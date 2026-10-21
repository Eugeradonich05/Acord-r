import { ArrowUp, ArrowUpRight } from "lucide-react";

import { AnchorLink } from "@/components/AnchorLink";
import { FooterWatermark } from "@/components/FooterWatermark";
import { Logo } from "@/components/Logo";
import { navLinks, sectionMark, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-petrol-950 text-paper">
      <FooterWatermark />

      <div className="container pb-10 pt-20 lg:pt-28">
        {/* Llamado final */}
        <div className="border-b border-paper/15 pb-14 lg:pb-20">
          <p className="eyebrow flex w-fit text-gold-light">¿Conversamos?</p>
          <a
            href={`mailto:${site.contact.email}`}
            className="group mt-6 inline-flex max-w-full items-baseline gap-x-3 font-serif text-[clamp(1.375rem,6.4vw,4rem)] leading-tight tracking-[-0.02em] text-paper sm:gap-x-4"
          >
            <span className="link-underline min-w-0 break-words">{site.contact.email}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-[0.7em] shrink-0 self-center text-gold transition-transform duration-600 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* Información: queda por encima de la marca de agua */}
        <div className="grid gap-12 pb-[clamp(3rem,7vw,7rem)] pt-14 lg:grid-cols-12 lg:pt-16">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-measure text-[0.9375rem] leading-relaxed text-paper/75">
              {site.description}
            </p>
          </div>

          <nav aria-label="Pie de página" className="lg:col-span-3 lg:col-start-6">
            <h2 className="font-sans text-eyebrow font-medium uppercase text-gold-light">Índice</h2>
            <ul className="mt-6 space-y-3 text-[0.9375rem]">
              {navLinks.map((link) => (
                <li key={link.id} className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="w-8 text-xs tabular-nums text-paper/70">
                    {link.index ? sectionMark(link.index) : "§"}
                  </span>
                  <AnchorLink to={link.id} className="link-underline text-paper/85 hover:text-paper">
                    {link.label}
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <h2 className="font-sans text-eyebrow font-medium uppercase text-gold-light">Estudio</h2>
            <address className="mt-6 space-y-3 text-[0.9375rem] not-italic text-paper/85">
              <p>{site.contact.address}</p>
              <p>
                <a href={site.contact.phoneHref} className="link-underline hover:text-paper">
                  {site.contact.phone}
                </a>
              </p>
              <p>{site.contact.hours}</p>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/15 pt-8 text-xs text-paper/75 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. Todos los derechos reservados. CUIT {site.legal.cuit}.
          </p>
          <p>Los datos personales se tratan conforme a la Ley 25.326.</p>
          <AnchorLink
            to="inicio"
            className="inline-flex items-center gap-2 self-start text-paper/85 transition-colors hover:text-paper md:self-auto"
          >
            Volver arriba <ArrowUp className="size-3.5" aria-hidden="true" />
          </AnchorLink>
        </div>
      </div>
    </footer>
  );
}
