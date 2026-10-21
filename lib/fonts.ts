import { Fraunces, Inter } from "next/font/google";

/** Display serif con eje óptico: más contraste en tamaños grandes. */
export const fontSerif = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
