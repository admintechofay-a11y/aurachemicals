import json
import os
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("downloaded_images_inventory.json", "r", encoding="utf-8") as f:
    images = json.load(f)

print(f"Total images in inventory: {len(images)}")

# Check PIL for local images
for img in images:
    loc = img.get("local_rel_path")
    if loc and os.path.exists(loc):
        try:
            with Image.open(loc) as im:
                img["actual_width"] = im.width
                img["actual_height"] = im.height
                img["format"] = im.format
        except Exception:
            pass

# Count categorized
print("Images with dimensions inspected.")
with open("images_detailed_report.json", "w", encoding="utf-8") as f:
    json.dump(images, f, indent=2, ensure_ascii=False)
