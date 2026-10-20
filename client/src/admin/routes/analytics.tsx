import { RefreshCw } from "lucide-react";
import { BarChart } from "@/admin/components/bar-chart";
import { Button } from "@/admin/components/button";
import { PageHeader } from "@/admin/components/page-header";
import { Skeleton } from "@/admin/components/skeleton";
import { StatePanel } from "@/admin/components/state-panel";
import { useAdminDocument } from "@/admin/hooks/use-admin-document";
import { useAnalyticsStats } from "@/admin/hooks/use-analytics-stats";
import { formatCount, formatDay, formatReferrer } from "@/admin/lib/format";
import type { AnalyticsStats } from "@/types/api";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card bg-surface p-6">
      <dt className="text-micro font-bold tracking-label text-fg-muted uppercase">
        {label}
      </dt>
      <dd className="mt-3 font-display text-h3 font-bold text-fg">
        {formatCount(value)}
      </dd>
    </div>
  );
}

interface RankedItem {
  key: string;
  label: string;
  count: number;
}

/** A ranked list with proportional bars. Renders nothing but the list or an empty note. */
function RankedList({
  title,
  items,
  emptyText,
  countLabel,
}: {
  title: string;
  items: readonly RankedItem[];
  emptyText: string;
  countLabel: string;
}) {
  const highest = Math.max(1, ...items.map((item) => item.count));

  return (
    <section className="rounded-card bg-surface p-6 md:p-8">
      <h2 className="font-display text-title font-bold text-fg">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-caption text-fg-muted">{emptyText}</p>
      ) : (
        <ol className="mt-6 grid gap-5">
          {items.map((item) => (
            <li key={item.key}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="min-w-0 truncate text-body text-fg">
                  {item.label}
                </span>
                <span className="shrink-0 text-caption text-fg-muted">
                  {formatCount(item.count)}
                  <span className="sr-only"> {countLabel}</span>
                </span>
              </div>
              <div
                aria-hidden
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-raised"
              >
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(item.count / highest) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Dashboard({ stats }: { stats: AnalyticsStats }) {
  const chartData = stats.dailyStats.map((day) => ({
    label: formatDay(day.date),
    value: day.views,
  }));

  if (stats.totalVisitors === 0) {
    return (
      <StatePanel
        tone="empty"
        title="No visits recorded yet."
        description="Tracking is off while developing (set VITE_ENABLE_ANALYTICS=true to test it) and for visitors who send Do Not Track or Global Privacy Control. Once the site is live, visits appear here."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <dl className="grid gap-6 md:grid-cols-3">
        <StatCard label="All time" value={stats.totalVisitors} />
        <StatCard label="Last 7 days" value={stats.visitorsThisWeek} />
        <StatCard label="Last 30 days" value={stats.visitorsThisMonth} />
      </dl>

      <section className="rounded-card bg-surface p-6 md:p-8">
        <h2 className="font-display text-title font-bold text-fg">
          Visitors per day
        </h2>
        <p className="mt-2 text-caption text-fg-muted">
          Last 30 days. Each person counts once per day, and no cookies or
          personal data are stored.
        </p>
        <div className="mt-6">
          <BarChart
            data={chartData}
            unit="visitors"
            caption="Visitors per day for the last 30 days"
            summary={`Bar chart of daily visitors over the last 30 days: ${formatCount(stats.visitorsThisMonth)} in total.`}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <RankedList
          title="Top projects"
          countLabel="clicks"
          emptyText="No one has clicked a project’s live or source link yet."
          items={stats.topProjects.map((project) => ({
            key: project.projectId,
            label: project.projectName,
            count: project.clickCount,
          }))}
        />
        <RankedList
          title="Where visitors come from"
          countLabel="visitors"
          emptyText="No referrers yet. Direct visits and same-site navigation aren’t listed."
          items={stats.topReferrers.map((entry) => ({
            key: entry.referrer,
            label: formatReferrer(entry.referrer),
            count: entry.count,
          }))}
        />
      </div>
    </div>
  );
}

export function Component() {
  useAdminDocument("Analytics · Admin");
  const { state, refresh } = useAnalyticsStats();

  const refreshing = state.status === "success" && state.refreshing;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Visitors, top projects and where people come from."
        actions={
          state.status === "success" ? (
            <Button
              variant="secondary"
              loading={refreshing}
              icon={<RefreshCw aria-hidden size={14} />}
              onClick={refresh}
            >
              Refresh
            </Button>
          ) : undefined
        }
      />

      <div className="mt-10">
        {state.status === "loading" ? (
          <div role="status" className="grid gap-6">
            <span className="sr-only">Loading analytics</span>
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-72" />
          </div>
        ) : null}

        {state.status === "error" ? (
          <StatePanel
            tone="error"
            title="Couldn’t load analytics."
            description={state.message}
            action={<Button onClick={refresh}>Try again</Button>}
          />
        ) : null}

        {state.status === "success" ? <Dashboard stats={state.stats} /> : null}
      </div>
    </>
  );
}

