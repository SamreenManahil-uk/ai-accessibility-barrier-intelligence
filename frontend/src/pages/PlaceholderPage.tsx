import { motion } from "framer-motion";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PlaceholderPage({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.8rem] border border-zinc-200 bg-white p-10 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="inline-flex rounded-full bg-lime-200 px-4 py-2 text-sm font-bold text-zinc-950">
          {eyebrow}
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </motion.div>
    </section>
  );
}
