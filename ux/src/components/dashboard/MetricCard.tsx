"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
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

function NumericSparkline({
  entries,
  unit,
}: {
  entries: MetricEntry[];
  unit: string | null;
}) {
  // Build a 7-day window with day-of-week labels, matching the nutrition charts
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

  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis domain={["dataMin", "dataMax"]} hide />
        <Tooltip
          formatter={(v: unknown) => `${v}${unit ? ` ${unit}` : ""}`}
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
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function MetricCard({ metric }: { metric: Metric }) {
  const isNumeric = metric.type !== "checkin";
  const latest = metric.entries[0];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
        {metric.unit && (
          <span className="text-xs text-gray-400">{metric.unit}</span>
        )}
      </div>
      {metric.entries.length === 0 ? (
        <p className="text-xs text-gray-400">No entries yet.</p>
      ) : isNumeric ? (
        <>
          <p className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
            {latest?.value ?? "-"}
          </p>
          {metric.entries.length > 1 && (
            <NumericSparkline entries={metric.entries} unit={metric.unit} />
          )}
        </>
      ) : (
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
      )}
    </div>
  );
}
