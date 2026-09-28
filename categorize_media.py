import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("images_detailed_report.json", "r", encoding="utf-8") as f:
    images = json.load(f)

# Group images into logical categories
categories = {
    "Logos & Brand Identity": [],
    "Hero & Main Banners": [],
    "Product Imagery": [],
    "Industry Sectors (19 Sectors)": [],
    "Client Badges & Partners": [],
    "Icons, UI Vectors & Shapes": [],
    "Video & Miscellaneous Media": []
}

for img in images:
    url = img.get("source_url", "")
    fname = img.get("local_filename", "")
    w = img.get("actual_width", img.get("media_details", {}).get("width", 0))
    h = img.get("actual_height", img.get("media_details", {}).get("height", 0))
    alt = img.get("alt", "") or img.get("title", "")
    pages = [p["title"] for p in img.get("used_on_pages", [])]
    
    # Rating logic
    # Icons that are low-res or screenshots need replacement
    if "screenshot" in fname.lower() or "test" in fname.lower() or w < 60 or (w < 400 and "scaled" not in fname and not any(k in fname.lower() for k in ["icon", "vector", "logo", "mobile", "email", "map", "png"])):
        rating = "needs replacement"
        reason = "Low resolution / draft artifact"
    elif "screenshot" in fname.lower():
        rating = "needs replacement"
        reason = "Desktop screenshot artifact"
    elif any(k in fname.lower() for k in ["150x150", "260x300"]):
        rating = "needs replacement"
        reason = "Cropped thumbnail"
    elif w >= 600 or "vector" in fname.lower() or "icon" in fname.lower() or "logo" in fname.lower() or "removebg" in fname.lower() or any(p in pages for p in ["Home", "INDUSTRIES"]):
        rating = "usable"
        reason = "Acceptable resolution & relevance"
    else:
        rating = "usable"
        reason = "Standard asset"

    img_entry = {
        "filename": fname,
        "url": url,
        "width": w,
        "height": h,
        "alt": alt,
        "pages": pages,
        "rating": rating,
        "reason": reason
    }

    if any(k in fname.lower() for k in ["logo", "business_card"]):
        categories["Logos & Brand Identity"].append(img_entry)
    elif any(k in fname.lower() for k in ["banner", "pexels", "hero"]):
        categories["Hero & Main Banners"].append(img_entry)
    elif any(k in fname.lower() for k in ["solvent", "api", "methanol", "kmno", "bty-ace", "chemical"]):
        categories["Product Imagery"].append(img_entry)
    elif any(k in fname.lower() for k in ["agriculture", "automotive", "cleaning", "constuction", "cosmetic", "energy", "food", "healthcare", "leather", "mining", "packaging", "paint", "paper", "phrama", "plastics", "semiconductor", "textind", "tyre", "water-treatment", "adhesives"]):
        categories["Industry Sectors (19 Sectors)"].append(img_entry)
    elif any(fname.startswith(f"{i}.") or fname == f"{i}.png" or fname.startswith(f"{i}-150x150") for i in range(1, 9)) or "calyx" in fname.lower():
        categories["Client Badges & Partners"].append(img_entry)
    elif any(k in fname.lower() for k in ["icon", "vector", "ellipse", "shape", "group-", "earth"]):
        categories["Icons, UI Vectors & Shapes"].append(img_entry)
    else:
        categories["Video & Miscellaneous Media"].append(img_entry)

print("Categorization summary:")
for cat, items in categories.items():
    print(f"- {cat}: {len(items)} items")

with open("categorized_media_inventory.json", "w", encoding="utf-8") as f:
    json.dump(categories, f, indent=2, ensure_ascii=False)
