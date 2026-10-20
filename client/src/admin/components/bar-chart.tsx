import { formatCount } from "@/admin/lib/format";

export interface BarDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: readonly BarDatum[];
  /** One-sentence summary read by screen readers instead of the drawing. */
  summary: string;
  /** What a bar counts, e.g. "visitors". Used in tooltips and the data table. */
  unit: string;
  caption: string;
}

const WIDTH = 640;
const HEIGHT = 200;
const PAD = { top: 10, right: 4, bottom: 26, left: 30 } as const;

/** Rounds the axis top up to a multiple of 4 so the 3 gridlines are whole numbers. */
function axisTop(max: number): number {
  return max <= 4 ? 4 : Math.ceil(max / 4) * 4;
}

/**
 * A small dependency-free bar chart drawn as SVG (a charting library would be
 * far larger than the one chart this page needs). Colours come from the theme
 * tokens, so it follows light/dark automatically.
 *
 * Accessibility: the drawing is announced as one image with a summary, and the
 * exact numbers are available as a visually-hidden table.
 */
export function BarChart({ data, summary, unit, caption }: BarChartProps) {
  const top = axisTop(Math.max(0, ...data.map((item) => item.value)));
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const slot = data.length > 0 ? plotWidth / data.length : plotWidth;
  const barWidth = Math.max(2, slot * 0.64);

  const yFor = (value: number): number =>
    PAD.top + plotHeight - (value / top) * plotHeight;

  const gridValues = [0, top / 2, top];
  const lastIndex = data.length - 1;
  const labelIndexes = [0, Math.floor(lastIndex / 2), lastIndex];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={summary}
        className="h-auto w-full"
      >
        {gridValues.map((value) => (
          <g key={value}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={yFor(value)}
              y2={yFor(value)}
              strokeWidth={1}
              className="stroke-border"
            />
            <text
              x={PAD.left - 6}
              y={yFor(value) + 3.5}
              textAnchor="end"
              fontSize={10}
              className="fill-fg-subtle"
            >
              {value}
            </text>
          </g>
        ))}

        {data.map((item, index) => {
          const height = plotHeight - (yFor(item.value) - PAD.top);
          return (
            <rect
              key={item.label}
              x={PAD.left + index * slot + (slot - barWidth) / 2}
              y={yFor(item.value)}
              width={barWidth}
              height={Math.max(0, height)}
              rx={1.5}
              className="fill-accent"
            >
              <title>{`${item.label}: ${formatCount(item.value)} ${unit}`}</title>
            </rect>
          );
        })}

        {labelIndexes.map((index, position) => {
          const item = data[index];
          if (!item) return null;
          const anchor =
            position === 0 ? "start" : position === 2 ? "end" : "middle";
          const x =
            position === 0
              ? PAD.left
              : position === 2
                ? WIDTH - PAD.right
                : PAD.left + index * slot + slot / 2;
          return (
            <text
              key={`${item.label}-${position}`}
              x={x}
              y={HEIGHT - 6}
              textAnchor={anchor}
              fontSize={10}
              className="fill-fg-subtle"
            >
              {item.label}
            </text>
          );
        })}
      </svg>

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

