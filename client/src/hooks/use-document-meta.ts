import { useEffect } from "react";

/**
 * Sets the tab title and meta description while a page is mounted, and puts the
 * originals back on leave. Pass `null` while the data is still loading.
 *
 * Note: this runs in the browser, so crawlers that execute JavaScript (Google)
 * see it, but link-preview bots (WhatsApp, X, LinkedIn) read only the static
 * index.html and will show the homepage card for any project URL.
 */
export function useDocumentMeta(
  title: string | null,
  description: string | null,
): void {
  useEffect(() => {
    if (title === null) return;

    const previousTitle = document.title;
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const previousDescription = meta?.content ?? null;

    document.title = title;
    if (meta && description) meta.content = description;

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== null) {
        meta.content = previousDescription;
      }
    };
  }, [title, description]);
}

