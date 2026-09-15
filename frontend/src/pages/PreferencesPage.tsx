import {
  Activity,
  CheckCircle2,
  Moon,
  Server,
  Settings,
  Sun,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { api } from "../services/api";
import {
  useTheme,
} from "../context/ThemeContext";

export default function PreferencesPage() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["backend-health"],
    queryFn: async () => {
      const response =
        await api.get<{
          status: string;
          service: string;
        }>("/api/v1/health");

      return response.data;
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-zinc-200 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        <Settings size={15} />
        Preferences
      </div>

      <h1 className="mt-6 text-5xl font-black tracking-[-0.05em] sm:text-6xl">
        Make PathSense
        <span className="block text-zinc-400">
          feel like yours.
        </span>
      </h1>

      <section className="mt-10 rounded-[2.4rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
          Appearance
        </p>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">
              Colour theme
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Your preference is saved in this
              browser.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-3 rounded-full bg-zinc-950 px-5 py-3 font-bold text-white dark:bg-amber-300 dark:text-zinc-950"
          >
            {theme === "dark" ? (
              <>
                <Sun size={18} />
                Use light theme
              </>
            ) : (
              <>
                <Moon size={18} />
                Use dark theme
              </>
            )}
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-[2.4rem] border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              System status
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Backend connection
            </h2>
          </div>

          <Server size={25} />
        </div>

        <div className="mt-7 rounded-[1.6rem] bg-zinc-100 p-5 dark:bg-zinc-950">
          {isLoading && (
            <p className="text-sm text-zinc-500">
              Checking FastAPI...
            </p>
          )}

          {!isLoading &&
            !isError &&
            data && (
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={22}
                  className="text-teal-500"
                />

                <div>
                  <p className="font-black">
                    Backend online
                  </p>

                  <p className="text-sm text-zinc-500">
                    {data.service}
                  </p>
                </div>
              </div>
            )}

          {isError && (
            <div>
              <p className="font-black text-red-500">
                Backend unavailable
              </p>

              <button
                type="button"
                onClick={() =>
                  refetch()
                }
                className="mt-3 text-sm font-bold underline"
              >
                Retry connection
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-[2.4rem] bg-amber-200 p-8 text-zinc-950">
        <Activity size={26} />

        <h2 className="mt-7 text-2xl font-black">
          Current model scope
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-zinc-700">
          PathSense currently recognises twelve
          trained environmental classes. Results are
          research-oriented AI predictions and should
          not be interpreted as formal accessibility
          certification.
        </p>
      </section>
    </div>
  );
}
