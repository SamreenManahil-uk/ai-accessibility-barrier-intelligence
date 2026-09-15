import {
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

type BoundingBox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Detection = {
  label: string;
  confidence: number;
  bbox: BoundingBox;
};

type DetectionCanvasProps = {
  imageUrl: string;
  imageName: string;
  detections: Detection[];
  loading: boolean;
};

type CanvasMetrics = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  naturalWidth: number;
  naturalHeight: number;
};

function detectionColour(label: string) {
  const highRisk = [
    "Stairs",
    "Obstacle",
    "Pothole",
    "Road-barrier",
  ];

  const mediumRisk = [
    "Vehicle",
    "Pole",
    "Tree",
    "fire-hydrant",
  ];

  if (highRisk.includes(label)) {
    return {
      border: "border-red-400",
      label: "bg-red-400 text-zinc-950",
    };
  }

  if (mediumRisk.includes(label)) {
    return {
      border: "border-amber-300",
      label: "bg-amber-300 text-zinc-950",
    };
  }

  return {
    border: "border-teal-300",
    label: "bg-teal-300 text-zinc-950",
  };
}

export default function DetectionCanvas({
  imageUrl,
  imageName,
  detections,
  loading,
}: DetectionCanvasProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const imageRef =
    useRef<HTMLImageElement | null>(null);

  const [metrics, setMetrics] =
    useState<CanvasMetrics | null>(null);

  const calculateMetrics = () => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (
      !container ||
      !image ||
      !image.naturalWidth ||
      !image.naturalHeight
    ) {
      return;
    }

    const containerWidth =
      container.clientWidth;

    const containerHeight =
      container.clientHeight;

    const imageRatio =
      image.naturalWidth /
      image.naturalHeight;

    const containerRatio =
      containerWidth /
      containerHeight;

    let renderedWidth: number;
    let renderedHeight: number;

    if (imageRatio > containerRatio) {
      renderedWidth = containerWidth;
      renderedHeight =
        containerWidth / imageRatio;
    } else {
      renderedHeight =
        containerHeight;
      renderedWidth =
        containerHeight * imageRatio;
    }

    const offsetX =
      (containerWidth - renderedWidth) / 2;

    const offsetY =
      (containerHeight - renderedHeight) / 2;

    setMetrics({
      width: renderedWidth,
      height: renderedHeight,
      offsetX,
      offsetY,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
    });
  };

  useEffect(() => {
    const observer = new ResizeObserver(
      calculateMetrics,
    );

    if (containerRef.current) {
      observer.observe(
        containerRef.current,
      );
    }

    return () =>
      observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-zinc-950 sm:min-h-[460px] lg:min-h-[560px]"
    >
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Uploaded environment preview"
        onLoad={calculateMetrics}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {!loading &&
        metrics &&
        detections.map(
          (detection, index) => {
            const scaleX =
              metrics.width /
              metrics.naturalWidth;

            const scaleY =
              metrics.height /
              metrics.naturalHeight;

            const left =
              metrics.offsetX +
              detection.bbox.x1 *
                scaleX;

            const top =
              metrics.offsetY +
              detection.bbox.y1 *
                scaleY;

            const width =
              (detection.bbox.x2 -
                detection.bbox.x1) *
              scaleX;

            const height =
              (detection.bbox.y2 -
                detection.bbox.y1) *
              scaleY;

            const colour =
              detectionColour(
                detection.label,
              );

            return (
              <motion.div
                key={`${detection.label}-${index}`}
                role="img"
                aria-label={`${detection.label} detected with ${Math.round(
                  detection.confidence * 100,
                )}% confidence`}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay:
                    Math.min(
                      index * 0.08,
                      0.5,
                    ),
                }}
                className={`pointer-events-none absolute border-2 ${colour.border}`}
                style={{
                  left,
                  top,
                  width,
                  height,
                }}
              >
                <div
                  className={`absolute -top-8 left-0 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-black shadow-lg ${colour.label}`}
                >
                  {detection.label}{" "}
                  {Math.round(
                    detection.confidence *
                      100,
                  )}
                  %
                </div>
              </motion.div>
            );
          },
        )}

      {loading && (
        <>
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />

          <motion.div
            animate={{
              top: [
                "8%",
                "88%",
                "8%",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-6 right-6 z-20 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_28px_rgba(252,211,77,0.95)]"
          />

          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="rounded-[1.6rem] border border-white/15 bg-black/60 px-7 py-6 text-center text-white backdrop-blur-xl">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-amber-300" />

              <p className="mt-4 font-bold">
                Analysing environment
              </p>

              <p className="mt-1 text-sm text-zinc-300">
                Running object detection and risk analysis
              </p>
            </div>
          </div>
        </>
      )}

      {!loading && (
        <div className="absolute left-5 top-5 z-20 max-w-[70%] truncate rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-bold text-white backdrop-blur-xl">
          {imageName}
        </div>
      )}

      {!loading &&
        detections.length > 0 && (
          <div className="absolute bottom-5 left-5 z-20 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl">
            {detections.length}{" "}
            detection
            {detections.length === 1
              ? ""
              : "s"}
          </div>
        )}
    </div>
  );
}
