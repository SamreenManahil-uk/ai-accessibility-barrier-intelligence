import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileImage,
  LoaderCircle,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { api } from "../services/api";
import DetectionCanvas from "../components/vision/DetectionCanvas";

type Detection = {
  label: string;
  confidence: number;
  bbox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
};

type AnalysisResponse = {
  id: number;
  image_name: string;
  detections: Detection[];
  risk_level: string;
  risk_score: number;
  reasons: string[];
  created_at: string;
};

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function riskStyles(level?: string) {
  if (level === "HIGH") {
    return {
      badge: "bg-red-500 text-white",
      surface:
        "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10",
      icon: "text-red-500",
    };
  }

  if (level === "MEDIUM") {
    return {
      badge: "bg-amber-300 text-zinc-950",
      surface:
        "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
      icon: "text-amber-500",
    };
  }

  return {
    badge: "bg-teal-300 text-zinc-950",
    surface:
      "border-teal-200 bg-teal-50 dark:border-teal-500/20 dark:bg-teal-500/10",
    icon: "text-teal-500",
  };
}

export default function VisionLabPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];

    if (!selected) {
      return;
    }

    if (!allowedTypes.includes(selected.type)) {
      toast.error("Please choose a JPEG, PNG or WebP image.");
      return;
    }

    setFile(selected);
    setResult(null);

    setPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return URL.createObjectURL(selected);
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
  });

  const analyse = async () => {
    if (!file) {
      toast.error("Choose an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setResult(null);

      const response = await api.post<AnalysisResponse>(
        "/api/v1/analyse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setResult(response.data);
      toast.success("Accessibility analysis complete.");
    } catch (error) {
      console.error(error);

      toast.error(
        "Analysis failed. Make sure the FastAPI backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const sortedDetections = useMemo(() => {
    return [...(result?.detections ?? [])].sort(
      (a, b) => b.confidence - a.confidence,
    );
  }, [result]);

  const highestConfidence =
    sortedDetections.length > 0
      ? sortedDetections[0].confidence
      : 0;

  const style = riskStyles(result?.risk_level);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-amber-800 dark:bg-amber-300/10 dark:text-amber-300">
          <Sparkles size={15} />
          Vision Lab
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.6fr] lg:items-end">
          <h1 className="max-w-4xl text-5xl font-black tracking-[-0.05em] sm:text-6xl">
            Analyse the environment.
            <span className="block text-zinc-400">
              Understand the accessibility signal.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
            Upload a street or public-space image. The custom YOLO model
            identifies trained environmental classes and combines them with
            the project's explainable accessibility-risk heuristic.
          </p>
        </div>
      </motion.div>

      <div className="grid items-start gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="self-start overflow-hidden rounded-[2.6rem] border border-zinc-200 bg-white shadow-[0_30px_100px_rgba(24,24,27,0.07)] dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-4 border-b border-zinc-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                Analysis canvas
              </p>

              <h2 className="mt-1 text-lg font-bold">
                Environment image
              </h2>
            </div>

            {file && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>

          {!preview ? (
            <div className="p-6 sm:p-8">
              <div
                {...getRootProps()}
                className={[
                  "flex min-h-[520px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed px-6 text-center transition",
                  isDragActive
                    ? "border-amber-400 bg-amber-50 dark:bg-amber-400/10"
                    : "border-zinc-300 bg-zinc-50 hover:border-amber-400 hover:bg-amber-50/60 dark:border-zinc-700 dark:bg-zinc-950/40 dark:hover:bg-amber-400/5",
                ].join(" ")}
              >
                <input {...getInputProps()} />

                <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-zinc-950 text-amber-300 shadow-xl dark:bg-amber-300 dark:text-zinc-950">
                  <UploadCloud size={34} />
                </div>

                <h3 className="mt-7 text-2xl font-black">
                  Drop an environment image here
                </h3>

                <p className="mt-3 max-w-md leading-7 text-zinc-500 dark:text-zinc-400">
                  Or click to browse your device. Use a clear street,
                  pavement, stairs, ramp, obstacle or other environmental image.
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  {["JPEG", "PNG", "WebP"].map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-white px-3 py-2 text-xs font-bold text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative bg-zinc-950 p-3">
              <DetectionCanvas
                imageUrl={preview}
                imageName={file?.name ?? "Uploaded image"}
                detections={result?.detections ?? []}
                loading={loading}
              />
            </div>
          )}

          {preview && (
            <div className="flex flex-col gap-4 border-t border-zinc-200 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
              <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <FileImage size={18} />

                <span className="max-w-[280px] truncate">
                  {file?.name}
                </span>
              </div>

              <button
                type="button"
                onClick={analyse}
                disabled={loading}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-zinc-950 px-6 py-3 font-bold text-white shadow-xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-300 dark:text-zinc-950"
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Analysing
                  </>
                ) : (
                  <>
                    <ScanLine size={18} />
                    Analyse image
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          {!result ? (
            <>
              <div className="rounded-[2rem] border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-300/10 dark:text-amber-300">
                  <ScanLine size={23} />
                </div>

                <h2 className="mt-7 text-2xl font-black">
                  Ready to analyse
                </h2>

                <p className="mt-3 leading-7 text-zinc-500 dark:text-zinc-400">
                  Upload an image to generate detections and an accessibility
                  risk result.
                </p>
              </div>

              <div className="rounded-[2rem] bg-zinc-950 p-7 text-white">
                <ShieldCheck className="text-teal-300" size={26} />

                <h3 className="mt-8 text-xl font-bold">
                  Explainable by design
                </h3>

                <p className="mt-3 leading-7 text-zinc-400">
                  The risk layer uses transparent weighted rules rather than
                  presenting the model output as a formal accessibility
                  certification.
                </p>
              </div>
            </>
          ) : (
            <>
              <div
                className={`rounded-[2rem] border p-7 ${style.surface}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                      Accessibility risk
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-black ${style.badge}`}
                      >
                        {result.risk_level}
                      </span>

                      <span className="text-3xl font-black">
                        {result.risk_score.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {result.risk_level === "HIGH" ? (
                    <AlertTriangle
                      size={30}
                      className={style.icon}
                    />
                  ) : (
                    <CheckCircle2
                      size={30}
                      className={style.icon}
                    />
                  )}
                </div>

                <p className="mt-6 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Result generated from model detections and the project's
                  explainable weighted risk heuristic.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[1.7rem] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Detections
                  </p>

                  <p className="mt-3 text-3xl font-black">
                    {result.detections.length}
                  </p>
                </div>

                <div className="rounded-[1.7rem] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Top confidence
                  </p>

                  <p className="mt-3 text-3xl font-black">
                    {Math.round(highestConfidence * 100)}%
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-lg font-black">
                  Detected features
                </h3>

                {sortedDetections.length === 0 ? (
                  <div className="mt-5 rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-950/50">
                    <p className="font-semibold">
                      No trained class detected
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      No prediction exceeded the current model confidence
                      threshold.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {sortedDetections.map((detection, index) => (
                      <div
                        key={`${detection.label}-${index}`}
                        className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950/50"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-bold">
                            {detection.label}
                          </span>

                          <span className="text-sm font-black">
                            {Math.round(
                              detection.confidence * 100,
                            )}
                            %
                          </span>
                        </div>

                        {detection.confidence < 0.35 && (
                          <p className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-300">
                            Low-confidence detection
                          </p>
                        )}

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                detection.confidence * 100,
                                100,
                              )}%`,
                            }}
                            className="h-full rounded-full bg-amber-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-lg font-black">
                  Why this result?
                </h3>

                {result.reasons.length === 0 ? (
                  <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    No high-impact barrier reason was generated for this image.
                  </p>
                ) : (
                  <div className="mt-5 space-y-3">
                    {result.reasons.map((reason) => (
                      <div
                        key={reason}
                        className="flex gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950/50"
                      >
                        <AlertTriangle
                          size={18}
                          className="mt-0.5 shrink-0 text-amber-500"
                        />

                        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                          {reason}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
