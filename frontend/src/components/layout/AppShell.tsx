import {
  Activity,
  BarChart3,
  BrainCircuit,
  History,
  Menu,
  Moon,
  ScanSearch,
  Settings,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const navigation = [
  { label: "Discover", path: "/", icon: Sparkles },
  { label: "Vision Lab", path: "/vision-lab", icon: ScanSearch },
  { label: "Scan Library", path: "/library", icon: History },
  { label: "Insights", path: "/insights", icon: BarChart3 },
  { label: "Barrier Guide", path: "/barriers", icon: Activity },
  { label: "Model Lab", path: "/model", icon: BrainCircuit },
  { label: "Preferences", path: "/preferences", icon: Settings },
];

function NavigationLink({
  path,
  label,
  onClick,
}: {
  path: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "rounded-full px-4 py-2 text-sm font-medium transition",
          isActive
            ? "bg-zinc-950 text-white dark:bg-lime-300 dark:text-zinc-950"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen text-zinc-950 dark:text-zinc-50">
      <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-[1.4rem] border border-white/70 px-4 py-3 shadow-[0_18px_70px_rgba(24,24,27,0.08)] dark:border-white/10 dark:shadow-black/30"
        >
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-lime-300 shadow-lg dark:bg-lime-300 dark:text-zinc-950">
              <ScanSearch size={20} />
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-bold tracking-tight">
                PathSense AI
              </div>
              <div className="hidden truncate text-[11px] text-zinc-500 sm:block dark:text-zinc-400">
                Accessibility intelligence
              </div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavigationLink key={item.path} {...item} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-2 text-xs font-medium text-zinc-600 lg:flex dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-lime-500" />
              AI ready
            </div>

            <button
              type="button"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/70 transition hover:scale-105 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:bg-zinc-800"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/70 xl:hidden dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <Menu size={19} />
            </button>
          </div>
        </motion.header>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-zinc-950/45 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass-panel absolute inset-x-4 top-4 rounded-[1.7rem] border border-white/70 p-5 shadow-2xl dark:border-white/10"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="font-bold">PathSense AI</div>

              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="grid gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-zinc-950 text-white dark:bg-lime-300 dark:text-zinc-950"
                          : "bg-white/60 text-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200",
                      ].join(" ")
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </motion.div>
        </div>
      )}

      <main className="pt-28">
        <Outlet />
      </main>
    </div>
  );
}
