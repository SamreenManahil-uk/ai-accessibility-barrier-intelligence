import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

ML_SRC = PROJECT_ROOT / "ml" / "src"

if str(ML_SRC) not in sys.path:
    sys.path.insert(0, str(ML_SRC))

from risk_engine import (
    Detection,
    calculate_accessibility_risk,
)


def test_low_risk_sidewalk():
    result = calculate_accessibility_risk(
        [
            Detection(
                label="Sidewalk",
                confidence=0.9,
            )
        ]
    )

    assert result["risk_level"] == "LOW"
    assert result["risk_score"] == 0


def test_high_risk_combination():
    result = calculate_accessibility_risk(
        [
            Detection(
                label="Vehicle",
                confidence=0.9,
            ),
            Detection(
                label="Road-barrier",
                confidence=0.85,
            ),
        ]
    )

    assert result["risk_level"] == "HIGH"
    assert result["risk_score"] >= 6
