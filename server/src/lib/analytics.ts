import { createHmac } from 'crypto';
import { count, gte, sql, eq, desc, isNotNull } from 'drizzle-orm';
import { db } from '../db/index.js';
import { pageViews } from '../db/schema/analytics.js';
import { projects } from '../db/schema/projects.js';
import { env } from './env.js';
import { redis } from './redis.js';

export interface TrackPageViewOptions {
  ip: string;
  userAgent?: string;
  referrer?: string;
  projectClicked?: string;
}

export interface TrackResult {
  tracked: boolean;
  deduplicated: boolean;
}

export interface AnalyticsStats {
  totalVisitors: number;
  visitorsThisWeek: number;
  visitorsThisMonth: number;
  /** One entry per day for the last 30 days (UTC), oldest first, zero-filled. */
  dailyStats: Array<{
    date: string;
    views: number;
  }>;
  topProjects: Array<{
    projectId: string;
    projectName: string;
    clickCount: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    count: number;
  }>;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_WINDOW_DAYS = 30;
const WEEK_WINDOW_DAYS = 7;

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Midnight UTC, `daysAgo` days before today (0 = today). */
function startOfUtcDay(daysAgo: number): Date {
  const now = new Date();
  const midnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  return new Date(midnight - daysAgo * DAY_MS);
}

/**
 * Keyed hash of IP + day. The secret (ANALYTICS_SALT) is the important part:
 * a plain SHA-256 of an IPv4 address can be reversed by trying all ~4 billion
 * addresses; an HMAC cannot be without the secret. Including the date means a
 * visitor cannot be linked from one day to the next.
 */
export function hashIp(ip: string, dateStr: string = toDateString(new Date())): string {
  return createHmac('sha256', env.ANALYTICS_SALT)
    .update(`${ip}|${dateStr}`)
    .digest('hex');
}

/** A click on a project that was deleted (or never existed) must not break tracking. */
async function existingProjectId(id: string | undefined): Promise<string | null> {
  if (!id) return null;
  const rows = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return rows[0]?.id ?? null;
}

export async function trackPageView(
  options: TrackPageViewOptions,
): Promise<TrackResult> {
  const dateStr = toDateString(new Date());
  const ipHash = hashIp(options.ip, dateStr);
  const redisKey = `visitor:${dateStr}:${ipHash}`;

  // Atomic "claim today's slot": SET ... NX succeeds for exactly one caller, even
  // when two requests from the same visitor arrive at the same instant. (The old
  // EXISTS-then-SET pair left a window where both could pass the check.)
  const claimed = await redis.set(redisKey, '1', 'EX', 86400, 'NX');
  if (claimed !== 'OK') {
    return { tracked: false, deduplicated: true };
  }

  try {
    const projectClicked = await existingProjectId(options.projectClicked);

    await db.insert(pageViews).values({
      ipHash,
      userAgent: options.userAgent?.slice(0, 512) ?? null,
      referrer: options.referrer ?? null,
      projectClicked,
    });
  } catch (error) {
    // Release the slot so a failed insert does not silently lose this visitor's day.
    await redis.del(redisKey).catch(() => undefined);
    throw error;
  }

  return { tracked: true, deduplicated: false };
}

function fillDailyStats(
  rows: Array<{ date: string; views: number }>,
): AnalyticsStats['dailyStats'] {
  const byDate = new Map(rows.map((row) => [row.date, row.views]));
  const filled: AnalyticsStats['dailyStats'] = [];

  for (let daysAgo = DAILY_WINDOW_DAYS - 1; daysAgo >= 0; daysAgo -= 1) {
    const date = toDateString(startOfUtcDay(daysAgo));
    filled.push({ date, views: byDate.get(date) ?? 0 });
  }

  return filled;
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  // Week/month windows line up with the chart: "last 7 / 30 days, including today".
  const weekStart = startOfUtcDay(WEEK_WINDOW_DAYS - 1);
  const monthStart = startOfUtcDay(DAILY_WINDOW_DAYS - 1);
  const dayExpr = sql<string>`TO_CHAR(${pageViews.createdAt}, 'YYYY-MM-DD')`;

  const [
    totalRows,
    weekRows,
    monthRows,
    dailyRows,
    topProjectRows,
    topReferrerRows,
  ] = await Promise.all([
    db.select({ value: count() }).from(pageViews),
    db
      .select({ value: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, weekStart)),
    db
      .select({ value: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, monthStart)),
    db
      .select({ date: dayExpr, views: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, monthStart))
      .groupBy(dayExpr)
      .orderBy(dayExpr),
    db
      .select({
        projectId: pageViews.projectClicked,
        projectName: projects.name,
        clickCount: count(),
      })
      .from(pageViews)
      .innerJoin(projects, eq(pageViews.projectClicked, projects.id))
      .where(isNotNull(pageViews.projectClicked))
      .groupBy(pageViews.projectClicked, projects.name)
      .orderBy(desc(count()))
      .limit(5),
    db
      .select({ referrer: pageViews.referrer, count: count() })
      .from(pageViews)
      .where(isNotNull(pageViews.referrer))
      .groupBy(pageViews.referrer)
      .orderBy(desc(count()))
      .limit(10),
  ]);

  return {
    totalVisitors: Number(totalRows[0]?.value ?? 0),
    visitorsThisWeek: Number(weekRows[0]?.value ?? 0),
    visitorsThisMonth: Number(monthRows[0]?.value ?? 0),
    dailyStats: fillDailyStats(
      dailyRows.map((row) => ({ date: row.date, views: Number(row.views) })),
    ),
    topProjects: topProjectRows.flatMap((row) =>
      row.projectId === null
        ? []
        : [
            {
              projectId: row.projectId,
              projectName: row.projectName,
              clickCount: Number(row.clickCount),
            },
          ],
    ),
    topReferrers: topReferrerRows.flatMap((row) =>
      row.referrer === null
        ? []
        : [{ referrer: row.referrer, count: Number(row.count) }],
    ),
  };
}

