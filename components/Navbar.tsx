"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

import { Logo } from "@/components/Logo";
import { useLenis, useScrollToSection } from "@/components/motion/SmoothScroll";
import { Button } from "@/components/ui/button";
import { EASE } from "@/lib/motion";
import { navLinks, sectionMark, site } from "@/lib/site";
import { useActiveSection } from "@/lib/use-active-section";
import { cn } from "@/lib/utils";

const SECTION_IDS = navLinks.map((link) => link.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const active = useActiveSection(SECTION_IDS);
  const scrollToSection = useScrollToSection();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (y > previous && y > 480) setHidden(true);
    else if (y < previous) setHidden(false);
  });

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Menú mobile: bloquea el scroll, inertiza el resto y cierra con Escape.
  useEffect(() => {
    if (!open) return;

    lenis?.stop();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const outside = document.querySelectorAll<HTMLElement>("main, footer");
    outside.forEach((el) => (el.inert = true));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);

    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);

    return () => {
      lenis?.start();
      root.style.overflow = "";
      outside.forEach((el) => (el.inert = false));
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, lenis, close]);

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setOpen(false);
    // Espera un frame para que el cleanup del menú libere el scroll.
    requestAnimationFrame(() => scrollToSection(id));
  };

  // Arriba de todo la barra es transparente sobre la foto oscura del hero.
  const onDark = open || !scrolled;
  const solid = scrolled && !open;

  return (
    <motion.header
      data-navbar
      className="fixed inset-x-0 top-0 z-50"
      initial={false}
      animate={{ y: hidden && !open ? "-100%" : "0%" }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE }}
      onFocusCapture={() => setHidden(false)}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-600 ease-editorial",
          solid
            ? "border-line bg-paper/85 backdrop-blur-md backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      />

      <nav
        aria-label="Principal"
        className="container relative flex h-nav items-center justify-between gap-6"
      >
        <a
          href="#inicio"
          onClick={(event) => handleNavigate(event, "inicio")}
          className="relative z-10 -m-2 p-2"
        >
          <Logo tone={onDark ? "light" : "dark"} />
          <span className="sr-only"> — volver al inicio</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => handleNavigate(event, link.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative block px-3.5 py-2 text-sm transition-colors duration-400",
                    isActive
                      ? onDark
                        ? "text-paper"
                        : "text-ink"
                      : onDark
                        ? "text-paper/75 hover:text-paper"
                        : "text-stone hover:text-petrol",
                  )}
                >
                  {link.index && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative -top-[0.45em] mr-1.5 text-[0.625rem] tabular-nums tracking-wider transition-colors duration-400",
                        isActive
                          ? onDark
                            ? "text-gold-light"
                            : "text-gold-deep"
                          : onDark
                            ? "text-paper/60"
                            : "text-stone",
                      )}
                    >
                      {String(link.index).padStart(2, "0")}
                    </span>
                  )}
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-x-3.5 -bottom-px h-px bg-gold"
                      transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="relative z-10 flex items-center gap-2">
          <Button asChild size="sm" variant={onDark ? "inverse" : "default"} className="hidden lg:inline-flex">
            <a href="#contacto" onClick={(event) => handleNavigate(event, "contacto")}>
              Consultar
            </a>
          </Button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className={cn(
              "-mr-2 inline-flex size-11 items-center justify-center rounded-md transition-colors duration-400 lg:hidden",
              onDark ? "text-paper hover:bg-paper/10" : "text-ink hover:bg-ink/5",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <MobileMenu
            active={active}
            reduceMotion={reduceMotion ?? false}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}

type MobileMenuProps = {
  active: string | undefined;
  reduceMotion: boolean;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
};

function MobileMenu({ active, reduceMotion, onNavigate }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    firstLinkRef.current?.focus();
  }, []);

  const duration = reduceMotion ? 0 : 0.7;

  return (
    <motion.div
      id="menu-mobile"
      className="absolute inset-x-0 top-0 -z-10 flex h-dvh flex-col bg-petrol-950 pt-nav text-paper lg:hidden"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration, ease: EASE }}
    >
      <ul className="container flex flex-1 flex-col justify-center gap-1">
        {navLinks.map((link, index) => (
          <motion.li
            key={link.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: duration / 3 } }}
            transition={{ duration, ease: EASE, delay: reduceMotion ? 0 : 0.18 + index * 0.06 }}
            className="border-b border-paper/10"
          >
            <a
              ref={index === 0 ? firstLinkRef : undefined}
              href={`#${link.id}`}
              onClick={(event) => onNavigate(event, link.id)}
              aria-current={active === link.id ? "location" : undefined}
              className="group flex items-baseline gap-5 py-4"
            >
              <span className="w-10 shrink-0 font-sans text-xs tabular-nums tracking-wider text-gold-light">
                {link.index ? sectionMark(link.index) : "§"}
              </span>
              <span className="font-serif text-display-md transition-transform duration-400 ease-editorial group-hover:translate-x-2">
                {link.label}
              </span>
            </a>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration, delay: reduceMotion ? 0 : 0.5 }}
        className="container flex flex-col gap-1 pb-10 text-sm text-paper/75"
      >
        <a href={`mailto:${site.contact.email}`} className="hover:text-paper">
          {site.contact.email}
        </a>
        <a href={site.contact.phoneHref} className="hover:text-paper">
          {site.contact.phone}
        </a>
      </motion.div>
    </motion.div>
  );
}
