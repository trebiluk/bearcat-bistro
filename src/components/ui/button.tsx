import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "nav" | "danger";
  size?: "sm" | "md";
};

export function Button({ className, variant = "ghost", size = "md", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-sans text-sm font-semibold tracking-wide transition-colors duration-150 active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-harvest disabled:opacity-40",
        size === "sm" ? "h-9 min-h-9 px-3" : "h-11 min-h-11 px-4",
        variant === "primary" && "bg-harvest text-cream hover:bg-harvest-deep",
        variant === "ghost" && "bg-cream text-navy hover:bg-gold",
        variant === "nav" && "bg-transparent text-cream/80 hover:bg-white/10 hover:text-cream",
        variant === "danger" && "bg-bad-bg text-bad hover:bg-bad hover:text-cream",
        className,
      )}
      {...props}
    />
  );
}
