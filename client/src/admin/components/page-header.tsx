import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Buttons or links shown beside the title (stacked below it on mobile). */
  actions?: ReactNode;
}

/** The one <h1> of an admin page. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-h3 font-bold text-fg uppercase lg:text-h2">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-body text-fg-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
