import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Los colores viven como canales RGB en CSS variables (app/globals.css)
 * para poder usar opacidad: `bg-petrol/80`, `border-ink/10`, etc.
 */
const rgb = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  // hover solo en dispositivos con puntero: evita estados "pegados" en touch.
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        lg: "3rem",
      },
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      screens: {
        // Desktop con poca altura (laptops de 768 px): secciones fijadas (pin)
        // que deben entrar completas en pantalla.
        short: { raw: "(min-width: 1024px) and (max-height: 820px)" },
      },
      colors: {
        // Marca
        petrol: {
          DEFAULT: rgb("petrol"),
          50: "#F0F7F6",
          100: "#E1EEED",
          200: "#BFDCDA",
          300: "#8CC3C0",
          400: "#4FA3A0",
          500: "#1C8483",
          600: "#13706F",
          700: "#0E5C5C",
          800: "#0B4848",
          900: "#08393A",
          950: "#062A2A",
        },
        gold: {
          DEFAULT: rgb("gold"), // decorativo / texto sobre carbón
          light: rgb("gold-light"), // texto sobre petróleo
          deep: rgb("gold-deep"), // texto sobre off-white
        },
        paper: {
          DEFAULT: rgb("paper"),
          deep: rgb("paper-deep"),
        },
        ink: {
          DEFAULT: rgb("ink"),
          soft: rgb("ink-soft"),
        },
        stone: rgb("stone"),
        line: rgb("line"),

        // Semánticos (shadcn/ui)
        background: rgb("background"),
        foreground: rgb("foreground"),
        primary: {
          DEFAULT: rgb("primary"),
          foreground: rgb("primary-foreground"),
        },
        secondary: {
          DEFAULT: rgb("secondary"),
          foreground: rgb("secondary-foreground"),
        },
        accent: {
          DEFAULT: rgb("accent"),
          foreground: rgb("accent-foreground"),
        },
        muted: {
          DEFAULT: rgb("muted"),
          foreground: rgb("muted-foreground"),
        },
        destructive: {
          DEFAULT: rgb("destructive"),
          foreground: rgb("destructive-foreground"),
        },
        card: {
          DEFAULT: rgb("card"),
          foreground: rgb("card-foreground"),
        },
        border: rgb("border"),
        input: rgb("input"),
        ring: rgb("ring"),
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        // Escala editorial fluida: [tamaño, { lineHeight, letterSpacing }]
        "display-2xl": [
          "clamp(3rem, 1.4rem + 6.4vw, 7.75rem)",
          { lineHeight: "0.95", letterSpacing: "-0.025em" },
        ],
        "display-xl": [
          "clamp(2.5rem, 1.5rem + 4vw, 5.5rem)",
          { lineHeight: "1", letterSpacing: "-0.022em" },
        ],
        "display-lg": [
          "clamp(2rem, 1.35rem + 2.6vw, 4rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em" },
        ],
        "display-md": [
          "clamp(1.625rem, 1.25rem + 1.5vw, 2.625rem)",
          { lineHeight: "1.12", letterSpacing: "-0.02em" },
        ],
        "display-sm": [
          "clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)",
          { lineHeight: "1.25", letterSpacing: "-0.01em" },
        ],
        lead: ["clamp(1.0625rem, 1rem + 0.35vw, 1.3125rem)", { lineHeight: "1.6" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      spacing: {
        section: "var(--space-section)",
        nav: "var(--nav-h)",
      },
      maxWidth: {
        prose: "62ch",
        measure: "44ch",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        900: "900ms",
      },
      boxShadow: {
        lift: "0 1px 0 rgb(var(--ink) / 0.04), 0 24px 48px -24px rgb(var(--petrol) / 0.28)",
      },
      keyframes: {
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 60s linear infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
