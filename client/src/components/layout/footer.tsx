import { ArrowUpRight }   from "lucide-react";
import { FOOTER_NOTE }    from "@/content/home";
import { getSocialLinks } from "@/config/site";
import { Container }      from "@/components/ui/container";
import { Wordmark }       from "@/components/ui/wordmark";
import { buttonClasses }  from "@/components/ui/button-styles";

/**
 * Mobile: wordmark, note and links stacked. Tablet: wordmark + note on one
 * row, links on the next. Desktop: three columns (left, centre, right).
 */
export function Footer() {
  const links = getSocialLinks();

  return (
    <footer className="mt-12.5 border-t border-border md:mt-17.5 lg:mt-14">
      <Container className="flex flex-col items-start gap-2.5 pt-4 pb-8 md:flex-row md:flex-wrap md:items-center md:gap-x-9 md:gap-y-2 md:pt-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:py-7">
        <Wordmark size="sm" />
        <p className="text-micro tracking-label text-fg-muted uppercase">
          {FOOTER_NOTE} © {new Date().getFullYear()}
        </p>
        {links.length > 0 ? (
          <nav
            aria-label="Social"
            className="md:basis-full lg:basis-auto lg:justify-self-end"
          >
            <ul className="flex items-center gap-5">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={buttonClasses("ghost")}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                    {link.external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                    <ArrowUpRight aria-hidden size={11} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <span aria-hidden />
        )}
      </Container>
    </footer>
  );
}
