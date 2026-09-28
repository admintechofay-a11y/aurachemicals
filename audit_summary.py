import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scraped_pages_data.json', encoding='utf-8') as f:
    pages = json.load(f)

for p in pages:
    h1s = [h['text'] for h in p['headings'] if h['tag'] == 'h1']
    h2s = [h['text'] for h in p['headings'] if h['tag'] == 'h2']
    meta_desc = p['meta_tags'].get('description', '')
    ctas = [a['text'] for a in p['links'] if any(k in a['text'].lower() for k in ['explore', 'quote', 'now', 'destination', 'contact', 'submit'])]
    img_no_alt = sum(1 for img in p['images'] if not img.get('alt'))
    print(f"URL: {p['url']}")
    print(f"  Title: {p['doc_title']}")
    print(f"  H1: {h1s}")
    print(f"  H2: {h2s[:3]}")
    print(f"  Meta Desc: {'Present (' + meta_desc[:40] + '...)' if meta_desc else 'None'}")
    print(f"  Images: {len(p['images'])} (Missing alt: {img_no_alt})")
    print(f"  Forms: {len(p['forms'])}")
    print(f"  CTAs: {list(set(ctas))}")
    print("-" * 50)
