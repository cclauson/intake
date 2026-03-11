"use client";

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
import DailySummary from "./DailySummary";
import MealCard from "./MealCard";

// ---- Mock data ----

const today = new Date();
const todayStr = today.toISOString().slice(0, 10);

function daysAgo(n: number) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const meals = [
  {
    id: "1",
    loggedAt: `${todayStr}T08:15:00Z`,
    timeOfDay: "breakfast" as const,
    schemaName: null,
    notes: null,
    items: [
      { name: "Oatmeal", quantity: 1, calories: 300, protein: 10, fat: 6, carbs: 54 },
      { name: "Banana", quantity: 1, calories: 105, protein: 1, fat: 0, carbs: 27 },
      { name: "Black coffee", quantity: 1, calories: 5, protein: 0, fat: 0, carbs: 0 },
    ],
  },
  {
    id: "2",
    loggedAt: `${todayStr}T12:30:00Z`,
    timeOfDay: "lunch" as const,
    schemaName: null,
    notes: "From the deli downstairs",
    items: [
      { name: "Turkey sandwich", quantity: 1, calories: 480, protein: 32, fat: 18, carbs: 42 },
      { name: "Side salad", quantity: 1, calories: 90, protein: 3, fat: 5, carbs: 8 },
      { name: "Sparkling water", quantity: 1, calories: 0, protein: 0, fat: 0, carbs: 0 },
    ],
  },
  {
    id: "3",
    loggedAt: `${todayStr}T18:45:00Z`,
    timeOfDay: "dinner" as const,
    schemaName: null,
    notes: null,
    items: [
      { name: "Grilled salmon", quantity: 1, calories: 420, protein: 46, fat: 22, carbs: 0 },
      { name: "Brown rice", quantity: 1, calories: 215, protein: 5, fat: 2, carbs: 45 },
      { name: "Steamed broccoli", quantity: 1, calories: 55, protein: 4, fat: 1, carbs: 11 },
    ],
  },
  {
    id: "4",
    loggedAt: `${todayStr}T15:00:00Z`,
    timeOfDay: "snack" as const,
    schemaName: null,
    notes: null,
    items: [
      { name: "Greek yogurt", quantity: 1, calories: 130, protein: 15, fat: 4, carbs: 7 },
      { name: "Almonds", quantity: null, calories: 160, protein: 6, fat: 14, carbs: 6 },
    ],
  },
];

const totals = {
  calories: meals.reduce((s, m) => s + m.items.reduce((a, i) => a + (i.calories ?? 0), 0), 0),
  protein: meals.reduce((s, m) => s + m.items.reduce((a, i) => a + (i.protein ?? 0), 0), 0),
  fat: meals.reduce((s, m) => s + m.items.reduce((a, i) => a + (i.fat ?? 0), 0), 0),
  carbs: meals.reduce((s, m) => s + m.items.reduce((a, i) => a + (i.carbs ?? 0), 0), 0),
};

const nutritionSeries = [
  { date: daysAgo(6), calories: 1850, protein: 95, fat: 72, carbs: 210 },
  { date: daysAgo(5), calories: 2100, protein: 120, fat: 80, carbs: 230 },
  { date: daysAgo(4), calories: 1720, protein: 105, fat: 65, carbs: 195 },
  { date: daysAgo(3), calories: 2350, protein: 140, fat: 90, carbs: 250 },
  { date: daysAgo(2), calories: 1950, protein: 110, fat: 75, carbs: 220 },
  { date: daysAgo(1), calories: 2200, protein: 130, fat: 85, carbs: 240 },
  { date: daysAgo(0), calories: totals.calories, protein: totals.protein, fat: totals.fat, carbs: totals.carbs },
];

const metrics = [
  {
    id: "weight",
    name: "Weight",
    unit: "lbs",
    entries: [
      { date: daysAgo(0), value: 174.2 },
      { date: daysAgo(1), value: 174.8 },
      { date: daysAgo(3), value: 175.1 },
      { date: daysAgo(5), value: 175.5 },
      { date: daysAgo(7), value: 176.0 },
      { date: daysAgo(10), value: 176.3 },
      { date: daysAgo(14), value: 177.1 },
    ],
  },
  {
    id: "water",
    name: "Water",
    unit: "glasses",
    entries: [
      { date: daysAgo(0), value: 6 },
      { date: daysAgo(1), value: 8 },
      { date: daysAgo(2), value: 7 },
      { date: daysAgo(3), value: 5 },
      { date: daysAgo(4), value: 8 },
    ],
  },
];

// ---- Chart helpers ----

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDay(date: string) {
  const d = new Date(date + "T12:00:00Z");
  return DAY_NAMES[d.getUTCDay()];
}

function makeTicks(step: number, max: number): number[] {
  const ticks: number[] = [];
  for (let v = step; v <= max; v += step) ticks.push(v);
  return ticks;
}

const tooltipStyle = { fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" };

// ---- Sub-components ----

function NutritionCharts() {
  const chartData = nutritionSeries.map((d) => ({ ...d, label: formatDay(d.date) }));

  const maxCal = Math.max(...chartData.map((d) => d.calories));
  const calCeil = Math.max(Math.ceil((maxCal * 1.1) / 500) * 500, 500);
  const calTicks = makeTicks(500, calCeil);

  const maxPro = Math.max(...chartData.map((d) => d.protein));
  const proCeil = Math.max(Math.ceil((maxPro * 1.1) / 50) * 50, 50);
  const proTicks = makeTicks(50, proCeil);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Calories (7 days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, calCeil]} ticks={calTicks} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={45} />
            <Tooltip contentStyle={tooltipStyle} />
            {calTicks.map((t) => <ReferenceLine key={t} y={t} stroke="#e5e7eb" strokeDasharray="3 3" />)}
            <Line type="monotone" dataKey="calories" stroke="#14b8a6" strokeWidth={2} dot={false} name="Calories (kcal)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Protein (7 days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, proCeil]} ticks={proTicks} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={35} />
            <Tooltip contentStyle={tooltipStyle} />
            {proTicks.map((t) => <ReferenceLine key={t} y={t} stroke="#e5e7eb" strokeDasharray="3 3" />)}
            <Line type="monotone" dataKey="protein" stroke="#6b7280" strokeWidth={2} dot={false} name="Protein (g)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricChartPreview({ metric }: { metric: typeof metrics[0] }) {
  const entryMap = new Map(metric.entries.map((e) => [e.date, e.value]));

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

  const latest = metric.entries[0];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-baseline gap-2 mb-4">
        <h3 className="text-sm font-medium text-gray-900">{metric.name} (7 days)</h3>
        <span className="text-xs text-gray-400">{metric.unit}</span>
        {latest && <span className="text-sm font-semibold text-gray-900 ml-auto">{latest.value}</span>}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={45} />
          <Tooltip formatter={(v: unknown) => `${v} ${metric.unit}`} contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} connectNulls name={metric.name} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---- Full page ----

export default function DashboardPreview() {
  const todayLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-semibold text-accent-700 tracking-tight">Intake</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Jane Doe</span>
            <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Sign out</button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Today</h1>
          <p className="text-sm text-gray-400 mt-1">{todayLabel}</p>
        </div>

        <DailySummary totals={totals} />

        <div className="mt-6">
          <NutritionCharts />
        </div>

        <div className="mt-8 space-y-4">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Metrics</h2>
          <div className="space-y-4">
            {metrics.map((m) => (
              <MetricChartPreview key={m.id} metric={m} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
