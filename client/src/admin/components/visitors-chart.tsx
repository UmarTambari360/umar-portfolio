import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface BarDatum {
  label: string;
  value: number;
}

interface VisitorsChartProps {
  data: BarDatum[];
  /** One-sentence summary read by screen readers. */
  summary: string;
  /** What a bar counts, e.g. "visitors". Used in the data table. */
  unit: string;
  caption: string;
}

/** `color` becomes the CSS variable --color-value inside the chart. */
const chartConfig = {
  value: { label: "Visitors", color: "var(--chart-1)" },
} satisfies ChartConfig;

/**
 * shadcn Chart (Recharts) bar chart. Colors come from the --chart-* tokens, so
 * it follows light/dark automatically.
 *
 * Accessibility: Recharts' accessibilityLayer makes the bars keyboard
 * navigable, the summary is a visually-hidden caption, and the exact numbers
 * are also available as a visually-hidden table.
 */
export function VisitorsChart({
  data,
  summary,
  unit,
  caption,
}: VisitorsChartProps) {
  return (
    <figure>
      <figcaption className="sr-only">{summary}</figcaption>
      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            width={32}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ChartContainer>

      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">{unit}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.label}>
              <th scope="row">{item.label}</th>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
