import json
import re

# Load scraped pages to extract tables
with open('scraped_pages_data.json', 'r', encoding='utf-8') as f:
    scraped = json.load(f)

products = []
p_id = 1000

# Helper to slugify
def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[\(\)\/\\,\.–]+', '-', text)
    text = re.sub(r'[^a-z0-9\-]+', '', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

# 1. APIs from scraped data
apis_page = next((p for p in scraped if p['slug'] == 'apis'), None)
if apis_page:
    from bs4 import BeautifulSoup
    import requests
    soup = BeautifulSoup(apis_page['wp_content'], 'html.parser')
    table = soup.find('table')
    if table:
        for row in table.find_all('tr')[1:]:
            cols = [c.get_text(separator=' ', strip=True) for c in row.find_all(['td', 'th'])]
            if len(cols) >= 3 and cols[0]:
                p_id += 1
                products.append({
                    "id": p_id,
                    "slug": slugify(cols[0]),
                    "chemical_name": cols[0],
                    "cas_number": cols[1] if cols[1] != '–' else None,
                    "category": { "name": "Active Pharmaceutical Ingredients", "slug": "api" },
                    "therapeutic_category": cols[2] if cols[2] != '–' else None,
                    "grade": "Pharma Grade (IP/BP/USP)",
                    "short_description": f"{cols[0]} is an Active Pharmaceutical Ingredient classified under {cols[2]}.",
                    "image": { "url": "/images/apis.jpg", "alt": f"{cols[0]} API" },
                    "related_industries": [{ "slug": "healthcare", "title": "Healthcare & Pharmaceutical Industry" }]
                })

# 2. Solvents & others from solvents page
solv_page = next((p for p in scraped if p['slug'] == 'solvents'), None)
if solv_page:
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(solv_page['wp_content'], 'html.parser')
    tables = soup.find_all('table')
    
    # Table 0: Solvents
    if len(tables) > 0:
        for row in tables[0].find_all('tr')[1:]:
            cols = [c.get_text(separator=' ', strip=True) for c in row.find_all(['td', 'th'])]
            if len(cols) >= 2 and cols[0]:
                p_id += 1
                cat = cols[2] if len(cols) > 2 and cols[2] != '–' else "Industrial Solvent"
                products.append({
                    "id": p_id,
                    "slug": slugify(cols[0]),
                    "chemical_name": cols[0],
                    "cas_number": cols[1] if cols[1] != '–' else None,
                    "category": { "name": "Solvents & Base Chemicals", "slug": "solvents" },
                    "therapeutic_category": cat,
                    "grade": "Technical / Industrial Grade",
                    "short_description": f"{cols[0]} supplied for chemical processing and industrial applications.",
                    "image": { "url": "/images/solvents.png", "alt": f"{cols[0]} Solvent" },
                    "related_industries": [{ "slug": "paints-coatings", "title": "Paints and Coatings Industry" }]
                })
                
    # Table 1: Manufacturing Phosphates
    if len(tables) > 1:
        for row in tables[1].find_all('tr')[1:]:
            cols = [c.get_text(separator=' ', strip=True) for c in row.find_all(['td', 'th'])]
            if len(cols) >= 2 and cols[0]:
                p_id += 1
                products.append({
                    "id": p_id,
                    "slug": slugify(cols[0]),
                    "chemical_name": cols[0],
                    "cas_number": cols[1] if cols[1] != '–' else None,
                    "category": { "name": "Manufacturing Products (Phosphates)", "slug": "manufacturing-phosphates" },
                    "therapeutic_category": "Phosphate Salt",
                    "grade": "Anhydrous & Crystals",
                    "short_description": f"In-house manufactured {cols[0]} available in crystalline and anhydrous forms.",
                    "image": { "url": "/images/chemical-2.jpg", "alt": f"{cols[0]} Phosphate" },
                    "related_industries": [{ "slug": "food-beverage", "title": "Food and Beverage Industry" }]
                })

    # Table 2: Imports (China Make)
    if len(tables) > 2:
        for row in tables[2].find_all('tr')[1:]:
            cols = [c.get_text(separator=' ', strip=True) for c in row.find_all(['td', 'th'])]
            if len(cols) >= 2 and cols[0]:
                p_id += 1
                products.append({
                    "id": p_id,
                    "slug": slugify(cols[0]),
                    "chemical_name": cols[0],
                    "cas_number": cols[1] if cols[1] != '–' else None,
                    "category": { "name": "Own Import Products (China Make)", "slug": "imports" },
                    "therapeutic_category": "Imported Reagent",
                    "grade": "Direct Import Grade",
                    "short_description": f"Directly imported {cols[0]} with verified global manufacturer sourcing.",
                    "image": { "url": "/images/supply.png", "alt": f"{cols[0]} Imported Chemical" },
                    "related_industries": [{ "slug": "water-treatment", "title": "Water Treatment & Environmental Management" }]
                })

    # Table 3: Acids
    if len(tables) > 3:
        for row in tables[3].find_all('tr')[1:]:
            cols = [c.get_text(separator=' ', strip=True) for c in row.find_all(['td', 'th'])]
            if len(cols) >= 2 and cols[0]:
                p_id += 1
                products.append({
                    "id": p_id,
                    "slug": slugify(cols[0]),
                    "chemical_name": cols[0],
                    "cas_number": cols[1] if cols[1] != '–' else None,
                    "category": { "name": "Technical & Commercial Acids", "slug": "acids" },
                    "therapeutic_category": "Inorganic / Organic Acid",
                    "grade": "Commercial & Technical Acid",
                    "short_description": f"{cols[0]} supplied in bulk packaging for industrial processing.",
                    "image": { "url": "/images/chemical-2.jpg", "alt": f"{cols[0]} Acid" },
                    "related_industries": [{ "slug": "textile", "title": "Textile Industry" }]
                })

print(f"Extracted {len(products)} verified products!")

ts_code = "import { ProductDto } from './types';\n\nexport const VERIFIED_PRODUCTS: ProductDto[] = " + json.dumps(products, indent=2, ensure_ascii=False) + ";\n"

with open("frontend/src/api/verifiedProducts.ts", "w", encoding="utf-8") as f_out:
    f_out.write(ts_code)

print("Generated frontend/src/api/verifiedProducts.ts")
