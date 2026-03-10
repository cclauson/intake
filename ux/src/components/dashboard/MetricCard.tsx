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

function NumericSparkline({
  entries,
  unit,
}: {
  entries: MetricEntry[];
  unit: string | null;
}) {
  const ascending = [...entries].reverse();
  const data = ascending.map((e) => ({
    ts: new Date(e.date + "T12:00:00Z").getTime(),
    date: e.date,
    value: e.value ?? 0,
  }));

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  };

  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <XAxis
          dataKey="ts"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={formatDate}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis domain={["dataMin", "dataMax"]} hide />
        <Tooltip
          formatter={(v: unknown) => `${v}${unit ? ` ${unit}` : ""}`}
          labelFormatter={(ts) => formatDate(ts as number)}
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
