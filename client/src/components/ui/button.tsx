import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/cn";

/*
  shadcn/ui Button, customised for this design system:
  - same uppercase micro label look as the original buttons
  - `default` = lime fill, `outline` = the old "secondary", `destructive` = the old "danger"
  - `lg` is the taller public-site CTA (with its hover lift), `inline` is for
    text-style ghost/link buttons that have no box
  - no focus ring classes: the global :focus-visible outline in index.css applies
*/
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-micro font-bold tracking-label whitespace-nowrap uppercase transition-[transform,color,background-color,border-color,filter] duration-200 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-105",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-105",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:text-accent-text",
        link: "text-accent-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3.5",
        // 48px tall / 11px text on tablet + mobile, 50px / 10px on desktop.
        lg: "h-12 px-9 text-[0.6875rem] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 lg:h-[50px] lg:px-6 lg:text-micro",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
        inline: "h-auto p-0",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        size: ["icon", "icon-sm", "icon-lg"],
        className: "hover:bg-muted",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Render the child element (a link, say) with the button's styles. */
  asChild?: boolean;
  /** Disables the button and shows a spinner; the label stays for screen readers. */
  loading?: boolean;
  icon?: ReactNode;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  icon,
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  // Links cannot be disabled or typed, so these only apply to a real <button>.
  const nativeProps = asChild
    ? {}
    : {
        type,
        disabled: disabled === true || loading,
        "aria-busy": loading || undefined,
      };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...nativeProps}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? (
            <LoaderCircle
              aria-hidden
              size={14}
              className="motion-safe:animate-spin"
            />
          ) : (
            icon
          )}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
