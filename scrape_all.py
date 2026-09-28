import requests
from bs4 import BeautifulSoup
import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://aurachemicals.in"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Fetch pages and posts list
pages_resp = requests.get(f"{BASE_URL}/wp-json/wp/v2/pages?per_page=100", headers=headers).json()
posts_resp = requests.get(f"{BASE_URL}/wp-json/wp/v2/posts?per_page=100", headers=headers).json()

all_items = []
for p in pages_resp:
    all_items.append({
        "type": "page",
        "id": p["id"],
        "slug": p["slug"],
        "title": p["title"]["rendered"],
        "link": p["link"],
        "date": p.get("date"),
        "modified": p.get("modified"),
        "wp_content": p.get("content", {}).get("rendered", "")
    })

for p in posts_resp:
    all_items.append({
        "type": "post",
        "id": p["id"],
        "slug": p["slug"],
        "title": p["title"]["rendered"],
        "link": p["link"],
        "date": p.get("date"),
        "modified": p.get("modified"),
        "wp_content": p.get("content", {}).get("rendered", "")
    })

print(f"Total items to scrape: {len(all_items)}")

scraped_pages = []

for item in all_items:
    url = item["link"]
    print(f"\nProcessing {item['type']} [{item['id']}]: {item['title']} ({url})")
    try:
        r = requests.get(url, headers=headers, timeout=15)
        html = r.text
        soup = BeautifulSoup(html, 'html.parser')
        
        # Meta tags
        meta_tags = {}
        for m in soup.find_all('meta'):
            name = m.get('name') or m.get('property')
            content = m.get('content')
            if name and content:
                meta_tags[name] = content
                
        # Title
        doc_title = soup.title.string.strip() if soup.title and soup.title.string else item["title"]
        
        # Headings
        headings = []
        for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
            h_text = h.get_text(separator=' ', strip=True)
            if h_text:
                headings.append({"tag": h.name, "text": h_text})
                
        # Main text content / paragraphs / lists
        # Let's extract structured sections from content area or body
        # Elementor containers
        elementor_widgets = []
        for el in soup.find_all(class_=re.compile(r'elementor-widget-(heading|text-editor|image|button|icon-box|counter)')):
            classes = el.get('class', [])
            text = el.get_text(separator=' ', strip=True)
            elementor_widgets.append({
                "classes": classes,
                "text": text
            })
            
        # All images on this page
        page_images = []
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
            if src:
                page_images.append({
                    "src": src,
                    "alt": img.get('alt', ''),
                    "title": img.get('title', ''),
                    "width": img.get('width', ''),
                    "height": img.get('height', ''),
                    "class": " ".join(img.get('class', []))
                })
                
        # Background images in style attributes
        for tag in soup.find_all(style=re.compile(r'background(?:-image)?:\s*url\(')):
            style = tag['style']
            match = re.search(r'url\([\'"]?(.*?)[\'"]?\)', style)
            if match:
                bg_url = match.group(1)
                page_images.append({
                    "src": bg_url,
                    "alt": "Background Image",
                    "title": "",
                    "width": "",
                    "height": "",
                    "class": "inline-style-bg"
                })
                
        # All links
        page_links = []
        for a in soup.find_all('a', href=True):
            href = a['href'].strip()
            link_text = a.get_text(separator=' ', strip=True)
            if href and not href.startswith('javascript:'):
                page_links.append({"href": href, "text": link_text})
                
        # Forms
        page_forms = []
        for f in soup.find_all('form'):
            form_info = {
                "id": f.get('id', ''),
                "action": f.get('action', ''),
                "method": f.get('method', 'POST'),
                "classes": " ".join(f.get('class', [])),
                "fields": []
            }
            for field in f.find_all(['input', 'textarea', 'select', 'button']):
                form_info["fields"].append({
                    "tag": field.name,
                    "type": field.get('type', ''),
                    "name": field.get('name', ''),
                    "id": field.get('id', ''),
                    "placeholder": field.get('placeholder', ''),
                    "value": field.get('value', ''),
                    "required": field.has_attr('required'),
                    "options": [opt.get_text(strip=True) for opt in field.find_all('option')] if field.name == 'select' else []
                })
            page_forms.append(form_info)
            
        # Clean plain text extraction for general content
        # Remove script, style
        for s in soup(['script', 'style', 'noscript', 'svg']):
            s.decompose()
            
        content_element = soup.find('main') or soup.find(id='content') or soup.find('article') or soup.body
        clean_text = content_element.get_text(separator='\n', strip=True) if content_element else ""

        page_record = {
            "type": item["type"],
            "id": item["id"],
            "slug": item["slug"],
            "wp_title": item["title"],
            "doc_title": doc_title,
            "url": url,
            "date": item["date"],
            "modified": item["modified"],
            "meta_tags": meta_tags,
            "headings": headings,
            "images": page_images,
            "forms": page_forms,
            "links": page_links,
            "clean_text": clean_text,
            "wp_content": item["wp_content"]
        }
        scraped_pages.append(page_record)
        print(f" -> Scraped: Headings={len(headings)}, Images={len(page_images)}, Forms={len(page_forms)}, Links={len(page_links)}")
    except Exception as e:
        print(f"Error scraping {url}: {e}")

with open("scraped_pages_data.json", "w", encoding="utf-8") as f:
    json.dump(scraped_pages, f, indent=2, ensure_ascii=False)

print("\nSuccessfully saved scraped_pages_data.json!")
