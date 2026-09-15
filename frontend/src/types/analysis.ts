export type BoundingBox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Detection = {
  label: string;
  confidence: number;
  bbox: BoundingBox;
};

export type Analysis = {
  id: number;
  image_name: string;
  detections: Detection[];
  risk_level: "LOW" | "MEDIUM" | "HIGH" | string;
  risk_score: number;
  reasons: string[];
  created_at: string;
};
