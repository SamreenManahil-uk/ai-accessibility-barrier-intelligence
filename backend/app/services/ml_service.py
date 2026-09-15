import sys
from pathlib import Path

from ultralytics import YOLO


PROJECT_ROOT = Path(__file__).resolve().parents[3]
ML_SRC = PROJECT_ROOT / "ml" / "src"

if str(ML_SRC) not in sys.path:
    sys.path.insert(0, str(ML_SRC))

from risk_engine import Detection, calculate_accessibility_risk  # noqa: E402


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
        f"Model not found at: {MODEL_PATH}"
    )


model = YOLO(str(MODEL_PATH))


def analyse_image(image_path: str) -> dict:
    results = model.predict(
        source=image_path,
        conf=0.25,
        device="mps",
        verbose=False,
    )

    result = results[0]

    detections = []

    for box in result.boxes:
        class_id = int(box.cls.item())
        confidence = float(box.conf.item())
        label = model.names[class_id]

        detections.append(
            {
                "label": label,
                "confidence": round(confidence, 3),
            }
        )

    risk_input = [
        Detection(
            label=item["label"],
            confidence=item["confidence"],
        )
        for item in detections
    ]

    risk = calculate_accessibility_risk(risk_input)

    return {
        "detections": detections,
        "risk": risk,
    }
