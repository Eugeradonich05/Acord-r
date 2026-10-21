import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Campo de línea inferior, estilo editorial. El borde cumple 3:1 de contraste. */
function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full border-0 border-b border-input bg-transparent px-0 text-base text-ink transition-colors duration-400 ease-editorial placeholder:text-stone/80 hover:border-ink focus-visible:border-petrol focus-visible:shadow-[0_1px_0_0_rgb(var(--petrol))] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:shadow-[0_1px_0_0_rgb(var(--destructive))]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
