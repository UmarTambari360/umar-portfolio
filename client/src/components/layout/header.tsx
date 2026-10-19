import { useState, useRef, useEffect } from "react";
import { Menu }         from "lucide-react";
import { NAV_LINKS }    from "@/content/home";
import { Container }    from "@/components/ui/container";
import { ThemeToggle }  from "@/components/ui/theme-toggle";
import { Wordmark }     from "@/components/ui/wordmark";
import { MobileMenu }   from "@/components/layout/mobile-menu";

export function Header() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu if the viewport expands to desktop width
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpen(false);
      }
    };
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const handleClose = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  };

  return (
    <header className="border-b border-border">
      <Container className="flex h-19.25 items-center justify-between md:h-24 md:grid md:grid-cols-[1fr_auto_1fr]">
        <Wordmark />
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-caption font-medium tracking-[0.04em] text-fg uppercase transition-colors hover:text-accent-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3 md:justify-self-end">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <button
            ref={triggerRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            className="grid size-11 place-items-center rounded-full bg-surface-raised text-fg transition-colors hover:text-accent-text md:hidden"
          >
            <Menu aria-hidden size={20} />
          </button>
        </div>
      </Container>
      <MobileMenu
        id="mobile-menu"
        open={open}
        onClose={handleClose}
        closeButtonRef={closeButtonRef}
      />
    </header>
  );
}
