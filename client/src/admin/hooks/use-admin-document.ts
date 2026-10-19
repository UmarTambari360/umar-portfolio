import { useEffect } from "react";

/**
 * Keeps admin pages out of search results and sets their tab title.
 *
 * This is the backup layer: it only exists once the admin chunk has run. The
 * primary layer is an `X-Robots-Tag: noindex` header on `/admin*` from the
 * host, because crawlers that do not execute JavaScript never see this tag.
 * (Do not also add a robots.txt Disallow: it stops crawlers from reading the
 * header.) Restores the previous title when the admin is left.
 */
export function useAdminDocument(title: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    document.title = title;

    return () => {
      robots.remove();
      document.title = previousTitle;
    };
  }, [title]);
}