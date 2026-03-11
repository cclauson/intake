"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MetricEntry {
  date: string;
  value: number | null;
  timestamp: string;
}

interface Metric {
  id: string;
  name: string;
  unit: string | null;
  type: string;
  entries: MetricEntry[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDay(date: string) {
  const d = new Date(date + "T12:00:00Z");
  return DAY_NAMES[d.getUTCDay()];
}

function NumericChart({
  entries,
  name,
  unit,
}: {
  entries: MetricEntry[];
  name: string;
  unit: string | null;
}) {
  const today = new Date();
  today.setUTCHours(12, 0, 0, 0);
  const entryMap = new Map(entries.map((e) => [e.date, e.value ?? 0]));

  const data: { label: string; value: number | null }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    data.push({
      label: formatDay(dateStr),
      value: entryMap.has(dateStr) ? entryMap.get(dateStr)! : null,
    });
  }

  const values = data.map((d) => d.value).filter((v): v is number => v !== null);
  const latest = entries[0]?.value;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-baseline gap-2 mb-4">
        <h3 className="text-sm font-medium text-gray-900">
          {name} (7 days)
        </h3>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
        {latest != null && (
          <span className="text-sm font-semibold text-gray-900 ml-auto">
            {latest}
          </span>
        )}
      </div>
      {values.length > 1 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={["dataMin - 1", "dataMax + 1"]}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip
              formatter={(v: unknown) =>
                `${v}${unit ? ` ${unit}` : ""}`
              }
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
              name={name}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-xs text-gray-400">Not enough data to chart.</p>
      )}
    </div>
  );
}

export default function MetricCard({ metric }: { metric: Metric }) {
  const isNumeric = metric.type !== "checkin";

  if (metric.entries.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-3">{metric.name}</h3>
        <p className="text-xs text-gray-400">No entries yet.</p>
      </div>
    );
  }

  if (isNumeric) {
    return (
      <NumericChart
        entries={metric.entries}
        name={metric.name}
        unit={metric.unit}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{metric.name}</h3>
      <ul className="space-y-1">
        {metric.entries.slice(0, 5).map((entry, i) => (
          <li
            key={i}
            className="flex items-baseline justify-between text-sm"
          >
            <span className="text-gray-400 tabular-nums">{entry.date}</span>
            <span className="text-gray-700 font-medium tabular-nums">
              done
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
