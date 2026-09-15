from dataclasses import dataclass
from typing import List


@dataclass
class Detection:
    label: str
    confidence: float


RISK_WEIGHTS = {
    "Stairs": 4,
    "Ramp": 1,
    "Obstacle": 4,
    "Pothole": 4,
    "Road-barrier": 4,
    "Pole": 2,
    "Tree": 2,
    "Vehicle": 3,
    "bench": 1,
    "fire-hydrant": 2,
    "Sidewalk": 0,
    "Crosswalk": 0,
}


def calculate_accessibility_risk(
    detections: List[Detection],
) -> dict:
    score = 0.0
    reasons = []

    for detection in detections:
        weight = RISK_WEIGHTS.get(detection.label, 0)

        contribution = weight * detection.confidence
        score += contribution

        if weight >= 3:
            reasons.append(
                f"{detection.label} detected "
                f"({detection.confidence:.0%} confidence)"
            )

    if score >= 6:
        level = "HIGH"
    elif score >= 3:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "risk_level": level,
        "risk_score": round(score, 2),
        "reasons": reasons,
    }


if __name__ == "__main__":
    sample = [
        Detection("Stairs", 0.91),
        Detection("Obstacle", 0.84),
        Detection("Sidewalk", 0.89),
    ]

    print(calculate_accessibility_risk(sample))
