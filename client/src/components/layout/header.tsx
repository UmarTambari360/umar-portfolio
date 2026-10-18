import { NAV_LINKS } from "@/content/home";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Wordmark } from "@/components/ui/wordmark";

/**
 * NOTE: below `md` the nav links are hidden and there is no menu button yet;
 * the mobile/tablet header is built in the responsive stage.
 */
export function Header() {
  return (
    <header className="border-b border-border">
      <Container className="flex h-24 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
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
        <div className="md:justify-self-end">
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
