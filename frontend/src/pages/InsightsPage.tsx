import {
  BarChart3,
  BrainCircuit,
  ScanSearch,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "../services/api";
import type { Analysis } from "../types/analysis";

const PIE_COLOURS = [
  "#ef4444",
  "#fbbf24",
  "#2dd4bf",
];

export default function InsightsPage() {
  const { data = [], isLoading } =
    useQuery({
      queryKey: ["analyses"],
      queryFn: async () => {
        const response =
          await api.get<Analysis[]>(
            "/api/v1/analyses",
          );

        return response.data;
      },
    });

  const riskData = useMemo(() => {
    const levels = [
      "HIGH",
      "MEDIUM",
      "LOW",
    ];

    return levels.map((level) => ({
      name: level,
      value: data.filter(
        (item) =>
          item.risk_level === level,
      ).length,
    }));
  }, [data]);

  const classData = useMemo(() => {
    const counts = new Map<
      string,
      number
    >();

    data.forEach((analysis) => {
      analysis.detections.forEach(
        (detection: Analysis['detections'][number]) => {
          counts.set(
            detection.label,
            (counts.get(
              detection.label,
            ) ?? 0) + 1,
          );
        },
      );
    });

    return [...counts.entries()]
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort(
        (a, b) =>
          b.count - a.count,
      )
      .slice(0, 8);
  }, [data]);

  const totalDetections = data.reduce(
    (sum, analysis) =>
      sum +
      analysis.detections.length,
    0,
  );

  const averageRisk =
    data.length > 0
      ? data.reduce(
          (sum, analysis) =>
            sum +
            analysis.risk_score,
          0,
        ) / data.length
      : 0;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="h-72 animate-pulse rounded-[2.5rem] bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
        <Sparkles size={15} />
        Insights
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
        <h1 className="text-5xl font-black tracking-[-0.05em] sm:text-6xl">
          Patterns behind
          <span className="block text-zinc-400">
            every analysis.
          </span>
        </h1>

        <p className="leading-7 text-zinc-500 dark:text-zinc-400">
          These insights are calculated from
          analyses currently stored in the
          application database.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="rounded-[2rem] bg-zinc-950 p-7 text-white">
          <ScanSearch
            className="text-amber-300"
            size={24}
          />

          <p className="mt-8 text-4xl font-black">
            {data.length}
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Completed analyses
          </p>
        </div>

        <div className="rounded-[2rem] bg-amber-200 p-7 text-zinc-950">
          <TrendingUp size={24} />

          <p className="mt-8 text-4xl font-black">
            {averageRisk.toFixed(2)}
          </p>

          <p className="mt-2 text-sm font-semibold">
            Average risk score
          </p>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900">
          <BrainCircuit size={24} />

          <p className="mt-8 text-4xl font-black">
            {totalDetections}
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Total detections
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[2.3rem] border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                Risk distribution
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Analysis outcomes
              </h2>
            </div>

            <BarChart3 size={22} />
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {riskData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          PIE_COLOURS[
                            index
                          ]
                        }
                      />
                    ),
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-5">
            {riskData.map(
              (item, index) => (
                <div
                  key={item.name}
                  className="text-center"
                >
                  <div
                    className="mx-auto h-2.5 w-2.5 rounded-full"
                    style={{
                      background:
                        PIE_COLOURS[
                          index
                        ],
                    }}
                  />

                  <p className="mt-2 text-xs font-bold">
                    {item.name}
                  </p>

                  <p className="text-sm text-zinc-400">
                    {item.value}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="rounded-[2.3rem] border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Detection frequency
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Most observed classes
          </h2>

          <div className="mt-8 h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={classData}
                layout="vertical"
                margin={{
                  left: 25,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  opacity={0.2}
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#fbbf24"
                  radius={[
                    0,
                    8,
                    8,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[2.3rem] bg-zinc-950 p-8 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
          Interpretation
        </p>

        <h2 className="mt-4 max-w-3xl text-3xl font-black">
          Analytics become more meaningful
          as the scan library grows.
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
          These charts are derived from real
          application history, not fabricated live
          telemetry. Early datasets may contain only
          a small number of scans.
        </p>
      </section>
    </div>
  );
}
