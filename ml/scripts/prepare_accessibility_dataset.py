from pathlib import Path
from collections import Counter
import os
import shutil
import yaml

RAW_ROOT = Path("ml/data/raw/wheelchair-accessibility")
OUT_ROOT = Path("ml/data/processed/accessibility-detection")

# Original class ID -> new accessibility-focused class name
SELECTED_CLASSES = {
    1: "Crosswalk",
    2: "Obstacle",
    6: "Pole",
    7: "Pothole",
    9: "Ramp",
    11: "Road-barrier",
    12: "Sidewalk",
    13: "Stairs",
    17: "Tree",
    18: "Vehicle",
    19: "bench",
    20: "fire-hydrant",
}

OLD_TO_NEW = {
    old_id: new_id
    for new_id, old_id in enumerate(SELECTED_CLASSES.keys())
}

NEW_NAMES = list(SELECTED_CLASSES.values())

image_extensions = {
    ".jpg", ".jpeg", ".png", ".bmp",
    ".webp", ".tif", ".tiff"
}

stats = Counter()
malformed = 0


def polygon_to_bbox(values):
    xs = values[0::2]
    ys = values[1::2]

    x_min = max(0.0, min(xs))
    x_max = min(1.0, max(xs))
    y_min = max(0.0, min(ys))
    y_max = min(1.0, max(ys))

    width = x_max - x_min
    height = y_max - y_min

    if width <= 0 or height <= 0:
        return None

    x_center = (x_min + x_max) / 2
    y_center = (y_min + y_max) / 2

    return x_center, y_center, width, height


for split in ["train", "valid", "test"]:
    raw_images = RAW_ROOT / split / "images"
    raw_labels = RAW_ROOT / split / "labels"

    out_images = OUT_ROOT / split / "images"
    out_labels = OUT_ROOT / split / "labels"

    out_images.mkdir(parents=True, exist_ok=True)
    out_labels.mkdir(parents=True, exist_ok=True)

    for image_path in raw_images.iterdir():
        if image_path.suffix.lower() not in image_extensions:
            continue

        target_image = out_images / image_path.name

        if not target_image.exists():
            try:
                os.link(image_path, target_image)
            except OSError:
                shutil.copy2(image_path, target_image)

        label_path = raw_labels / f"{image_path.stem}.txt"
        target_label = out_labels / f"{image_path.stem}.txt"

        output_lines = []

        if label_path.exists():
            for line in label_path.read_text().splitlines():
                line = line.strip()

                if not line:
                    continue

                parts = line.split()

                try:
                    old_class_id = int(float(parts[0]))
                except (ValueError, IndexError):
                    malformed += 1
                    continue

                if old_class_id not in OLD_TO_NEW:
                    continue

                new_class_id = OLD_TO_NEW[old_class_id]

                try:
                    coords = [float(v) for v in parts[1:]]
                except ValueError:
                    malformed += 1
                    continue

                # Already YOLO detection format:
                # class x_center y_center width height
                if len(coords) == 4:
                    x, y, w, h = coords

                # Polygon/segmentation format:
                # class x1 y1 x2 y2 x3 y3 ...
                elif len(coords) >= 6 and len(coords) % 2 == 0:
                    bbox = polygon_to_bbox(coords)

                    if bbox is None:
                        malformed += 1
                        continue

                    x, y, w, h = bbox

                else:
                    malformed += 1
                    continue

                output_lines.append(
                    f"{new_class_id} "
                    f"{x:.6f} {y:.6f} "
                    f"{w:.6f} {h:.6f}"
                )

                stats[(split, new_class_id)] += 1

        target_label.write_text(
            "\n".join(output_lines)
            + ("\n" if output_lines else "")
        )


data_yaml = {
    "path": str(OUT_ROOT.resolve()),
    "train": "train/images",
    "val": "valid/images",
    "test": "test/images",
    "nc": len(NEW_NAMES),
    "names": NEW_NAMES,
}

with open(OUT_ROOT / "data.yaml", "w") as f:
    yaml.safe_dump(data_yaml, f, sort_keys=False)


print("\nDataset preparation complete ✅")
print("Output:", OUT_ROOT.resolve())

print("\nClasses:")
for i, name in enumerate(NEW_NAMES):
    print(f"{i}: {name}")

print("\nAnnotations by split/class:")

totals = Counter()

for split in ["train", "valid", "test"]:
    print(f"\n{split.upper()}")

    for class_id, name in enumerate(NEW_NAMES):
        count = stats[(split, class_id)]
        totals[class_id] += count
        print(f"{class_id:2d} {name:15s} {count}")

print("\nTOTAL ACCESSIBILITY ANNOTATIONS")

for class_id, name in enumerate(NEW_NAMES):
    print(f"{class_id:2d} {name:15s} {totals[class_id]}")

print("\nTotal retained:", sum(totals.values()))
print("Malformed/skipped:", malformed)
