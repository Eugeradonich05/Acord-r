"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { useLenis } from "@/components/motion/SmoothScroll";
import { gsap } from "@/lib/gsap";
import { PRELOADER_FLAG, PRELOADER_TIMER, PRELOADING_CLASS } from "@/lib/preloader";

// Geometría de los aros (viewBox 600 × 400), la misma del motivo de marca.
const LEFT = { cx: 220, cy: 200 };
const RIGHT = { cx: 380, cy: 200 };
const R = 170;
const STROKE = 4;

/** Tiempo mínimo en pantalla (para que el trazo se complete) y máximo absoluto. */
const MIN_MS = 1300;
const MAX_MS = 2000;

const LETTERS = ["A", "C", "O", "R", "D", "@", "R"] as const;

const delay = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Resuelve cuando la foto del hero terminó de cargar (o falló). */
function heroImageReady(): Promise<void> {
  const image = document.querySelector<HTMLImageElement>("[data-hero-image]");
  if (!image || image.complete) return Promise.resolve();
  return new Promise((resolve) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => resolve(), { once: true });
  });
}

/**
 * Intro de marca: los dos aros se dibujan y giran mientras cargan las fuentes
 * y la foto del hero; luego el overlay sube y descubre el hero, cuya entrada
 * arranca en ese momento (una sola secuencia).
 *
 * - Sólo en la primera carga de la sesión (lo decide el script inline).
 * - El trazo y las letras son CSS: corren desde el primer pintado.
 * - Sin JS, una animación CSS lo oculta a los 4,5 s y el script libera el scroll.
 * - prefers-reduced-motion: aros estáticos y fundido corto.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  // Lenis se crea después del primer render: se frena apenas existe.
  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && activeRef.current) lenis.stop();
  }, [lenis]);

  useEffect(() => {
    const overlay = ref.current;
    const root = document.documentElement;
    if (!overlay || !root.classList.contains(PRELOADING_CLASS)) return;

    // Toma el control: cancela el temporizador de seguridad del script inline
    // y la animación CSS de respaldo (sólo hacen falta si el JS no llega).
    clearTimeout((window as unknown as Record<string, number>)[PRELOADER_TIMER]);
    overlay.style.animation = "none";
    activeRef.current = true;
    lenisRef.current?.stop();

    const background = document.querySelectorAll<HTMLElement>("[data-navbar], main, footer");
    background.forEach((element) => (element.inert = true));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let exit: gsap.core.Timeline | undefined;

    const finish = () => {
      activeRef.current = false;
      background.forEach((element) => (element.inert = false));
      gsap.set([overlay, ...overlay.querySelectorAll("[data-rings], [data-fade]")], { clearProps: "all" });
      try {
        sessionStorage.setItem(PRELOADER_FLAG, "1");
      } catch {
        // Almacenamiento bloqueado: el preloader volverá a mostrarse, nada más.
      }
      lenisRef.current?.start();
      document.getElementById("contenido")?.focus({ preventScroll: true });
    };

    const start = () => {
      if (cancelled) return;
      // A partir de acá el overlay se sostiene con estilo inline: al quitar la
      // clase arranca la entrada del hero mientras el overlay todavía sale.
      gsap.set(overlay, { display: "flex" });
      const release = () => root.classList.remove(PRELOADING_CLASS);

      if (reduce) {
        exit = gsap
          .timeline({ onComplete: finish })
          .call(release)
          .to(overlay, { opacity: 0, duration: 0.35, ease: "power1.out" });
        return;
      }

      // La barra viene de una animación CSS: se congela donde está y se completa.
      const bar = overlay.querySelector<HTMLElement>("[data-bar]");
      if (bar) {
        const current = getComputedStyle(bar).transform;
        bar.style.animation = "none";
        bar.style.transform = current === "none" ? "scaleX(0)" : current;
      }

      const q = gsap.utils.selector(overlay);
      exit = gsap
        .timeline({ onComplete: finish })
        .to(bar, { scaleX: 1, duration: 0.35, ease: "power2.out" })
        .to(q("[data-rings]"), { scale: 1.18, opacity: 0, duration: 0.6, ease: "power2.in" }, ">-0.1")
        .to(q("[data-fade]"), { opacity: 0, y: -12, duration: 0.4, ease: "power2.in" }, "<")
        .call(release, [], ">-0.25")
        .to(overlay, { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, "<");
    };

    const ready = Promise.all([document.fonts.ready, heroImageReady()]);
    void Promise.all([Promise.race([ready, wait(MAX_MS)]), wait(reduce ? 0 : MIN_MS)]).then(start);

    return () => {
      // En desarrollo (StrictMode) el efecto se monta dos veces: se deja la
      // clase puesta para que el segundo montaje retome la intro.
      cancelled = true;
      exit?.kill();
      if (activeRef.current) background.forEach((element) => (element.inert = false));
    };
  }, []);

  return (
    <div
      ref={ref}
      className="preloader fixed inset-0 z-[65] flex-col items-center justify-center bg-petrol text-paper"
    >
      <p role="status" className="sr-only">
        Cargando ACORD@R
      </p>

      <div data-rings aria-hidden="true" className="w-44 sm:w-56">
        <svg viewBox="0 0 600 400" fill="none" className="preloader-rings h-auto w-full overflow-visible">
          <defs>
            <clipPath id="preloader-top">
              <rect width="600" height="200" />
            </clipPath>
            <clipPath id="preloader-bottom">
              <rect y="200" width="600" height="200" />
            </clipPath>
            <mask id="preloader-left" maskUnits="userSpaceOnUse" x="-50" y="-50" width="700" height="500">
              <rect x="-50" y="-50" width="700" height="500" fill="white" />
              <circle {...RIGHT} r={R} stroke="black" strokeWidth={STROKE * 5} clipPath="url(#preloader-top)" />
            </mask>
            <mask id="preloader-right" maskUnits="userSpaceOnUse" x="-50" y="-50" width="700" height="500">
              <rect x="-50" y="-50" width="700" height="500" fill="white" />
              <circle {...LEFT} r={R} stroke="black" strokeWidth={STROKE * 5} clipPath="url(#preloader-bottom)" />
            </mask>
          </defs>
          <g mask="url(#preloader-left)">
            <circle
              {...LEFT}
              r={R}
              pathLength={1}
              stroke="rgb(var(--paper) / 0.92)"
              strokeWidth={STROKE}
              transform={`rotate(-90 ${LEFT.cx} ${LEFT.cy})`}
              className="preloader-ring"
              style={delay(0.1)}
            />
          </g>
          <g mask="url(#preloader-right)">
            <circle
              {...RIGHT}
              r={R}
              pathLength={1}
              stroke="rgb(var(--gold))"
              strokeWidth={STROKE}
              transform={`rotate(90 ${RIGHT.cx} ${RIGHT.cy})`}
              className="preloader-ring"
              style={delay(0.3)}
            />
          </g>
        </svg>
      </div>

      <div data-fade aria-hidden="true" className="mt-8 flex flex-col items-center">
        <p className="font-serif text-[1.75rem] leading-none tracking-[0.04em]">
          {LETTERS.map((letter, index) => (
            <span
              key={index}
              className={letter === "@" ? "preloader-letter italic text-gold-light" : "preloader-letter"}
              style={delay(0.45 + index * 0.06)}
            >
              {letter}
            </span>
          ))}
        </p>
        <div className="mt-6 h-px w-32 overflow-hidden bg-paper/20">
          <div data-bar className="preloader-bar h-full w-full bg-gold" />
        </div>
      </div>
    </div>
  );
}
