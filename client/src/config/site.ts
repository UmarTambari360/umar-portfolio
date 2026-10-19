import { safeExternalUrl } from "@/lib/projects";

interface SiteConfig {
  name: string;
  wordmark: string;
  email: string;
  github: string;
  linkedin: string;
}

// TODO(umar): fill in your real links. Anything left empty is simply not
// rendered, so there are never buttons that point nowhere.
export const SITE: SiteConfig = {
  name: "Umar Farouq",
  wordmark: "TAMBARI.",
  email: "umarmubay360@gmail.com",
  github: "https://github.com/UmarTambari360",
  linkedin: "https://linkedin.com/in/umar-farouq",
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