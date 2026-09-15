from pathlib import Path
from ultralytics import YOLO

from risk_engine import Detection, calculate_accessibility_risk


MODEL_PATH = Path(
    "ml/reports/training/accessibility-baseline/weights/best.pt"
)


def analyse_image(image_path: str) -> dict:
    model = YOLO(str(MODEL_PATH))

    results = model.predict(
        source=image_path,
        conf=0.25,
        device="mps",
        verbose=False,
    )

    detections = []

    result = results[0]

    for box in result.boxes:
        class_id = int(box.cls.item())
        confidence = float(box.conf.item())
        label = model.names[class_id]

        detections.append(
            Detection(
                label=label,
                confidence=confidence,
            )
        )

    risk = calculate_accessibility_risk(detections)

    return {
        "detections": [
            {
                "label": detection.label,
                "confidence": round(detection.confidence, 3),
            }
            for detection in detections
        ],
        "risk": risk,
    }


if __name__ == "__main__":
    sample_image = (
        "ml/data/processed/accessibility-detection/"
        "test/images/"
    )

    images = list(Path(sample_image).glob("*"))

    if not images:
        raise FileNotFoundError(
            "No test images found."
        )

    image = images[0]

    print(f"Testing image: {image}")
    print(analyse_image(str(image)))
