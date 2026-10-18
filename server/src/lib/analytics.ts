import { createHash } from 'crypto';
import { count, gte, sql, eq, desc, isNotNull } from 'drizzle-orm';
import { db } from '../db/index.js';
import { pageViews } from '../db/schema/analytics.js';
import { projects } from '../db/schema/projects.js';
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

export function hashIp(ip: string): string {
  const dateStr = new Date().toISOString().split('T')[0] ?? '';
  return createHash('sha256')
    .update(`${ip}-${dateStr}`)
    .digest('hex');
}

export async function trackPageView(
  options: TrackPageViewOptions
): Promise<TrackResult> {
  const dateStr = new Date().toISOString().split('T')[0] ?? '';
  const ipHash = hashIp(options.ip);
  const redisKey = `visitor:${dateStr}:${ipHash}`;

  const exists = await redis.exists(redisKey);

  if (exists === 1) {
    return { tracked: false, deduplicated: true };
  }

  await redis.set(redisKey, '1', 'EX', 86400);

  await db.insert(pageViews).values({
    ipHash,
    userAgent: options.userAgent ?? null,
    referrer: options.referrer ?? null,
    projectClicked: options.projectClicked ?? null,
  });

  return { tracked: true, deduplicated: false };
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalResult] = await db.select({ value: count() }).from(pageViews);
  const totalVisitors = Number(totalResult?.value ?? 0);

  const [weekResult] = await db
    .select({ value: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, sevenDaysAgo));
  const visitorsThisWeek = Number(weekResult?.value ?? 0);

  const [monthResult] = await db
    .select({ value: count() })
    .from(pageViews)
    .where(gte(pageViews.createdAt, thirtyDaysAgo));
  const visitorsThisMonth = Number(monthResult?.value ?? 0);

  const dailyStatsRaw = await db
    .select({
      date: sql<string>`TO_CHAR(${pageViews.createdAt}, 'YYYY-MM-DD')`,
      views: count(),
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, thirtyDaysAgo))
    .groupBy(sql`TO_CHAR(${pageViews.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(${pageViews.createdAt}, 'YYYY-MM-DD')`);

  const dailyStats = dailyStatsRaw.map((row) => ({
    date: row.date,
    views: Number(row.views),
  }));

  const topProjectsRaw = await db
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
    .limit(3);

  const topProjects = topProjectsRaw.map((row) => ({
    projectId: row.projectId as string,
    projectName: row.projectName,
    clickCount: Number(row.clickCount),
  }));

  const topReferrersRaw = await db
    .select({
      referrer: pageViews.referrer,
      count: count(),
    })
    .from(pageViews)
    .where(isNotNull(pageViews.referrer))
    .groupBy(pageViews.referrer)
    .orderBy(desc(count()))
    .limit(10);

  const topReferrers = topReferrersRaw.map((row) => ({
    referrer: row.referrer as string,
    count: Number(row.count),
  }));

  return {
    totalVisitors,
    visitorsThisWeek,
    visitorsThisMonth,
    dailyStats,
    topProjects,
    topReferrers,
  };
}