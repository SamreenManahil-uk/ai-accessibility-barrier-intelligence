import sys
from pathlib import Path

import torch
from ultralytics import YOLO

PROJECT_ROOT = Path(__file__).resolve().parents[3]
ML_SRC = PROJECT_ROOT / "ml" / "src"

if str(ML_SRC) not in sys.path:
    sys.path.insert(0, str(ML_SRC))

from risk_engine import Detection, calculate_accessibility_risk


MODEL_PATH = (
    PROJECT_ROOT
    / "ml"
    / "reports"
    / "training"
    / "accessibility-baseline"
    / "weights"
    / "best.pt"
)

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model weights not found: {MODEL_PATH}"
    )


def select_device() -> str:
    if torch.cuda.is_available():
        return "cuda"

    if (
        hasattr(torch.backends, "mps")
        and torch.backends.mps.is_available()
    ):
        return "mps"

    return "cpu"


DEVICE = select_device()

model = YOLO(str(MODEL_PATH))


def analyse_image(image_path: str) -> dict:
    results = model.predict(
        source=image_path,
        conf=0.25,
        device=DEVICE,
        verbose=False,
    )

    result = results[0]

    detections = []

    for box in result.boxes:
        class_id = int(box.cls.item())
        confidence = float(box.conf.item())
        label = model.names[class_id]

        x1, y1, x2, y2 = [
            round(float(value), 2)
            for value in box.xyxy[0].tolist()
        ]

        detections.append(
            {
                "label": label,
                "confidence": round(
                    confidence,
                    3,
                ),
                "bbox": {
                    "x1": x1,
                    "y1": y1,
                    "x2": x2,
                    "y2": y2,
                },
            }
        )

    risk_input = [
        Detection(
            label=item["label"],
            confidence=item["confidence"],
        )
        for item in detections
    ]

    risk = calculate_accessibility_risk(
        risk_input
    )

    return {
        "detections": detections,
        "risk": risk,
    }
