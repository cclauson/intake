"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useApiFetch } from "../../lib/useApiFetch";

interface DayPoint {
  date: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface NutritionHistoryResponse {
  days: number;
  series: DayPoint[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDay(date: string) {
  const d = new Date(date + "T12:00:00Z");
  return DAY_NAMES[d.getUTCDay()];
}

export function NutritionChartSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-4" />
      <div className="h-[200px] bg-gray-50 rounded animate-pulse" />
    </div>
  );
}

function makeTicks(step: number, max: number): number[] {
  const ticks: number[] = [];
  for (let v = step; v <= max; v += step) ticks.push(v);
  return ticks;
}

export default function NutritionChart() {
  const { apiFetch } = useApiFetch();
  const [data, setData] = useState<NutritionHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<NutritionHistoryResponse>("/api/dashboard/nutrition-history?days=7")
      .then(setData)
      .catch((e) => setError(e.message ?? "Failed to load nutrition history"))
      .finally(() => setLoading(false));
  }, [apiFetch]);

  if (loading) return <NutritionChartSkeleton />;

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <p className="text-sm text-red-500">Error loading nutrition data: {error}</p>
      </div>
    );
  }

  const hasData = data?.series.some((d) => d.calories > 0 || d.protein > 0);
  if (!data || !hasData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-2">7-Day Trend</h3>
        <p className="text-xs text-gray-400">No nutrition data in the past 7 days.</p>
      </div>
    );
  }

  const chartData = data.series.map((d) => ({
    ...d,
    label: formatDay(d.date),
  }));

  const maxCalories = Math.max(...chartData.map((d) => d.calories));
  const calorieCeil = Math.max(Math.ceil((maxCalories * 1.1) / 500) * 500, 500);
  const calorieDomain: [number, number] = [0, calorieCeil];
  const calorieTicks = makeTicks(500, calorieCeil);

  const maxProtein = Math.max(...chartData.map((d) => d.protein));
  const proteinCeil = Math.max(Math.ceil((maxProtein * 1.1) / 50) * 50, 50);
  const proteinDomain: [number, number] = [0, proteinCeil];
  const proteinTicks = makeTicks(50, proteinCeil);

  const tooltipStyle = {
    fontSize: 12,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  };

  return (
    <div className="space-y-4">
      {/* Calories chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Calories (7 days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={calorieDomain}
              ticks={calorieTicks}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip contentStyle={tooltipStyle} />
            {calorieTicks.map((t) => (
              <ReferenceLine
                key={t}
                y={t}
                stroke="#e5e7eb"
                strokeDasharray="3 3"
              />
            ))}
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={false}
              name="Calories (kcal)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Protein chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Protein (7 days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={proteinDomain}
              ticks={proteinTicks}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip contentStyle={tooltipStyle} />
            {proteinTicks.map((t) => (
              <ReferenceLine
                key={t}
                y={t}
                stroke="#e5e7eb"
                strokeDasharray="3 3"
              />
            ))}
            <Line
              type="monotone"
              dataKey="protein"
              stroke="#6b7280"
              strokeWidth={2}
              dot={false}
              name="Protein (g)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
