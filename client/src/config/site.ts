import { safeExternalUrl } from "@/lib/projects";

interface SiteConfig {
  name: string;
  wordmark: string;
  /** Contact address. The CTA and footer "Email" link stay hidden until this is set. */
  email: string;
  /** Full https URL. Hidden until set. */
  github: string;
  /** Full https URL. Hidden until set. */
  linkedin: string;
}

// TODO(umar): fill in your real links. Anything left empty is simply not
// rendered, so there are never buttons that point nowhere.
export const SITE: SiteConfig = {
  name: "Umar Farouq",
  wordmark: "UF.",
  email: "",
  github: "",
  linkedin: "",
};

export interface SocialLink {
  label: string;
  href: string;
  external: boolean;
}

export function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [];

  const github = safeExternalUrl(SITE.github);
  if (github) links.push({ label: "GitHub", href: github, external: true });

  const linkedin = safeExternalUrl(SITE.linkedin);
  if (linkedin) {
    links.push({ label: "LinkedIn", href: linkedin, external: true });
  }

  if (SITE.email) {
    links.push({
      label: "Email",
      href: `mailto:${SITE.email}`,
      external: false,
    });
  }

  return links;
}

export function getContactHref(): string | null {
  return SITE.email ? `mailto:${SITE.email}` : null;
}