import {
  BrainCircuit,
  Database,
  Gauge,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { motion } from "framer-motion";

const metrics = [
  {
    label: "Precision",
    value: "71.2%",
    detail:
      "Held-out test precision",
  },
  {
    label: "Recall",
    value: "52.8%",
    detail:
      "Held-out test recall",
  },
  {
    label: "mAP@0.5",
    value: "57.4%",
    detail:
      "Mean average precision",
  },
  {
    label: "mAP@0.5:0.95",
    value: "38.9%",
    detail:
      "Stricter IoU evaluation",
  },
];

const classes = [
  ["Crosswalk", 43.6],
  ["Obstacle", 42.5],
  ["Pole", 63.7],
  ["Pothole", 30.0],
  ["Ramp", 5.0],
  ["Road-barrier", 71.3],
  ["Sidewalk", 72.1],
  ["Stairs", 45.2],
  ["Tree", 63.3],
  ["Vehicle", 69.6],
  ["bench", 97.4],
  ["fire-hydrant", 84.7],
];

export default function ModelLabPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
        <Sparkles size={15} />
        Model Lab
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
        <h1 className="text-5xl font-black tracking-[-0.05em] sm:text-6xl">
          Performance,
          <span className="block text-zinc-400">
            without hiding limitations.
          </span>
        </h1>

        <p className="leading-7 text-zinc-500 dark:text-zinc-400">
          These values come from the held-out
          test split used during Day 2 model
          evaluation.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            whileHover={{ y: -4 }}
            className="rounded-[2rem] border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
              {metric.label}
            </p>

            <p className="mt-4 text-4xl font-black">
              {metric.value}
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              {metric.detail}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2.4rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <Gauge size={24} />

            <h2 className="text-2xl font-black">
              Per-class mAP@0.5
            </h2>
          </div>

          <div className="mt-8 space-y-5">
            {classes.map(
              ([name, value]) => (
                <div key={name}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">
                      {name}
                    </span>

                    <span className="font-black">
                      {value}%
                    </span>
                  </div>

                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={[
                        "h-full rounded-full",
                        Number(value) <
                        20
                          ? "bg-red-400"
                          : Number(
                                value,
                              ) < 50
                            ? "bg-amber-400"
                            : "bg-teal-400",
                      ].join(" ")}
                      style={{
                        width: `${value}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[2.3rem] bg-zinc-950 p-8 text-white">
            <BrainCircuit
              size={26}
              className="text-amber-300"
            />

            <h2 className="mt-8 text-2xl font-black">
              Custom accessibility detector
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Architecture
                </span>
                <strong>YOLO</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Classes
                </span>
                <strong>12</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Test images
                </span>
                <strong>1,454</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">
                  Test instances
                </span>
                <strong>3,379</strong>
              </div>
            </div>
          </section>

          <section className="rounded-[2.3rem] border border-red-200 bg-red-50 p-8 dark:border-red-500/20 dark:bg-red-500/10">
            <TriangleAlert
              className="text-red-500"
              size={26}
            />

            <h2 className="mt-6 text-xl font-black">
              Known limitation
            </h2>

            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-300">
              Ramp is the weakest current class
              because the dataset contained relatively
              few examples. External real-world images
              can also differ significantly from the
              training distribution.
            </p>
          </section>

          <section className="rounded-[2.3rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <Database size={25} />

            <h2 className="mt-6 text-xl font-black">
              Dataset
            </h2>

            <p className="mt-3 text-4xl font-black">
              14,437
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Prepared images across train,
              validation and held-out test splits.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
