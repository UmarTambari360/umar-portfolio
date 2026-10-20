import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, ScrollRestoration, useParams } from "react-router-dom";
import { Footer } from "@/components/layout/footer";
import { ProjectCover } from "@/components/sections/project-cover";
import { buttonClasses } from "@/components/ui/button-styles";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LinkButton } from "@/components/ui/link-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SITE } from "@/config/site";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { useProject } from "@/hooks/use-project";
import { useVisitTracking } from "@/hooks/use-visit-tracking";
import { trackProjectClick } from "@/lib/analytics";
import { safeExternalUrl, statusLabel } from "@/lib/projects";
import type { Project } from "@/types/api";

const MONTH_YEAR = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatMonthYear(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : MONTH_YEAR.format(date);
}

/** Description is plain text; blank lines separate paragraphs. Never rendered as HTML. */
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

const BACK_LINK_CLASSES = buttonClasses("ghost");

function BackLink() {
  return (
    <Link to="/#work" className={BACK_LINK_CLASSES}>
      <ArrowLeft aria-hidden size={12} />
      All projects
    </Link>
  );
}

function Detail({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt className="text-micro font-bold tracking-label text-fg-muted uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-body text-fg">{children}</dd>
    </div>
  );
}

function ProjectContent({ project }: { project: Project }) {
  const liveUrl = safeExternalUrl(project.liveUrl);
  const sourceUrl = safeExternalUrl(project.githubUrl);
  const started = formatMonthYear(project.startedAt);
  const shipped = formatMonthYear(project.shippedAt);
  const paragraphs = splitParagraphs(project.description);

  // Counts the first live/source click of the visit (see lib/analytics.ts).
  const recordClick = () => {
    trackProjectClick(project.id);
  };

  return (
    <article>
      <Eyebrow dot>{statusLabel(project.status)}</Eyebrow>
      <h1 className="mt-4 font-display text-h3 font-bold break-words text-fg uppercase lg:text-h2">
        {project.name}
      </h1>
      <p className="mt-5 max-w-2xl text-lead text-fg-muted">{project.tagline}</p>

      <div className="mt-10 overflow-hidden rounded-card">
        <ProjectCover project={project} index={0} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        <div className="grid max-w-2xl gap-5 text-body text-fg-muted">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        <aside aria-label="Project details" className="grid content-start gap-8">
          <dl className="grid gap-5">
            <Detail label="Status">{statusLabel(project.status)}</Detail>
            {started ? <Detail label="Started">{started}</Detail> : null}
            {shipped ? <Detail label="Shipped">{shipped}</Detail> : null}
          </dl>

          {project.stack.length > 0 ? (
            <div>
              <h2 className="text-micro font-bold tracking-label text-fg-muted uppercase">
                Built with
              </h2>
              <ul aria-label="Tech stack" className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </ul>
            </div>
          ) : null}

          {liveUrl || sourceUrl ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {liveUrl ? (
                <LinkButton
                  href={liveUrl}
                  external
                  onClick={recordClick}
                  onAuxClick={recordClick}
                  icon={<ArrowUpRight size={12} />}
                >
                  View live
                </LinkButton>
              ) : null}
              {sourceUrl ? (
                <LinkButton
                  href={sourceUrl}
                  variant="ghost"
                  external
                  onClick={recordClick}
                  onAuxClick={recordClick}
                  icon={<ArrowUpRight size={11} />}
                >
                  Source
                </LinkButton>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}

function LoadingBlocks() {
  return (
    <div role="status" aria-label="Loading project">
      <div className="h-4 w-24 rounded-button bg-surface motion-safe:animate-pulse" />
      <div className="mt-5 h-12 w-2/3 rounded-button bg-surface motion-safe:animate-pulse" />
      <div className="mt-5 h-6 w-full max-w-2xl rounded-button bg-surface motion-safe:animate-pulse" />
      <div className="mt-10 h-66.75 rounded-card bg-surface motion-safe:animate-pulse" />
    </div>
  );
}

function Message({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div role="alert" className="max-w-xl">
      <h1 className="font-display text-h3 font-bold text-fg uppercase">
        {title}
      </h1>
      <p className="mt-4 text-body text-fg-muted">{body}</p>
      <div className="mt-8">{action}</div>
    </div>
  );
}

function ProjectDetailPage({ slug }: { slug: string | undefined }) {
  // A visitor can land straight on a project page, so it counts visits too.
  useVisitTracking();

  const { state, retry } = useProject(slug);
  const project = state.status === "success" ? state.project : null;

  useDocumentMeta(
    project ? `${project.name} · ${SITE.name}` : null,
    project ? project.tagline : null,
  );

  return (
    <div id="top">
      <ScrollRestoration />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-button focus:bg-accent focus:px-4 focus:py-2 focus:text-caption focus:font-bold focus:text-accent-fg"
      >
        Skip to content
      </a>

      <header>
        <Container className="flex h-19.25 items-center justify-between md:h-24">
          <Link
            to="/"
            aria-label={`${SITE.name} — home`}
            className="font-display text-[1.75rem] leading-none font-bold text-accent-text md:text-[2rem]"
          >
            {SITE.wordmark}
          </Link>
          <ThemeToggle />
        </Container>
      </header>

      <main id="main">
        <Container className="pt-6 pb-4 md:pt-10">
          <div className="mb-8">
            <BackLink />
          </div>

          {state.status === "loading" ? <LoadingBlocks /> : null}

          {state.status === "notfound" ? (
            <Message
              title="Project not found"
              body="This project doesn’t exist or was removed."
              action={
                <Link to="/#work" className={buttonClasses("primary")}>
                  See all projects
                </Link>
              }
            />
          ) : null}

          {state.status === "error" ? (
            <Message
              title="Couldn’t load this project"
              body={state.message}
              action={
                <button
                  type="button"
                  onClick={retry}
                  className={buttonClasses("primary")}
                >
                  Try again
                </button>
              }
            />
          ) : null}

          {state.status === "success" ? (
            <ProjectContent project={state.project} />
          ) : null}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export function Component() {
  const { slug } = useParams<{ slug: string }>();

  // `key` gives each slug a fresh page state (loading again, not stale data).
  return <ProjectDetailPage key={slug} slug={slug} />;
}

