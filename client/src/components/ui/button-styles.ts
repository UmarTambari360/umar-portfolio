import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "ghost" | "link";

/**
 * Public-site buttons now come from shadcn's Button. This keeps the old
 * `buttonClasses("primary" | "ghost" | "link")` call sites (footer, metrics,
 * project cards, project page, LinkButton) working unchanged: they apply the
 * shadcn variants to plain <a> and <Link> elements, which is the pattern
 * shadcn documents for links styled as buttons.
 */
export function buttonClasses(
  variant: ButtonVariant,
  className?: string,
): string {
  switch (variant) {
    case "primary":
      return cn(buttonVariants({ variant: "default", size: "lg" }), className);
    case "ghost":
      return cn(buttonVariants({ variant: "ghost", size: "inline" }), className);
    case "link":
      return cn(buttonVariants({ variant: "link", size: "inline" }), className);
  }
}