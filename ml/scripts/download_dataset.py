import os
from pathlib import Path
from roboflow import Roboflow

DATASET_ROOT = Path("ml/data/raw")
DATASET_ROOT.mkdir(parents=True, exist_ok=True)

api_key = os.getenv("ROBOFLOW_API_KEY")

if not api_key:
    raise RuntimeError(
        "ROBOFLOW_API_KEY is not set. "
        "Export it in your Terminal before running this script."
    )

rf = Roboflow(api_key=api_key)

project = rf.workspace("mtechcv").project(
    "unstructured-road-obstacle-detection"
)

version = project.version(3)

dataset = version.download(
    "yolov8",
    location=str(DATASET_ROOT / "unstructured-road-obstacle-detection")
)

print("Dataset downloaded successfully ✅")
print("Dataset location:", dataset.location)
