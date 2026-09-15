import {
  Accessibility,
  AlertTriangle,
  Car,
  CircleDot,
  Construction,
  Footprints,
  Route,
  Sparkles,
  TreePine,
} from "lucide-react";
import { motion } from "framer-motion";

const barriers = [
  {
    name: "Stairs",
    risk: "HIGH",
    description:
      "A vertical access barrier that may prevent independent wheelchair movement where no alternative step-free route exists.",
    icon: Footprints,
  },
  {
    name: "Obstacle",
    risk: "HIGH",
    description:
      "An object obstructing a route and potentially reducing usable pedestrian clearance.",
    icon: AlertTriangle,
  },
  {
    name: "Pothole",
    risk: "HIGH",
    description:
      "Surface damage that may affect route stability and increase navigation difficulty.",
    icon: CircleDot,
  },
  {
    name: "Road-barrier",
    risk: "HIGH",
    description:
      "Temporary or permanent infrastructure that can restrict or redirect accessible movement.",
    icon: Construction,
  },
  {
    name: "Vehicle",
    risk: "MEDIUM",
    description:
      "Vehicles may affect accessibility when positioned close to or across pedestrian paths.",
    icon: Car,
  },
  {
    name: "Pole",
    risk: "MEDIUM",
    description:
      "A fixed environmental object that may reduce path clearance in constrained areas.",
    icon: Accessibility,
  },
  {
    name: "Tree",
    risk: "MEDIUM",
    description:
      "Trees can affect usable pedestrian width depending on their placement within a route.",
    icon: TreePine,
  },
  {
    name: "fire-hydrant",
    risk: "MEDIUM",
    description:
      "A fixed streetscape object that may influence available path width.",
    icon: Accessibility,
  },
  {
    name: "Ramp",
    risk: "LOW",
    description:
      "A potentially supportive step-free feature, although accessibility depends on slope, width and condition.",
    icon: Route,
  },
  {
    name: "bench",
    risk: "LOW",
    description:
      "Street furniture that generally has low risk unless it obstructs movement space.",
    icon: Accessibility,
  },
  {
    name: "Sidewalk",
    risk: "NEUTRAL",
    description:
      "A pedestrian route feature. Detection alone does not indicate an accessibility problem.",
    icon: Route,
  },
  {
    name: "Crosswalk",
    risk: "NEUTRAL",
    description:
      "A crossing feature. Accessibility depends on factors beyond detection alone.",
    icon: Route,
  },
];

function style(risk: string) {
  if (risk === "HIGH") {
    return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300";
  }

  if (risk === "MEDIUM") {
    return "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300";
  }

  return "bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-300";
}

export default function BarrierGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-amber-800 dark:bg-amber-300/10 dark:text-amber-300">
        <Sparkles size={15} />
        Barrier Guide
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
        <h1 className="text-5xl font-black tracking-[-0.05em] sm:text-6xl">
          Understand what
          <span className="block text-zinc-400">
            the model sees.
          </span>
        </h1>

        <p className="leading-7 text-zinc-500 dark:text-zinc-400">
          The current model is trained on twelve
          environmental classes. Risk represents the
          project's explainable heuristic, not a formal
          accessibility certification.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {barriers.map(
          (barrier, index) => {
            const Icon = barrier.icon;

            return (
              <motion.article
                key={barrier.name}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    Math.min(
                      index * 0.04,
                      0.3,
                    ),
                }}
                whileHover={{
                  y: -5,
                }}
                className="group rounded-[2.1rem] border border-zinc-200 bg-white p-7 shadow-[0_16px_55px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-zinc-950 text-amber-300 dark:bg-zinc-800">
                    <Icon size={24} />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${style(
                      barrier.risk,
                    )}`}
                  >
                    {barrier.risk}
                  </span>
                </div>

                <h2 className="mt-8 text-2xl font-black">
                  {barrier.name}
                </h2>

                <p className="mt-3 leading-7 text-zinc-500 dark:text-zinc-400">
                  {barrier.description}
                </p>
              </motion.article>
            );
          },
        )}
      </div>
    </div>
  );
}
