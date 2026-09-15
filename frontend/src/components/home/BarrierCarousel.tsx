import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Construction,
  Footprints,
  Route,
  ShieldAlert,
  TrafficCone,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Stairs",
    subtitle: "High-impact accessibility barrier",
    description:
      "Stairs can completely restrict wheelchair access where no alternative route or ramp is available.",
    accent: "amber",
    icon: Footprints,
    risk: "HIGH",
    confidence: "94%",
  },
  {
    title: "Pothole",
    subtitle: "Surface-level path hazard",
    description:
      "Potholes may reduce route stability and create additional difficulty for wheelchair users and people with mobility limitations.",
    accent: "rose",
    icon: CircleAlert,
    risk: "HIGH",
    confidence: "88%",
  },
  {
    title: "Obstacle",
    subtitle: "Potential path obstruction",
    description:
      "Objects blocking a walkway can reduce available movement space and create accessibility challenges.",
    accent: "orange",
    icon: TrafficCone,
    risk: "HIGH",
    confidence: "86%",
  },
  {
    title: "Ramp",
    subtitle: "Accessibility-supporting feature",
    description:
      "Ramps can improve access where elevation changes exist, although slope, width and surface quality also matter.",
    accent: "teal",
    icon: Route,
    risk: "LOW",
    confidence: "82%",
  },
  {
    title: "Road Barrier",
    subtitle: "Temporary or permanent restriction",
    description:
      "Road barriers can alter pedestrian movement and may reduce the usable width of an accessible route.",
    accent: "red",
    icon: Construction,
    risk: "MEDIUM",
    confidence: "79%",
  },
  {
    title: "Pole",
    subtitle: "Fixed path-side object",
    description:
      "Poles may create navigation challenges when positioned within narrow or already constrained pedestrian paths.",
    accent: "yellow",
    icon: ShieldAlert,
    risk: "MEDIUM",
    confidence: "76%",
  },
];

const accentClasses: Record<
  string,
  {
    surface: string;
    badge: string;
    icon: string;
    glow: string;
  }
> = {
  amber: {
    surface:
      "from-amber-100 via-amber-50 to-white dark:from-amber-500/15 dark:via-zinc-900 dark:to-zinc-950",
    badge:
      "bg-amber-200 text-amber-950 dark:bg-amber-300 dark:text-zinc-950",
    icon: "bg-amber-300 text-zinc-950",
    glow: "bg-amber-300/30",
  },
  rose: {
    surface:
      "from-rose-100 via-rose-50 to-white dark:from-rose-500/15 dark:via-zinc-900 dark:to-zinc-950",
    badge:
      "bg-rose-200 text-rose-950 dark:bg-rose-300 dark:text-zinc-950",
    icon: "bg-rose-300 text-zinc-950",
    glow: "bg-rose-300/30",
  },
  orange: {
    surface:
      "from-orange-100 via-orange-50 to-white dark:from-orange-500/15 dark:via-zinc-900 dark:to-zinc-950",
    badge:
      "bg-orange-200 text-orange-950 dark:bg-orange-300 dark:text-zinc-950",
    icon: "bg-orange-300 text-zinc-950",
    glow: "bg-orange-300/30",
  },
  teal: {
    surface:
      "from-teal-100 via-teal-50 to-white dark:from-teal-500/15 dark:via-zinc-900 dark:to-zinc-950",
    badge:
      "bg-teal-200 text-teal-950 dark:bg-teal-300 dark:text-zinc-950",
    icon: "bg-teal-300 text-zinc-950",
    glow: "bg-teal-300/30",
  },
  red: {
    surface:
      "from-red-100 via-red-50 to-white dark:from-red-500/15 dark:via-zinc-900 dark:to-zinc-950",
    badge:
      "bg-red-200 text-red-950 dark:bg-red-300 dark:text-zinc-950",
    icon: "bg-red-300 text-zinc-950",
    glow: "bg-red-300/30",
  },
  yellow: {
    surface:
      "from-yellow-100 via-yellow-50 to-white dark:from-yellow-500/15 dark:via-zinc-900 dark:to-zinc-950",
    badge:
      "bg-yellow-200 text-yellow-950 dark:bg-yellow-300 dark:text-zinc-950",
    icon: "bg-yellow-300 text-zinc-950",
    glow: "bg-yellow-300/30",
  },
};

export default function BarrierCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const previous = () => {
    setCurrent((value) =>
      value === 0 ? slides.length - 1 : value - 1,
    );
  };

  const next = () => {
    setCurrent((value) =>
      value === slides.length - 1 ? 0 : value + 1,
    );
  };

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setCurrent((value) =>
        value === slides.length - 1 ? 0 : value + 1,
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = slides[current];
  const Icon = slide.icon;
  const accent = accentClasses[slide.accent];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-300">
            Barrier Spotlight
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
            Explore what the model is trained to recognise.
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Each class represents an environmental feature that may influence
          how accessible a route or public space is.
        </p>
      </div>

      <div
        className="relative overflow-hidden rounded-[2.6rem] border border-zinc-200 bg-white shadow-[0_30px_100px_rgba(24,24,27,0.08)] dark:border-zinc-800 dark:bg-zinc-900"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
            className={`relative grid min-h-[430px] overflow-hidden bg-gradient-to-br ${accent.surface} lg:grid-cols-[0.9fr_1.1fr]`}
          >
            <div
              className={`absolute -left-20 top-0 h-72 w-72 rounded-full blur-3xl ${accent.glow}`}
            />

            <div className="relative flex flex-col justify-between p-8 sm:p-10 lg:p-12">
              <div>
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${accent.icon}`}
                >
                  <Icon size={26} />
                </div>

                <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                  {slide.subtitle}
                </p>

                <h3 className="mt-3 text-5xl font-black tracking-[-0.04em] sm:text-6xl">
                  {slide.title}
                </h3>

                <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                  {slide.description}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <div
                  className={`rounded-full px-4 py-2 text-sm font-bold ${accent.badge}`}
                >
                  Risk · {slide.risk}
                </div>

                <div className="rounded-full border border-zinc-300 bg-white/60 px-4 py-2 text-sm font-semibold backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/60">
                  Example confidence · {slide.confidence}
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center p-8 sm:p-10">
              <div className="relative aspect-square w-full max-w-[360px]">
                <motion.div
                  animate={{
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-[3rem] border border-white/70 bg-white/55 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/50"
                />

                <div className="absolute inset-7 flex items-center justify-center rounded-[2.4rem] border border-zinc-200 bg-zinc-950 dark:border-zinc-700">
                  <Icon
                    size={120}
                    strokeWidth={1.25}
                    className="text-white"
                  />
                </div>

                <div className="absolute -right-3 top-8 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/80">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Detection
                  </p>
                  <p className="mt-1 text-lg font-black">
                    {slide.confidence}
                  </p>
                </div>

                <div className="absolute -bottom-3 left-8 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/80">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Risk signal
                  </p>
                  <p className="mt-1 font-black">
                    {slide.risk}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col gap-4 border-t border-zinc-200 bg-white/80 px-6 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="flex items-center gap-2">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show ${item.title}`}
                onClick={() => setCurrent(index)}
                className={[
                  "h-2.5 rounded-full transition-all",
                  index === current
                    ? "w-8 bg-amber-400"
                    : "w-2.5 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {current + 1} / {slides.length}
            </span>

            <button
              type="button"
              onClick={previous}
              aria-label="Previous barrier"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white transition hover:-translate-x-0.5 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next barrier"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 text-white transition hover:translate-x-0.5 dark:bg-amber-300 dark:text-zinc-950"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-zinc-400">
        Confidence values in this carousel are interface examples. Actual
        predictions shown in Vision Lab will come from the trained model.
      </p>
    </section>
  );
}
