import os
from pathlib import Path
from roboflow import Roboflow

api_key = os.getenv("ROBOFLOW_API_KEY")

if not api_key:
    raise RuntimeError("ROBOFLOW_API_KEY is not set.")

root = Path("ml/data/raw")
root.mkdir(parents=True, exist_ok=True)

rf = Roboflow(api_key=api_key)

project = rf.workspace("samreen-manahil").project(
    "wheelchair-ijcoz-rkwiv-icjfp"
)

version = project.version(1)

dataset = version.download(
    "yolov8",
    location=str(root / "wheelchair-accessibility")
)

print("Dataset downloaded successfully ✅")
print("Dataset location:", dataset.location)
