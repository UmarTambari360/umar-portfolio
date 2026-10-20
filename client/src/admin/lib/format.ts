const NUMBER_FORMAT = new Intl.NumberFormat("en-GB");

const DAY_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatCount(value: number): string {
  return NUMBER_FORMAT.format(value);
}

/** "2026-10-20" -> "20 Oct". The API sends UTC dates, so format them as UTC. */
export function formatDay(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? isoDate : DAY_FORMAT.format(date);
}

/** "https://www.t.co" -> "t.co" */
export function formatReferrer(referrer: string): string {
  try {
    return new URL(referrer).host.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

/** Safe message for toasts and error panels. */
export function errorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Something went wrong";
}

