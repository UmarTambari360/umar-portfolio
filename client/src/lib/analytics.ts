import { apiPost } from "@/lib/api";

/*
  Privacy-first visit tracking for POST /api/analytics/track.

  How the server behaves (server/src/lib/analytics.ts):
  - It stores ONE row per visitor per day (hash of IP + date) and silently
    drops every later ping from that visitor.
  - That row can carry a `projectClicked`, but only if it is in the FIRST ping.

  So a ping on page load would "use up" the visitor's row for the day and every
  project click after it would be lost. Instead the client sends exactly ONE
  ping per page visit, at the moment it has the most to report:
    1. the visitor clicks a project link   -> ping now, with `projectClicked`
    2. otherwise, the visitor leaves/hides  -> ping then (page view only)

  Nothing is stored in the browser (no cookies, no localStorage). Tracking is
  skipped when Do Not Track / Global Privacy Control is on, and in development
  unless VITE_ENABLE_ANALYTICS=true.
*/

const TRACK_PATH = "/analytics/track";

// Loose 8-4-4-4-12 hex check. The server casts the body without validating it,
// and an invalid id would make Postgres throw *after* the day's slot is taken.
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface TrackPayload {
  referrer?: string;
  projectClicked?: string;
}

/** The one ping for this page visit has been sent (or tracking is off). */
let pingSent = false;
let enabled: boolean | undefined;

function isEnabled(): boolean {
  if (enabled !== undefined) return enabled;

  const allowedHere =
    import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === "true";
  const globalPrivacyControl =
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true;
  const doNotTrack =
    navigator.doNotTrack === "1" || navigator.doNotTrack === "yes";

  enabled = allowedHere && !globalPrivacyControl && !doNotTrack;
  return enabled;
}

/**
 * Where the visitor came from, reduced to an origin ("https://t.co").
 * Same-origin referrers (reloads, in-site navigation) are not interesting.
 */
function readReferrer(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const { origin } = new URL(document.referrer);
    return origin === window.location.origin ? undefined : origin;
  } catch {
    return undefined;
  }
}

function sendPing(projectId?: string): void {
  if (pingSent) return;
  pingSent = true;

  const payload: TrackPayload = {};
  const referrer = readReferrer();
  if (referrer) payload.referrer = referrer;
  if (projectId && UUID_PATTERN.test(projectId)) {
    payload.projectClicked = projectId;
  }

  // Fire and forget: analytics must never affect, slow or break the page.
  apiPost(TRACK_PATH, payload, { keepalive: true }).catch(() => undefined);
}

/**
 * Registers the "visitor left" listeners. Returns a cleanup function.
 * `visibilitychange` is the reliable signal on mobile (tab switch, app switch);
 * `pagehide` covers closing/navigating away on desktop.
 */
export function startVisitTracking(): () => void {
  if (!isEnabled()) return () => undefined;

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") sendPing();
  };
  const onPageHide = () => {
    sendPing();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", onPageHide);

  return () => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", onPageHide);
  };
}

/** Call when a visitor follows a project's live/source link. First click wins. */
export function trackProjectClick(projectId: string): void {
  if (!isEnabled()) return;
  sendPing(projectId);
}