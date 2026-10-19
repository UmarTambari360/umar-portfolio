import { 
    useEffect, useRef, 
    type KeyboardEvent, 
    type RefObject }    from "react";
import { X }            from "lucide-react";
import { NAV_LINKS }    from "@/content/home";
import { Container }    from "@/components/ui/container";
import { ThemeToggle }  from "@/components/ui/theme-toggle";
import { Wordmark }     from "@/components/ui/wordmark";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cn } from "@/lib/cn";

interface MobileMenuProps {
  id: string;
  open: boolean;
  /** `returnFocus` is false when a link was chosen (focus should follow the navigation). */
  onClose: (returnFocus: boolean) => void;
  /** Receives focus when the menu opens. */
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE = "a[href], button:not([disabled])";

export function MobileMenu({
  id,
  open,
  onClose,
  closeButtonRef,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open, closeButtonRef]);

  // Escape closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Keep Tab / Shift+Tab inside the dialog while it is open.
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = items?.[0];
    const last = items?.[items.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      onKeyDown={trapFocus}
      className={cn(
        "fixed inset-0 z-50 flex flex-col overscroll-contain bg-bg motion-reduce:transition-none md:hidden",
        // Opening shows the menu immediately (so it can take focus) and fades in;
        // closing fades out first and only then switches to `visibility: hidden`.
        open
          ? "visible translate-y-0 opacity-100 [transition:opacity_300ms_ease-out,transform_300ms_ease-out,visibility_0s_linear_0s]"
          : "invisible -translate-y-2 opacity-0 [transition:opacity_300ms_ease-out,transform_300ms_ease-out,visibility_0s_linear_300ms]",
      )}
    >
      <div className="border-b border-border">
        <Container className="flex h-19.25 items-center justify-between">
          <Wordmark />
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            onClick={() => {
              onClose(true);
            }}
            className="grid size-11 place-items-center rounded-full bg-surface-raised text-fg transition-colors hover:text-accent-text"
          >
            <X aria-hidden size={20} />
          </button>
        </Container>
      </div>

      <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto pt-6">
        <Container>
          <ul>
            {NAV_LINKS.map((link, index) => (
              <li
                key={link.href}
                style={{
                  transitionDelay: open ? `${90 + index * 55}ms` : "0ms",
                }}
                className={cn(
                  "border-b border-border transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0",
                )}
              >
                <a
                  href={link.href}
                  onClick={() => {
                    onClose(false);
                  }}
                  className="flex items-baseline gap-5 py-5 font-display text-[2.75rem] leading-none font-bold text-fg uppercase transition-colors hover:text-accent-text focus-visible:text-accent-text active:text-accent-text"
                >
                  <span className="w-6 text-label font-medium tracking-label text-accent-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* Wrapper keeps the container full-width inside this flex column. */}
      <div className="w-full">
        <Container className="flex items-center justify-between pt-6 pb-8">
          <span className="text-micro tracking-label text-fg-subtle uppercase">
            Theme
          </span>
          <ThemeToggle />
        </Container>
      </div>
    </div>
  );
}
