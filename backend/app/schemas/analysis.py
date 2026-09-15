from datetime import datetime

from pydantic import BaseModel


class DetectionResponse(BaseModel):
    label: str
    confidence: float


class AnalysisResponse(BaseModel):
    id: int
    image_name: str
    detections: list[DetectionResponse]
    risk_level: str
    risk_score: float
    reasons: list[str]
    created_at: datetime
