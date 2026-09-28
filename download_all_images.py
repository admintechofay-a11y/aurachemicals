import os
import json
import urllib.parse
import requests
import sys

sys.stdout.reconfigure(encoding='utf-8')

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# 1. Load media_list.json
with open("media_list.json", "r", encoding="utf-8") as f:
    media_items = json.load(f)

# 2. Load scraped_pages_data.json
with open("scraped_pages_data.json", "r", encoding="utf-8") as f:
    scraped_pages = json.load(f)

image_records = {} # key: url, value: dict

# Add media items
for m in media_items:
    url = m.get("source_url")
    if not url:
        continue
    image_records[url] = {
        "id": m.get("id"),
        "title": m.get("title", {}).get("rendered", ""),
        "alt": m.get("alt_text", ""),
        "caption": m.get("caption", {}).get("rendered", ""),
        "mime_type": m.get("mime_type", ""),
        "source_url": url,
        "media_details": m.get("media_details", {}),
        "used_on_pages": []
    }

# Check pages for images and link them
for page in scraped_pages:
    page_title = page.get("wp_title") or page.get("doc_title")
    page_url = page.get("url")
    for img in page.get("images", []):
        src = img.get("src")
        if not src:
            continue
        # Normalize URL
        full_url = urllib.parse.urljoin(page_url, src)
        if full_url not in image_records:
            image_records[full_url] = {
                "id": None,
                "title": img.get("title", ""),
                "alt": img.get("alt", ""),
                "caption": "",
                "mime_type": "",
                "source_url": full_url,
                "media_details": {},
                "used_on_pages": []
            }
        # Add to used_on_pages if not already present
        exists = any(p["url"] == page_url for p in image_records[full_url]["used_on_pages"])
        if not exists:
            image_records[full_url]["used_on_pages"].append({
                "title": page_title,
                "url": page_url
            })
        if img.get("alt") and not image_records[full_url]["alt"]:
            image_records[full_url]["alt"] = img.get("alt")

print(f"Total unique images to download: {len(image_records)}")

# Create images directory
os.makedirs("images", exist_ok=True)

download_results = []
counter = 1

for url, data in image_records.items():
    parsed = urllib.parse.urlparse(url)
    raw_filename = os.path.basename(parsed.path)
    if not raw_filename:
        raw_filename = f"image_{counter}.jpg"
    # Unquote filename
    clean_filename = urllib.parse.unquote(raw_filename)
    # Sanitize filename for Windows
    safe_filename = "".join(c for c in clean_filename if c.isalnum() or c in "._- ")
    if not safe_filename:
        safe_filename = f"image_{counter}.jpg"
        
    local_path = os.path.join("images", safe_filename)
    
    # Avoid collisions if same filename but different url
    if os.path.exists(local_path) and data.get("local_filename") != safe_filename:
        name_part, ext = os.path.splitext(safe_filename)
        safe_filename = f"{name_part}_{counter}{ext}"
        local_path = os.path.join("images", safe_filename)
        
    data["local_filename"] = safe_filename
    data["local_rel_path"] = f"images/{safe_filename}"
    
    # Download
    try:
        r = requests.get(url, headers=headers, timeout=20)
        if r.status_code == 200:
            with open(local_path, "wb") as f_out:
                f_out.write(r.content)
            file_size = len(r.content)
            data["status"] = "downloaded"
            data["file_size_bytes"] = file_size
            print(f"[{counter}/{len(image_records)}] Downloaded: {safe_filename} ({file_size} bytes)")
        else:
            data["status"] = f"failed (HTTP {r.status_code})"
            data["file_size_bytes"] = 0
            print(f"[{counter}/{len(image_records)}] Failed {r.status_code}: {url}")
    except Exception as e:
        data["status"] = f"error ({str(e)})"
        data["file_size_bytes"] = 0
        print(f"[{counter}/{len(image_records)}] Error: {url} -> {e}")
        
    counter += 1

with open("downloaded_images_inventory.json", "w", encoding="utf-8") as f:
    json.dump(list(image_records.values()), f, indent=2, ensure_ascii=False)

print("\nDownload complete! Saved downloaded_images_inventory.json")
