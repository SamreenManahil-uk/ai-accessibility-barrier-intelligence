import BarrierCarousel from "../components/home/BarrierCarousel";
import {
  ArrowUpRight,
  BrainCircuit,
  Camera,
  ChevronRight,
  CircleDot,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const barriers = [
  "Stairs",
  "Potholes",
  "Obstacles",
  "Road barriers",
  "Ramps",
  "Sidewalks",
];

function StatCard({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_16px_50px_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-2 font-semibold">{label}</div>
      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {detail}
      </p>
    </motion.div>
  );
}

export default function DiscoverPage() {
  return (
    <div className="overflow-hidden">
      <section className="soft-grid">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-100/70 px-4 py-2 text-sm font-semibold text-zinc-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
              <Sparkles size={16} />
              Computer vision for accessible spaces
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-[-0.055em] sm:text-6xl lg:text-[5.4rem] lg:leading-[0.94] dark:text-white">
              See the path.
              <span className="block text-zinc-400 dark:text-zinc-600">
                Understand the barrier.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl dark:text-zinc-300">
              Upload a real-world image and let a custom-trained computer vision
              model identify environmental features that may affect physical accessibility.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/vision-lab"
                className="inline-flex items-center gap-3 rounded-full bg-zinc-950 px-6 py-3.5 font-semibold text-white dark:bg-amber-300 dark:text-zinc-950"
              >
                Open Vision Lab
                <ArrowUpRight size={18} />
              </Link>

              <Link
                to="/model"
                className="inline-flex items-center gap-3 rounded-full border border-zinc-300 bg-white/60 px-6 py-3.5 font-semibold dark:border-zinc-700 dark:bg-zinc-900/60"
              >
                Explore the model
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} />
                Explainable risk
              </span>

              <span className="flex items-center gap-2">
                <BrainCircuit size={16} />
                Custom YOLO
              </span>

              <span className="flex items-center gap-2">
                <CircleDot size={16} />
                12 classes
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-[2.6rem] bg-zinc-950 p-3 shadow-2xl"
          >
            <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
              <div className="absolute inset-0 soft-grid opacity-70" />

              <div className="absolute left-7 top-7 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                LIVE ANALYSIS PREVIEW
              </div>

              <div className="absolute left-[13%] top-[26%] h-[27%] w-[34%] rounded-xl border-2 border-amber-300">
                <div className="absolute -top-9 left-0 rounded-lg bg-amber-300 px-3 py-1.5 text-xs font-bold text-zinc-950">
                  Stairs · 94%
                </div>
              </div>

              <div className="absolute bottom-[21%] right-[11%] h-[22%] w-[30%] rounded-xl border-2 border-rose-400">
                <div className="absolute -top-9 right-0 rounded-lg bg-rose-400 px-3 py-1.5 text-xs font-bold text-white">
                  Obstacle · 87%
                </div>
              </div>

              <motion.div
                animate={{ y: [0, 390, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-5 right-5 top-16 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
              />

              <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["Risk", "HIGH"],
                  ["Objects", "06"],
                  ["Top confidence", "94%"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4 text-white backdrop-blur-xl"
                  >
                    <div className="text-xs text-zinc-400">{label}</div>
                    <div className="mt-1 text-xl font-bold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            value="14,437"
            label="Dataset images"
            detail="Real public image dataset prepared for accessibility-focused object detection."
          />

          <StatCard
            value="57.4%"
            label="mAP@0.5"
            detail="Held-out test performance from the trained accessibility detector."
          />

          <StatCard
            value="71.2%"
            label="Precision"
            detail="Measured on the held-out test split."
          />
        </div>
      </section>

      <BarrierCarousel />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 lg:grid-cols-12">
          <article className="rounded-[2.2rem] bg-zinc-950 p-8 text-white lg:col-span-7">
            <ScanLine size={26} />

            <h3 className="mt-10 text-3xl font-bold">
              Analyse environments in a dedicated visual workspace.
            </h3>

            <p className="mt-4 max-w-xl leading-7 text-zinc-400">
              Vision Lab combines image upload, detection overlays, confidence
              values and explainable accessibility risk.
            </p>
          </article>

          <article className="rounded-[2.2rem] border border-zinc-200 bg-white p-8 lg:col-span-5 dark:border-zinc-800 dark:bg-zinc-900">
            <Camera size={26} />

            <h3 className="mt-10 text-2xl font-bold">
              Barrier intelligence
            </h3>

            <div className="mt-8 flex flex-wrap gap-2">
              {barriers.map((barrier) => (
                <span
                  key={barrier}
                  className="rounded-full bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800"
                >
                  {barrier}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
