import {
  ArrowLeft,
  Home,
  ScanSearch,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-16">
      <motion.section
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative w-full overflow-hidden rounded-[3rem] border border-zinc-200 bg-white p-8 shadow-[0_30px_100px_rgba(24,24,27,0.08)] sm:p-14 lg:p-20 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-64 w-64 rounded-full bg-rose-300/20 blur-3xl" />

        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-amber-300 dark:bg-amber-300 dark:text-zinc-950">
            <ScanSearch size={25} />
          </div>

          <p className="mt-10 text-sm font-black uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300">
            Error 404
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-[-0.055em] sm:text-7xl">
            This path doesn't
            <span className="block text-zinc-400">
              lead anywhere.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-500 dark:text-zinc-400">
            The page may have moved, or the address may be incorrect.
            Return to PathSense or open the Vision Lab.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 font-bold text-white dark:bg-amber-300 dark:text-zinc-950"
            >
              <Home size={18} />
              Go home
            </Link>

            <Link
              to="/vision-lab"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3.5 font-bold dark:border-zinc-700 dark:bg-zinc-900"
            >
              <ArrowLeft size={18} />
              Vision Lab
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
