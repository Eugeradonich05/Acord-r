import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full resize-y border-0 border-b border-input bg-transparent px-0 py-3 text-base leading-relaxed text-ink transition-colors duration-400 ease-editorial placeholder:text-stone/80 hover:border-ink focus-visible:border-petrol focus-visible:shadow-[0_1px_0_0_rgb(var(--petrol))] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:shadow-[0_1px_0_0_rgb(var(--destructive))]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
