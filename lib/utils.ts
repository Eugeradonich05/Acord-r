import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Tamaños tipográficos propios (tailwind.config): sin esto, tailwind-merge los
// confunde con colores y `text-ink` descartaría `text-display-lg`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-2xl", "display-xl", "display-lg", "display-md", "display-sm", "lead", "eyebrow"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
