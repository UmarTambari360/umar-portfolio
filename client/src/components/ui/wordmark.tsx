import { SITE } from "@/config/site";
import { cn } from "@/lib/cn";

interface WordmarkProps {
  size?: "md" | "sm";
  className?: string;
  onClick?: () => void;
}

export function Wordmark({ size = "md", className, onClick }: WordmarkProps) {
  return (
    <a
      href="#top"
      aria-label={`${SITE.name} — back to top`}
      onClick={onClick}
      className={cn(
        "font-display leading-none font-bold text-accent-text",
        size === "md" ? "text-[1.75rem] md:text-[2rem]" : "text-[1.625rem]",
        className,
      )}
    >
      {SITE.wordmark}
    </a>
  );
}
