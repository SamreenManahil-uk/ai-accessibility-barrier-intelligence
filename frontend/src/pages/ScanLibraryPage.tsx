import {
  Calendar,
  ChevronRight,
  CircleAlert,
  FileImage,
  History,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { api } from "../services/api";
import type { Analysis } from "../types/analysis";

type RiskFilter = "ALL" | "HIGH" | "MEDIUM" | "LOW";

function riskStyle(level: string) {
  if (level === "HIGH") {
    return {
      badge: "bg-red-500 text-white",
      dot: "bg-red-500",
      soft: "bg-red-50 dark:bg-red-500/10",
    };
  }

  if (level === "MEDIUM") {
    return {
      badge: "bg-amber-300 text-zinc-950",
      dot: "bg-amber-400",
      soft: "bg-amber-50 dark:bg-amber-500/10",
    };
  }

  return {
    badge: "bg-teal-300 text-zinc-950",
    dot: "bg-teal-400",
    soft: "bg-teal-50 dark:bg-teal-500/10",
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function ScanLibraryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<RiskFilter>("ALL");

  const [selected, setSelected] =
    useState<Analysis | null>(null);

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["analyses"],
    queryFn: async () => {
      const response = await api.get<Analysis[]>(
        "/api/v1/analyses",
      );

      return response.data;
    },
  });

  const filtered = useMemo(() => {
    return data.filter((analysis) => {
      const matchesSearch =
        analysis.image_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        analysis.detections.some((detection: Analysis['detections'][number]) =>
          detection.label
            .toLowerCase()
            .includes(search.toLowerCase()),
        );

      const matchesRisk =
        filter === "ALL" ||
        analysis.risk_level === filter;

      return matchesSearch && matchesRisk;
    });
  }, [data, filter, search]);

  const highCount = data.filter(
    (item) => item.risk_level === "HIGH",
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
      <section className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          <History size={15} />
          Scan Library
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <h1 className="max-w-4xl text-5xl font-black tracking-[-0.05em] sm:text-6xl">
            Your visual
            <span className="block text-zinc-400">
              analysis archive.
            </span>
          </h1>

          <p className="text-base leading-7 text-zinc-500 dark:text-zinc-400">
            Explore previous accessibility analyses stored
            in PostgreSQL. Search by file or detected class
            and filter results by risk.
          </p>
        </div>
      </section>

      <section className="mb-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.8rem] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
            Total scans
          </p>

          <p className="mt-3 text-4xl font-black">
            {data.length}
          </p>
        </div>

        <div className="rounded-[1.8rem] border border-red-100 bg-red-50 p-6 dark:border-red-500/20 dark:bg-red-500/10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-500">
            High risk
          </p>

          <p className="mt-3 text-4xl font-black">
            {highCount}
          </p>
        </div>

        <div className="rounded-[1.8rem] bg-zinc-950 p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
            Data source
          </p>

          <p className="mt-3 text-xl font-black">
            PostgreSQL
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Live backend history
          </p>
        </div>
      </section>

      <section className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-950">
          <Search
            size={18}
            className="text-zinc-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search scans or detected barriers..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              "ALL",
              "HIGH",
              "MEDIUM",
              "LOW",
            ] as RiskFilter[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                setFilter(item)
              }
              className={[
                "rounded-full px-4 py-2 text-xs font-bold transition",
                filter === item
                  ? "bg-zinc-950 text-white dark:bg-amber-300 dark:text-zinc-950"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300",
              ].join(" ")}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {isLoading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-[2rem] bg-zinc-200 dark:bg-zinc-800"
              />
            ),
          )}
        </div>
      )}

      {isError && (
        <div className="rounded-[2.4rem] border border-red-200 bg-red-50 p-10 text-center dark:border-red-500/20 dark:bg-red-500/10">
          <CircleAlert
            size={34}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-5 text-2xl font-black">
            Could not load analysis history
          </h2>

          <p className="mt-3 text-zinc-500">
            Make sure the FastAPI backend and PostgreSQL
            database are running.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 rounded-full bg-zinc-950 px-5 py-3 font-bold text-white dark:bg-amber-300 dark:text-zinc-950"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading &&
        !isError &&
        filtered.length === 0 && (
          <div className="rounded-[2.4rem] border border-dashed border-zinc-300 p-14 text-center dark:border-zinc-700">
            <FileImage
              size={38}
              className="mx-auto text-zinc-400"
            />

            <h2 className="mt-5 text-2xl font-black">
              No scans found
            </h2>

            <p className="mt-2 text-zinc-500">
              Try another search or analyse a new image.
            </p>
          </div>
        )}

      {!isLoading &&
        !isError &&
        filtered.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(
              (analysis, index) => {
                const style = riskStyle(
                  analysis.risk_level,
                );

                const strongest =
                  [...analysis.detections].sort(
                    (a, b) =>
                      b.confidence -
                      a.confidence,
                  )[0];

                return (
                  <motion.button
                    key={analysis.id}
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        Math.min(
                          index * 0.05,
                          0.3,
                        ),
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    type="button"
                    onClick={() =>
                      setSelected(analysis)
                    }
                    className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white text-left shadow-[0_18px_60px_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div
                      className={`relative h-44 overflow-hidden ${style.soft}`}
                    >
                      <div className="absolute inset-0 soft-grid opacity-60" />

                      <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-zinc-950 text-white shadow-xl dark:bg-zinc-800">
                        <FileImage size={24} />
                      </div>

                      <div className="absolute bottom-6 left-6">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-black ${style.badge}`}
                        >
                          {analysis.risk_level}
                        </span>
                      </div>

                      <div className="absolute bottom-6 right-6 text-right">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">
                          Score
                        </p>

                        <p className="text-2xl font-black">
                          {analysis.risk_score.toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-black">
                            {analysis.image_name}
                          </h3>

                          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                            <Calendar size={14} />
                            {formatDate(
                              analysis.created_at,
                            )}
                          </div>
                        </div>

                        <ChevronRight
                          size={19}
                          className="shrink-0 text-zinc-400 transition group-hover:translate-x-1"
                        />
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5 dark:border-zinc-800">
                        <span className="text-sm text-zinc-500">
                          {
                            analysis.detections
                              .length
                          }{" "}
                          detections
                        </span>

                        <span className="text-sm font-bold">
                          {strongest
                            ? `${strongest.label} ${Math.round(
                                strongest.confidence *
                                  100,
                              )}%`
                            : "No detections"}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              },
            )}
          </div>
        )}

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[70]">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
              aria-label="Close analysis details"
              onClick={() =>
                setSelected(null)
              }
              className="absolute inset-0 bg-zinc-950/55 backdrop-blur-sm"
            />

            <motion.aside
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 250,
              }}
              className="absolute bottom-0 right-0 top-0 w-full max-w-xl overflow-y-auto bg-[#fbfaf7] p-6 shadow-2xl dark:bg-zinc-950 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Scan #{selected.id}
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    {selected.image_name}
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Close details"
                  onClick={() =>
                    setSelected(null)
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-[1.5rem] bg-zinc-950 p-5 text-white">
                  <p className="text-xs text-zinc-400">
                    Risk
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {selected.risk_level}
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-amber-200 p-5 text-zinc-950">
                  <p className="text-xs font-bold">
                    Risk score
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {selected.risk_score.toFixed(
                      2,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-7 rounded-[1.8rem] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-black">
                  Detected features
                </h3>

                <div className="mt-5 space-y-3">
                  {selected.detections.length ===
                  0 ? (
                    <p className="text-sm text-zinc-500">
                      No trained class detected.
                    </p>
                  ) : (
                    selected.detections.map(
                      (detection: Analysis['detections'][number], index: number) => (
                        <div
                          key={`${detection.label}-${index}`}
                          className="flex items-center justify-between rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-950"
                        >
                          <span className="font-semibold">
                            {detection.label}
                          </span>

                          <span className="font-black">
                            {Math.round(
                              detection.confidence *
                                100,
                            )}
                            %
                          </span>
                        </div>
                      ),
                    )
                  )}
                </div>
              </div>

              <div className="mt-7 rounded-[1.8rem] bg-zinc-950 p-6 text-white">
                <ShieldCheck
                  size={25}
                  className="text-teal-300"
                />

                <h3 className="mt-5 font-black">
                  Why this result?
                </h3>

                <div className="mt-4 space-y-3">
                  {selected.reasons.length ===
                  0 ? (
                    <p className="text-sm leading-6 text-zinc-400">
                      No high-impact reason was
                      generated.
                    </p>
                  ) : (
                    selected.reasons.map(
                      (reason: string) => (
                        <p
                          key={reason}
                          className="text-sm leading-6 text-zinc-300"
                        >
                          • {reason}
                        </p>
                      ),
                    )
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
