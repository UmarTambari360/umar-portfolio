import { ArrowUpRight } from "lucide-react";
import { FOOTER_NOTE } from "@/content/home";
import { getSocialLinks } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/ui/wordmark";
import { buttonClasses } from "@/components/ui/button-styles";

export function Footer() {
  const links = getSocialLinks();

  return (
    <footer className="mt-14 border-t border-border">
      <Container className="grid items-center gap-6 py-7 md:grid-cols-[1fr_auto_1fr]">
        <Wordmark size="sm" />
        <p className="text-micro tracking-label text-fg-muted uppercase">
          {FOOTER_NOTE} © {new Date().getFullYear()}
        </p>
        {links.length > 0 ? (
          <nav aria-label="Social" className="md:justify-self-end">
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
