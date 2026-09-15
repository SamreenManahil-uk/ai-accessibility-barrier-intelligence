from datetime import datetime

from pydantic import BaseModel


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class DetectionResponse(BaseModel):
    label: str
    confidence: float
    bbox: BoundingBox


class AnalysisResponse(BaseModel):
    id: int
    image_name: str
    detections: list[DetectionResponse]
    risk_level: str
    risk_score: float
    reasons: list[str]
    created_at: datetime
