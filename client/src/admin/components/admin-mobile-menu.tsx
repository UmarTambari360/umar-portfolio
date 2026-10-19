import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { AccountActions } from "@/admin/components/account-actions";
import { ADMIN_NAV } from "@/admin/nav-items";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Wordmark } from "@/components/ui/wordmark";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cn } from "@/lib/cn";

interface AdminMobileMenuProps {
  id: string;
  open: boolean;
  /** `returnFocus` is false when a link was chosen (focus should follow the navigation). */
  onClose: (returnFocus: boolean) => void;
  /** Receives focus when the menu opens. */
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE = "a[href], button:not([disabled])";

/**
 * Full-screen menu below the lg breakpoint. Same behavior as the public site's
 * mobile menu: focus moves in, Tab is trapped, Escape closes, the page behind
 * does not scroll, and it fades in with no visibility delay on open.
 */
export function AdminMobileMenu({
  id,
  open,
  onClose,
  closeButtonRef,
}: AdminMobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open, closeButtonRef]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

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
      aria-label="Admin menu"
      inert={!open}
      onKeyDown={trapFocus}
      className={cn(
        "fixed inset-0 z-50 flex flex-col overscroll-contain bg-bg motion-reduce:transition-none lg:hidden",
        open
          ? "visible translate-y-0 opacity-100 [transition:opacity_300ms_ease-out,transform_300ms_ease-out,visibility_0s_linear_0s]"
          : "invisible -translate-y-2 opacity-0 [transition:opacity_300ms_ease-out,transform_300ms_ease-out,visibility_0s_linear_300ms]",
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6 md:px-10.5">
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
      </div>

      <nav
        aria-label="Admin"
        className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 md:px-10.5"
      >
        <ul>
          {ADMIN_NAV.map(({ to, label }, index) => (
            <li
              key={to}
              style={{ transitionDelay: open ? `${90 + index * 55}ms` : "0ms" }}
              className={cn(
                "border-b border-border transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <NavLink
                to={to}
                onClick={() => {
                  onClose(false);
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-baseline gap-5 py-5 font-display text-[2.75rem] leading-none font-bold uppercase transition-colors hover:text-accent-text focus-visible:text-accent-text active:text-accent-text",
                    isActive ? "text-accent-text" : "text-fg",
                  )
                }
              >
                <span className="w-6 text-label font-medium tracking-label text-accent-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 space-y-6 px-6 pt-6 pb-8 md:px-10.5">
        <div className="flex items-center justify-between">
          <span className="text-micro tracking-label text-fg-subtle uppercase">
            Theme
          </span>
          <ThemeToggle />
        </div>
        <AccountActions />
      </div>
    </div>
  );
}
