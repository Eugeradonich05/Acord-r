import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Preloader } from "@/components/Preloader";
import { Providers } from "@/components/Providers";
import { fontSans, fontSerif } from "@/lib/fonts";
import { PRELOADER_SCRIPT } from "@/lib/preloader";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  icons: {
    icon: "/logo-mark.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F5F0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: el script del preloader agrega una clase a
    // <html> antes de que React hidrate.
    <html lang="es-AR" className={cn(fontSerif.variable, fontSans.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_SCRIPT }} />
      </head>
      <body className="grain">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:text-paper"
        >
          Saltar al contenido
        </a>
        <Providers>
          <Preloader />
          <Navbar />
          <main id="contenido" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
