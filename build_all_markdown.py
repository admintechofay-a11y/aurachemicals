import json
import os
import requests
from bs4 import BeautifulSoup
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load scraped pages and image inventory
with open("scraped_pages_data.json", "r", encoding="utf-8") as f:
    scraped_pages = json.load(f)

with open("downloaded_images_inventory.json", "r", encoding="utf-8") as f:
    image_inventory = json.load(f)

# Helper map: URL -> local image record
url_to_img = {}
for img in image_inventory:
    url_to_img[img["source_url"]] = img
    # Also without trailing slash or variations if any
    base_src = img["source_url"].split("?")[0]
    url_to_img[base_src] = img

def get_page_by_id(pid):
    for p in scraped_pages:
        if p["id"] == pid:
            return p
    return None

def get_page_by_slug(slug, ptype="page"):
    for p in scraped_pages:
        if p["slug"] == slug and p["type"] == ptype:
            return p
    return None

os.makedirs("pages", exist_ok=True)

# -------------------------------------------------------------
# 1. GENERATE pages/01_home.md
# -------------------------------------------------------------
p_home = get_page_by_slug("home")
home_md = f"""# Home — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_home['url']}]({p_home['url']})  
> **WordPress Page ID:** {p_home['id']}  
> **Status:** Published / Active Homepage  
> **Last Modified:** {p_home.get('modified', 'N/A')}  

---

## 1. Page Header & Navigation
- **Website Brand:** Aura Group of Companies / Aura Space Infra Pvt. Ltd.
- **Top Navigation Menu:**
  - [Home](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/01_home.md)
  - [About Us](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/02_about_us.md)
  - [Our Mission](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/03_our_mission.md)
  - [Products](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/04_products.md)
    - [API](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/05_apis.md)
    - [Solvents](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/06_solvents.md)
  - [Industries](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/07_industries.md)
  - [Get a Quote](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/08_get_a_quote.md)

---

## 2. Hero Section
- **Subtitle:** Aura Group of Companies
- **Main Heading:** Aura Space Infra Pvt. Ltd.
- **Tagline:** *Your trusted partner in Chemical Excellence*
- **Call-to-Action:** [Explore More](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/02_about_us.md)

---

## 3. Our Company Overview
> The company has received a highly regarded reputation for reliable and quality suppliers and services from many decades of experiences in the market, long-term close relationship with customers, and thus a deep understanding of customer needs.

---

## 4. Our Services
- **Assured Quality & Security:** Assured quality and security in API supplies via 400+ leading suppliers around India.
- **Client Base:** Active with many thousands of customers across multiple industries.
- **Direct Domestic Sourcing:** Direct sourcing from domestic manufacturers with expertise in chemistry. The company can efficiently secure supplies, create customized compounds, and deliver high-quality products to customers.

---

## 5. Our Core Product Lines
- **Solvents:** High-purity industrial and pharmaceutical solvents.
- **API (Active Pharmaceutical Ingredients):** Comprehensive range of certified APIs.
- **Call-to-Action Button:** [Explore Now](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/05_apis.md)

---

## 6. Value Proposition & Key Pillars

### Wide Range of Products
Aura Chemicals offers a diverse portfolio of chemical solutions catering to various industries. Whether you're in manufacturing, agriculture, or healthcare, we have the right products to meet your specific needs.

### Competitive Pricing
Experience affordability without compromising quality. Aura Chemicals offers competitive pricing, making our products accessible to businesses of all sizes.

### Reliable Supply Chain
Count on a consistent and reliable supply chain when you choose Aura Chemicals. We understand the importance of timely deliveries, ensuring that your operations run smoothly without interruptions.

### Extensive Network & Corporate Registration
Through experiences over 7 years since 2014 in the API distribution business. It is classified as a Non-Government company and is registered at the **Registrar of Companies (ROC) Ahmedabad**.

---

## 7. Our Clientele
> **Together We Can Make Awesome Memories**
Aura Chemicals partners with leading chemical and pharmaceutical manufacturing leaders across India.

---

## 8. Closing Call-to-Action
> **Join Us on the Journey to Excellence**  
> Whether you're a small-scale enterprise or a large industrial player, Aura Chemicals Pvt Ltd invites you to join us on the journey to excellence. Experience the reliability, innovation, and customer satisfaction that have made us a trusted name in chemical trading.  
> At Aura Chemicals Pvt Ltd, we go beyond trading chemicals; we forge partnerships, empower industries, and contribute to a future of sustainable growth. Choose us as your preferred chemical trading partner, and let's build success together.

- **Destination Button:** [Your Destination](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/04_products.md)

---

## 9. Footer Details
- **Copyright:** Copyright © 2026 Aura Space Infra . Ltd.
- **Powered by:** TECHOFY Global Ventures

---

## 10. Images on This Page
| Image Preview | Filename | Alt Text | Dimensions | Original Source |
|---|---|---|---|---|
| ![Logo](../images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png) | `cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png` | Aura Chemicals Logo | 185x58 | [Source](https://aurachemicals.in/wp-content/uploads/2024/01/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png) |
| ![Hero Lab](../images/pexels-pixabay-247763-1024x683.jpg) | `pexels-pixabay-247763-1024x683.jpg` | Laboratory Equipment Banner | 1024x683 | [Source](https://aurachemicals.in/wp-content/uploads/2024/10/pexels-pixabay-247763-1024x683.jpg) |
| ![Solvents](../images/solvents.png) | `solvents.png` | Solvents Product Line | 1024x1024 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/solvents.png) |
| ![APIs](../images/apis.jpg) | `apis.jpg` | API Active Pharmaceutical Ingredients | 1024x1024 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/apis.jpg) |
| ![Emblem](../images/dalle_circular_logo.webp) | `dalle_circular_logo.webp` | Aura Chemical Emblem | 1024x1024 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/DALL·E_2024-12-14_12.10.20_-_A_circular_logo_design_with_a_clean_and_modern_aesthetic__using_shades_of_orange_and_golden_colors._The_logo_features_a_variety_of_abstract_chemical_r-transformed.webp) |
| ![Supply Chain](../images/supply.png) | `supply.png` | Reliable Supply Chain Icon | 512x512 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/supply.png) |
| ![Global Network](../images/earth-4-removebg-preview-260x300.png) | `earth-4-removebg-preview-260x300.png` | Global Earth Network | 260x300 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/earth-4-removebg-preview-260x300.png) |
| ![Partner 1](../images/1.png) | `1.png` | Client Partner 1 | 300x150 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/1.png) |
| ![Partner 2](../images/2.png) | `2.png` | Client Partner 2 | 300x150 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/2.png) |
| ![Partner 3](../images/3.png) | `3.png` | Client Partner 3 | 300x150 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/3.png) |
| ![Partner 4](../images/4.png) | `4.png` | Client Partner 4 | 300x150 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/4.png) |
| ![Partner 5](../images/5.png) | `5.png` | Client Partner 5 | 300x150 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/5.png) |
| ![Partner 6](../images/6.png) | `6.png` | Client Partner 6 | 300x150 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/6.png) |
| ![Partner 7](../images/7.png) | `7.png` | Client Partner 7 | 300x150 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/7.png) |
| ![Partner 8](../images/8.png) | `8.png` | Client Partner 8 | 300x150 | [Source](https://aurachemicals.in/wp-content/uploads/2024/12/8.png) |
"""

with open("pages/01_home.md", "w", encoding="utf-8") as f:
    f.write(home_md)

print("Generated pages/01_home.md")

# -------------------------------------------------------------
# 2. GENERATE pages/02_about_us.md
# -------------------------------------------------------------
p_about = get_page_by_slug("about-us")
about_md = f"""# About Us — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_about['url']}]({p_about['url']})  
> **WordPress Page ID:** {p_about['id']}  
> **Status:** Published  

---

## 1. Overview
At **Aura Space Infra Private Limited**, we are a trusted and reliable name in the global pharmaceutical and chemical trading industry. With over a decade of experience, we specialize in providing high-quality APIs (Active Pharmaceutical Ingredients), intermediates, and specialty chemicals that meet stringent regulatory standards. Our commitment to sourcing and trading products of the highest quality ensures that we meet the diverse needs of our clients across various industries, including pharmaceuticals, agrochemicals, biotechnology, and more.

---

## 2. Business Overview
Aura Space Infra Private Limited is a premier distributor and service provider of a wide range of high-quality solvents and APIs for the pharmaceutical industry, as well as other key sectors such as agrochemicals, biotechnology, food and beverage, and cosmetics. We specialize in sourcing and trading products that meet the strictest regulatory standards while catering to the ever-evolving demands of our diverse client base.

---

## 3. Why Choose Us?
Aura is your trusted partner for trading high-quality APIs and solvents that meet international regulatory requirements. Here’s why our clients in industries such as pharmaceuticals, agrochemicals, and biotechnology choose us:

1. **Reliable Sourcing:**  
   We have built strong relationships with leading manufacturers to ensure the highest quality products.
2. **Regulatory Compliance:**  
   All our products comply with stringent global regulations and standards, ensuring safety and quality.
3. **Diverse Product Portfolio:**  
   We provide a wide range of solvents and APIs suitable for various industries and applications, including cosmetics and food and beverage.
4. **Customer-Centric Service:**  
   Our team works closely with clients to understand their needs and provide tailored solutions that exceed expectations.
5. **Timely Delivery:**  
   We prioritize on-time delivery, helping our clients maintain smooth operations and avoid supply chain disruptions.

---

## 4. Our Vision
At Aura Space Infra Private Limited, our vision is to be the leading trading company in the API and chemical sector, recognized for delivering exceptional products and services. We aim to provide value to our clients by sourcing and trading high-quality materials that support innovation and growth in industries across the globe, from pharmaceuticals to biotechnology. Our commitment to ethical business practices and sustainability ensures we make a positive impact on our clients, communities, and the environment.

---

## 5. Our Mission
Our mission is to provide reliable, cost-effective, and high-quality solutions to our clients. We strive to be the trusted partner of choice in the API and chemical distribution industry, continuously expanding our product offerings and services to meet the growing needs of the markets we serve, including agrochemicals, food and beverage, and cosmetics. Our focus on sustainability, regulatory compliance, and innovation drives us to constantly improve and adapt in a rapidly changing world.

---

## 6. Commitment to Sustainability
Sustainability is at the core of our business practices. We ensure that the products we trade are environmentally responsible and aligned with global standards for safety and sustainability. Our commitment to sustainability extends beyond the products we offer, as we actively work to reduce our carbon footprint and promote green practices across our operations, supporting industries like environmental manufacturing and agrochemicals.

---

## 7. Collaboration and Growth
At Aura Space Infra Pvt Ltd, we believe in the power of collaboration. We work closely with our clients, suppliers, and partners to foster innovation and drive sustainable growth. Our team is committed to fostering a work environment that encourages learning, development, and the exchange of ideas to support our shared vision for the future, especially in industries like biotechnology and food and beverage.

---

## 8. Contact Information
- **Phone:** `+91 7220000877`
- **Email:** `management.aurachemicals@gmail.com`
- **Registration:** Registrar of Companies (ROC) Ahmedabad
- **Parent Entity:** Aura Group of Companies
"""

with open("pages/02_about_us.md", "w", encoding="utf-8") as f:
    f.write(about_md)

print("Generated pages/02_about_us.md")

# -------------------------------------------------------------
# 3. GENERATE pages/03_our_mission.md
# -------------------------------------------------------------
p_mission = get_page_by_slug("our-mission")
mission_md = f"""# Our Mission — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_mission['url']}]({p_mission['url']})  
> **WordPress Page ID:** {p_mission['id']}  
> **Status:** Published  

---

## 1. Our Mission Statement
At Aura Space Infra Private Limited, our mission is to be the leading and most trusted chemical trading partner by delivering superior quality Active Pharmaceutical Ingredients (APIs), solvents, and specialty chemicals. We are dedicated to providing sustainable, reliable, and cost-effective chemical solutions that drive innovation and empower industries worldwide.

---

## 2. Sustainability at the Core
Sustainability is at the heart of our mission. We are dedicated to promoting environmentally responsible practices by sourcing and distributing eco-friendly and high-performance chemicals that align with global environmental standards. Our aim is to empower industries to achieve their goals while reducing their ecological footprint.

---

## 3. Innovation Drives Us
Innovation drives our approach as we continuously seek to adopt advanced technologies, improve supply chain efficiency, and provide unparalleled customer support. We endeavor to anticipate market demands, offering competitive pricing, timely delivery, and personalized service to exceed client expectations.

---

## 4. Collaboration and Growth
We believe in the power of collaboration, not only within our organization but also with our stakeholders. By fostering an inclusive and growth-oriented environment, we empower our team members to contribute their expertise and passion, driving our shared vision forward.

---

## 5. Our Long-Term Vision
At Aura Chemicals, we envision a future where we are recognized as a leading chemical trading company that balances profitability with responsibility, providing value to our clients, communities, and the planet. Our journey is guided by the principle of excellence, as we continue to innovate, adapt, and lead in the dynamic world of chemical trade.

---

## 6. Global Expansion & Contact
Aura Chemicals continues to expand its footprint globally with a commitment to excellence, sustainability, and innovation. For more information or inquiries, reach out to us:
- **Phone:** `+91 7220000877`
- **Email:** `management.aurachemicals@gmail.com`
"""

with open("pages/03_our_mission.md", "w", encoding="utf-8") as f:
    f.write(mission_md)

print("Generated pages/03_our_mission.md")

# -------------------------------------------------------------
# 4. GENERATE pages/04_products.md
# -------------------------------------------------------------
p_products = get_page_by_slug("products")
products_md = f"""# Products Master Directory — Aura Chemicals

> **Source URL:** [{p_products['url']}]({p_products['url']})  
> **WordPress Page ID:** {p_products['id']}  
> **Status:** Published Master Catalog  

Aura Space Infra Pvt. Ltd. provides a comprehensive product portfolio spanning manufacturing products, direct imports, principal agency products (Grasim, Magnesia Chemical, GACL), solvents, and specialty acids.

---

## 1. M/S. GRASIM IND. LTD. Products
- Bleaching Powder (Vikram Brand)
- Aluminium Chloride
- Sodium Sulphate
- Bleaching Granules (RANSA)
- Caustic Flakes & Lye
- Poly Aluminium Chloride (PAC Powder & Liquid)

---

## 2. M/S. MAGNESIA CHEMICAL LLP Products
- Powder Technical
- Crystalline Granules
- Normal Crystal
- Bold Crystal

---

## 3. Solvents
- **MEG** (Monoethylene Glycol)
- **DMF** (Dimethylformamide)
- **TOLUENE**
- **ACETONE**
- **N-HEXENE**
- **ETHYL ACETATE**
- **IPA** (Isopropyl Alcohol)

---

## 4. Our Manufacturing Products (Phosphates)
- Mono Sodium Phosphate (Anhydrous & Crystals)
- Di Sodium Phosphate (Anhydrous & Crystals)
- Tri Sodium Phosphate (Anhydrous & Crystals)
- Tetra Sodium Pyro Phosphate
- Mono Potassium Phosphate
- Tri Potassium Phosphate
- Mono Ammonium Phosphate
- Sodium Acid Pyro Phosphate
- Di Potassium Phosphate
- Tetra Potassium Pyro Phosphate
- Di Ammonium Phosphate

---

## 5. Our Own Import Products
- **EDTA di-sodium / Tetra Sodium & EDTA Acid** (Jack Chem China)
- **Sodium Percarbonate Coated Granules & Tablets** (China Make)
- **Citric Acid Mono / Anhydrous** (China Make)
- **Sodium Gluconate**
- **Xanthan Gum**

---

## 6. Products for ETP (Effluent Treatment Plants) & Commercial Grades
- Technical Urea
- Aluminium Sulphate (Ferric & Non-Ferric)
- Ferric Chloride Powder
- Sodium Hypochlorite (Hypo)
- Lime
- Anti-Scaling Agent
- Bleaching Powder (GACL Make)
- Poly Electrolyte
- Sodium Sulphite 96%
- Sodium Sulphide ($Na_2S$) Yellow Flakes (Iron-Free)
- Textile Chemicals / Commercial Grade
- Tartaric Acid
- Citric Acid
- Oxalic Acid
- Precipitated Silica Powder (Powder & Granules Grade):
  - Pesticide grade
  - Tyre grade
  - Food grade
  - Feed grade
  - Footwear grade
  - Toothpaste grade

---

## 7. Other Chemicals
- Bleaching Powder
- HP (Hydrogen Peroxide)
- Caustic Potash
- Caustic Prills
- Potassium Carbonate Granules & Powder
- PAC (Poly Aluminium Chloride) Powder & Liquid

---

## 8. GACL (Gujarat Alkalies and Chemicals Limited) Products
- Sodium Bicarbonate
- Soda Ash
- Di-Calcium Phosphate (Feed Grade)
- Sodium Acetate Trihydrate & Anhydrous
- Sodium Nitrite & Nitrate
- BKC 50% & 80% (Benzalkonium Chloride)
- Calcium Carbonate (Limestone)

---

## 9. Acids
- Acetic Acid (Imported & GNFC)
- Formic Acid 85% (GNFC)
- Hydrochloric Acid (HCl)
- Sulphuric Acid 98%
- Phosphoric Acid Tech. 85%
- Sulphamic Acid
"""

with open("pages/04_products.md", "w", encoding="utf-8") as f:
    f.write(products_md)

print("Generated pages/04_products.md")

# -------------------------------------------------------------
# 5. GENERATE pages/05_apis.md (WITH FULL 94-ITEM TABLE)
# -------------------------------------------------------------
# Let's extract table rows from the live page or soup
p_api = get_page_by_slug("apis")
api_soup = BeautifulSoup(requests.get("https://aurachemicals.in/apis/", headers={"User-Agent": "Mozilla/5.0"}).text, 'html.parser')
api_table = api_soup.find('table')
api_rows = []
if api_table:
    for tr in api_table.find_all('tr'):
        cols = [c.get_text(separator=' ', strip=True) for c in tr.find_all(['th', 'td'])]
        if cols:
            api_rows.append(cols)

api_table_md = "| # | Product Name | CAS Number | Therapeutic Category |\n|---|---|---|---|\n"
for idx, r in enumerate(api_rows[1:], 1):
    pname = r[0] if len(r) > 0 else ""
    cas = r[1] if len(r) > 1 else ""
    cat = r[2] if len(r) > 2 else ""
    api_table_md += f"| {idx} | **{pname}** | `{cas}` | {cat} |\n"

apis_page_md = f"""# Active Pharmaceutical Ingredients (API) Catalog

> **Source URL:** [{p_api['url']}]({p_api['url']})  
> **WordPress Page ID:** {p_api['id']}  
> **Total API Items:** {len(api_rows)-1}  

Aura Space Infra Pvt. Ltd. supplies high-grade Active Pharmaceutical Ingredients (APIs) sourced from over 400 certified manufacturers across India. All materials adhere to international pharmacopeial standards (IP/BP/USP/EP).

---

## Complete API Product Directory

{api_table_md}

---

## Sourcing & Quality Compliance
- **Pharmacopeial Compliance:** IP, BP, USP, EP, and JP standards.
- **Documentation Provided:** Certificate of Analysis (CoA), MSDS, Route of Synthesis (ROS), Stability Data, and GMP Certifications upon request.
- **Inquiry:** Contact `+91 7220000877` or request a quotation at [Get a Quote](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/08_get_a_quote.md).
"""

with open("pages/05_apis.md", "w", encoding="utf-8") as f:
    f.write(apis_page_md)

print(f"Generated pages/05_apis.md with {len(api_rows)-1} API records.")

# -------------------------------------------------------------
# 6. GENERATE pages/06_solvents.md (WITH ALL 5 TABLES)
# -------------------------------------------------------------
p_solvents = get_page_by_slug("solvents")
solv_soup = BeautifulSoup(requests.get("https://aurachemicals.in/solvents/", headers={"User-Agent": "Mozilla/5.0"}).text, 'html.parser')
solv_tables = solv_soup.find_all('table')

def format_table(tbl, headers_list):
    md = "| " + " | ".join(headers_list) + " |\n|" + "|".join(["---"] * len(headers_list)) + "|\n"
    rows = tbl.find_all('tr')
    for r in rows[1:]:
        cols = [c.get_text(separator=' ', strip=True) for c in r.find_all(['th', 'td'])]
        # Pad cols if needed
        while len(cols) < len(headers_list):
            cols.append("")
        md += "| " + " | ".join(f"`{c}`" if i == 1 and c != "–" else c for i, c in enumerate(cols)) + " |\n"
    return md

solvents_page_md = f"""# Solvents & Specialty Chemicals Catalog

> **Source URL:** [{p_solvents['url']}]({p_solvents['url']})  
> **WordPress Page ID:** {p_solvents['id']}  
> **Status:** Published Catalog  

Aura Space Infra Pvt. Ltd. provides a comprehensive inventory of industrial solvents, manufactured phosphates, imported reagents, technical acids, and specialty compounds.

---

## 1. Solvents & Base Chemicals
{format_table(solv_tables[0], ['Product / Solvent', 'CAS Number', 'Therapeutic / Technical Category'])}

---

## 2. Our Manufacturing Products (Phosphates & Salts)
{format_table(solv_tables[1], ['Product Name', 'CAS Number'])}

---

## 3. Our Own Import Products (China Make)
{format_table(solv_tables[2], ['Product Name', 'CAS Number'])}

---

## 4. Technical & Commercial Acids
{format_table(solv_tables[3], ['Acid Name', 'CAS Number'])}

---

## 5. Other Key Chemicals
{format_table(solv_tables[4], ['Product Name', 'CAS Number'])}

---

## Packaging & Logistics
- **Solvent Packaging:** Available in Tankers, ISO Tanks, 200L MS/HDPE Drums, and IBC Containers.
- **Dry Chemical Packaging:** 25kg, 50kg HDPE bags with liner, or Jumbo Bags (1 MT).
"""

with open("pages/06_solvents.md", "w", encoding="utf-8") as f:
    f.write(solvents_page_md)

print("Generated pages/06_solvents.md with 5 structured tables.")

# -------------------------------------------------------------
# 7. GENERATE pages/07_industries.md
# -------------------------------------------------------------
p_ind = get_page_by_slug("industries-copy")
ind_soup = BeautifulSoup(requests.get("https://aurachemicals.in/industries-copy/", headers={"User-Agent": "Mozilla/5.0"}).text, 'html.parser')

industries_md = f"""# Industries Served — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_ind['url']}]({p_ind['url']})  
> **WordPress Page ID:** {p_ind['id']}  
> **Status:** Published  

Aura Space Infra Pvt. Ltd. serves over 19 diverse industrial sectors across India and global markets.

---

## 1. Healthcare & Pharmaceutical Industry
![Healthcare](../images/healthcare.jpeg)
At Aura Chemicals, we are dedicated to advancing the healthcare and pharmaceutical sector by supplying high-purity APIs, intermediates, and specialty chemicals. Our products comply with stringent regulatory standards, ensuring safety, efficacy, and consistency in pharmaceutical formulations. We support the development of life-saving medications and healthcare solutions, helping our partners meet critical health challenges globally.

---

## 2. Agrochemicals & Fertilizers
![Agriculture](../images/agriculture.jpeg)
We provide high-quality chemicals essential for the formulation of pesticides, herbicides, and fertilizers. Our agrochemical solutions are tailored to enhance crop yield, protect against pests and diseases, and improve soil fertility. By supporting modern agricultural practices, Aura Chemicals plays a pivotal role in promoting food security and sustainable farming.

---

## 3. Food and Beverage Industry
![Food and Beverage](../images/food-and-bevearge.jpeg)
Our portfolio includes food-grade chemicals, additives, preservatives, and acidulants that comply with international food safety standards. We enable food manufacturers to improve shelf life, enhance flavor profiles, and maintain the texture and appearance of their products, ensuring safe and high-quality food for consumers.

---

## 4. Cosmetics and Personal Care
![Cosmetics](../images/cosmetic.jpeg)
Aura Chemicals supplies specialized raw materials, including emulsifiers, preservatives, surfactants, and active ingredients, to the cosmetics and personal care sector. Our ingredients help formulate safe, high-performing skincare, haircare, and personal hygiene products that meet the growing consumer demand for quality and sustainability.

---

## 5. Energy Sector & Oil/Gas
![Energy Sector](../images/energy-sector.jpeg)
Aura Chemicals provides essential chemical solutions tailored to the unique demands of the energy sector. From specialty chemicals for oil and gas extraction and refining to products supporting renewable energy technologies, we deliver high-performance solutions that enhance operational efficiency and environmental compliance.

---

## 6. Water Treatment & Environmental Management
![Water Treatment](../images/water-treatment-plant.jpg)
We offer a comprehensive range of water treatment chemicals, including coagulants, flocculants, disinfectants, biocides, and scale inhibitors. These chemicals are critical for treating municipal and industrial wastewater, ensuring safe drinking water, and meeting environmental compliance standards for effluent discharge.

---

## 7. Automotive Industry
![Automotive](../images/automotive.jpeg)
Aura Chemicals provides high-performance chemicals used in automotive manufacturing and maintenance. From coatings and adhesives to specialty fluids, coolants, and cleaners, our solutions contribute to the durability, safety, and efficiency of modern vehicles.

---

## 8. Cleaning and Sanitation Industry
![Cleaning](../images/cleaning.jpeg)
Our diverse portfolio includes disinfectants, surfactants, and sanitizing agents designed for industrial, commercial, and household cleaning. These chemicals ensure optimal hygiene and cleanliness, supporting sanitation standards in hospitals, institutions, and homes.

---

## 9. Construction Industry
![Construction](../images/constuction.jpeg)
Aura is a trusted partner for the construction industry, offering a wide range of high-performance chemicals designed to enhance building materials and construction processes. Our products include concrete additives, waterproofing agents, sealants, accelerators, and retarders that improve the durability, strength, and workability of construction materials.

---

## 10. Adhesives and Sealants Industry
![Adhesives](../images/adhesives.jpeg)
We supply high-performance resins, polymers, plasticizers, and solvents that improve bonding strength, flexibility, and resistance to environmental stress. Our solutions cater to packaging, construction, woodworking, and automotive industries.

---

## 11. Leather and Tanning Industry
![Leather](../images/leather.jpeg)
We provide high-quality chemicals essential for beamhouse, tanning, and finishing processes. Our products help produce soft, durable, and weather-resistant leather while supporting eco-friendly tanning solutions.

---

## 12. Textile Industry
![Textile](../images/textind.jpeg)
Our comprehensive range of chemicals is tailored to meet the needs of textile processing, from pre-treatment, dyeing, and printing to finishing. We provide eco-friendly solutions that ensure vibrant colors, soft hand-feel, and durable fabrics.

---

## 13. Plastics and Polymers Industry
![Plastics](../images/plastics.jpeg)
Our portfolio includes plasticizers, stabilizers, additives, and catalysts that improve the flexibility, durability, and strength of plastic products across packaging, construction, and consumer goods.

---

## 14. Mining and Metallurgy
![Mining](../images/mining.jpeg)
We offer flotation agents, leaching chemicals, corrosion inhibitors, and solvent extraction reagents designed to optimize mineral extraction, ore refining, and treatment of mining by-products.

---

## 15. Rubber and Tyre Industry
![Tyre](../images/tyre.jpeg)
Supplying vulcanizing agents, accelerators, fillers, antioxidants, and specialty additives that enhance elasticity, tensile strength, and heat resistance in rubber and tyre formulations.

---

## 16. Paints and Coatings Industry
![Paint](../images/paint.jpeg)
Resins, binders, pigments, solvents, and additives that improve color retention, durability, texture, adhesion, and weather resistance for industrial, decorative, and automotive finishes.

---

## 17. Paper and Pulp Industry
![Paper](../images/paper.jpeg)
Chemicals for pulping, bleaching, sizing, and water treatment that enhance paper strength, brightness, and manufacturing runnability.

---

## 18. Packaging Industry
![Packaging](../images/packaging.jpeg)
Barrier coatings, adhesives, and polymer additives that enhance the strength, shelf life, and sustainability of rigid and flexible packaging materials.

---

## 19. Semiconductors and Electronics
![Semiconductor](../images/semiconductor.jpeg)
Ultra-high-purity chemical reagents, etchants, and cleaning solvents engineered for semiconductor wafer fabrication and electronic component manufacturing.
"""

with open("pages/07_industries.md", "w", encoding="utf-8") as f:
    f.write(industries_md)

print("Generated pages/07_industries.md with all 19 industries.")

# -------------------------------------------------------------
# 8. GENERATE pages/08_get_a_quote.md
# -------------------------------------------------------------
p_quote = get_page_by_slug("get-a-quote")
quote_md = f"""# Get a Quote — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_quote['url']}]({p_quote['url']})  
> **WordPress Page ID:** {p_quote['id']}  
> **Status:** Published Form Page  

---

## 1. Overview
The **Get a Quote** page hosts the primary interactive quote inquiry form powered by Fluent Forms for prospective buyers, chemical manufacturers, and pharmaceutical clients.

---

## 2. Embedded Form Details (Fluent Form #4)

### Form Technical Specifications
- **Form Plugin:** Fluent Forms (v5.x)
- **Form ID:** `fluentform_4`
- **Form Instance:** `ff_form_instance_4_1`
- **Method:** `POST`
- **Action URL:** Self / AJAX Endpoint (`/wp-admin/admin-ajax.php`)
- **Nonce Field:** `_fluentform_4_fluentformnonce`

### Form Input Fields Schema
| Field Name | HTML Tag | Input Type | Element ID | Label / Placeholder | Required | Description |
|---|---|---|---|---|---|---|
| `names[first_name]` | `<input>` | `text` | `ff_4_names_first_name_` | `First Name` | No | Client's representative name |
| `email` | `<input>` | `email` | `ff_4_email` | `Email Address` | No | Business contact email |
| `names_1[first_name]` | `<input>` | `text` | `ff_4_names_1_first_name_` | `Individual / Firm / Company Name` | No | Company / Legal Entity name |
| `names_2[first_name]` | `<input>` | `text` | `ff_4_names_2_first_name_` | `Contact` | No | Phone / Mobile contact number |
| `description` | `<textarea>` | `textarea` | `ff_4_description` | `Ask for Quote` | No | Details of required chemicals, quantity, grade, and delivery location |
| `submit` | `<button>` | `submit` | — | `Submit` | — | Triggers form submission |

### Hidden Security Fields
- `__fluent_form_embded_post_id`: `1203`
- `_fluentform_4_fluentformnonce`: (Dynamic session nonce)
- `_wp_http_referer`: `/get-a-quote/`

---

## 3. Alternative Contact Channels
If preferred, clients can directly reach the sales and procurement desk:
- **Phone:** `+91 7220000877`
- **Email:** `management.aurachemicals@gmail.com`
- **Corporate Entity:** Aura Space Infra Pvt. Ltd. (ROC Ahmedabad)
"""

with open("pages/08_get_a_quote.md", "w", encoding="utf-8") as f:
    f.write(quote_md)

print("Generated pages/08_get_a_quote.md")

# -------------------------------------------------------------
# 9. GENERATE pages/09_request_a_quote_v1.md
# -------------------------------------------------------------
p_req_a = get_page_by_slug("request-a-quote")
req_a_md = f"""# Request a Quote (Variant 1) — Aura Space Infra

> **Source URL:** [{p_req_a['url']}]({p_req_a['url']})  
> **WordPress Page ID:** {p_req_a['id']}  
> **Status:** Published / Draft Template  

---

## 1. Page Content
- **Page Heading (H1):** Request a Quote
- **Body Content:** Navigation header, breadcrumbs, placeholder content container, and global footer.
- **Related Active Quote Form:** See [Get a Quote](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/08_get_a_quote.md) for the functional quote submission form.
"""

with open("pages/09_request_a_quote_v1.md", "w", encoding="utf-8") as f:
    f.write(req_a_md)

print("Generated pages/09_request_a_quote_v1.md")

# -------------------------------------------------------------
# 10. GENERATE pages/10_request_quote_services.md
# -------------------------------------------------------------
p_req_s = get_page_by_slug("request-quote")
req_s_md = f"""# Comprehensive Inspection & Quality Assurance Services — Aura Space Infra

> **Source URL:** [{p_req_s['url']}]({p_req_s['url']})  
> **WordPress Page ID:** {p_req_s['id']}  
> **Status:** Published Specialized Services Page  
> **Shortcode Present:** `[yith_ywraq_request_quote]` (YITH WooCommerce Request a Quote)  

---

## 1. Overview
In today’s highly competitive engineering and infrastructure environment, the role of inspection and quality assurance services has become more critical than ever. Companies must not only comply with international codes and standards but also ensure reliability, safety, and long-term performance of their assets.

**Aura Space Infra Pvt. Ltd.** has positioned itself as a trusted partner in this mission, offering a wide spectrum of inspection, testing, and quality control solutions tailored to the needs of industries such as Oil & Gas, Power, Petrochemicals, Refining, Infrastructure, and Manufacturing. Delivering world-class services backed by technical expertise, certified professionals, and a customer-first approach.

---

## 2. Inspection & Testing Services Offered

### 1. Non-Destructive Testing (NDT) Services
- Ultrasonic Testing (UT)
- Radiographic Testing (RT) & Film Interpretation
- Magnetic Particle Testing (MPT)
- Dye Penetrant Testing (DPT)
- Visual Testing (VT)
- Eddy Current Testing (ECT)
- Advanced NDT (Phased Array Ultrasonic Testing – PAUT, Time of Flight Diffraction – TOFD, Digital Radiography)

### 2. Metallurgical & Corrosion Investigation
- Failure Analysis & Root Cause Investigation
- Metallography (Field & Lab)
- Positive Material Identification (PMI)
- Corrosion Assessment & Monitoring
- Coating & Lining Inspection

### 3. Welding & Fabrication Inspection
- Welder and Procedure Qualification (WPS / PQR / WPQ)
- Third-Party Welding Inspection
- Welding Defect Assessment & Repair Approval
- Heat Treatment (Pre/Post Weld) Supervision

### 4. In-Service Inspection & Risk-Based Inspection (RBI)
- Fitness-for-Service (FFS) Assessments
- Risk-Based Inspection (RBI) Studies
- Pressure Vessel, Piping, and Tank Inspection
- Integrity Management for Static Equipment
- API 510 / 570 / 653 Certified Services

### 5. Calibration & Dimensional Inspection
- Instrument Calibration (Pressure, Temperature, Flow, Electrical)
- Dimensional & Geometrical Inspection for Components and Structures
- GA / As-Built Drawing Verification

### 6. Civil & Infrastructure Quality Services
- Concrete Testing & Reinforcement Inspection
- Non-Destructive Civil Tests (Rebound Hammer, Ultrasonic Pulse Velocity)
- Structural Integrity Assessment of Buildings, Bridges, and Infrastructure

### 7. Third-Party Inspection & Certification
- Vendor Inspection & Expediting Services
- Witnessing & Certification as per International Standards (ASME, ASTM, ISO, API, AWS)
- Quality Assurance / Quality Control (QA/QC) Documentation & Review

---

## 3. Why Choose Aura Space Infra Pvt. Ltd.?
- **Technical Expertise:** Team of experienced metallurgists, inspection engineers, welding inspectors, and NDT Level-II/III professionals.
- **Industry Standards Compliance:** Adheres to ASME, API, ISO, AWS, ASTM, BIS, and NABL/ILAC guidelines.
- **Client-Centric Approach:** Customized inspection programs aligned with project timelines and regulatory requirements.
- **Integrated Solutions:** Combining engineering expertise with AI-driven inspection methodologies for next-generation quality assurance.
- **Pan-India Reach:** Serving refineries, petrochemical complexes, EPC projects, fabrication shops, and industrial plants across India.

---

## 4. Delivering Trust, Reliability & Excellence
At Aura Space Infra Pvt. Ltd., inspection is not just about detecting defects—it’s about ensuring safety, performance, and reliability throughout the lifecycle of assets. From design verification to fabrication, from commissioning to in-service inspection, Aura Space Infra provides an end-to-end assurance framework for industries that cannot afford to compromise on quality.
"""

with open("pages/10_request_quote_services.md", "w", encoding="utf-8") as f:
    f.write(req_s_md)

print("Generated pages/10_request_quote_services.md")

# -------------------------------------------------------------
# 11-14. GENERATE WooCommerce Pages (Shop, Cart, Checkout, My Account)
# -------------------------------------------------------------
p_shop = get_page_by_slug("shop")
with open("pages/11_shop.md", "w", encoding="utf-8") as f:
    f.write(f"""# Shop — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_shop['url']}]({p_shop['url']})  
> **WordPress Page ID:** {p_shop['id']}  
> **Status:** Published WooCommerce Storefront  

---

## 1. Page Details
- **Page Title:** Shop
- **Catalog Status:** Configured WooCommerce catalog storefront.
- **Products Displayed:** Direct inquiries are primarily handled via the [API Catalog](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/05_apis.md), [Solvents Catalog](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/06_solvents.md), and [Get a Quote](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/08_get_a_quote.md) forms.
""")

p_cart = get_page_by_slug("cart")
with open("pages/12_cart.md", "w", encoding="utf-8") as f:
    f.write(f"""# Cart — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_cart['url']}]({p_cart['url']})  
> **WordPress Page ID:** {p_cart['id']}  
> **Status:** Published WooCommerce Cart  

---

## 1. Page Details
- **Shortcode:** `[woocommerce_cart]`
- **Cart State:** Your cart is currently empty.
- **Return to Shop Button:** Available linking to `/shop/`.
""")

p_checkout = get_page_by_slug("checkout")
with open("pages/13_checkout.md", "w", encoding="utf-8") as f:
    f.write(f"""# Checkout — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_checkout['url']}]({p_checkout['url']})  
> **WordPress Page ID:** {p_checkout['id']}  
> **Status:** Published WooCommerce Checkout  

---

## 1. Page Details
- **Shortcode:** `[woocommerce_checkout]`
- **Function:** Handles order placement, billing address, and transaction settlement when items are added to cart.
""")

p_account = get_page_by_slug("my-account")
with open("pages/14_my_account.md", "w", encoding="utf-8") as f:
    f.write(f"""# My Account — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_account['url']}]({p_account['url']})  
> **WordPress Page ID:** {p_account['id']}  
> **Status:** Published Customer Account Portal  

---

## 1. Login Form Details
- **Form Class:** `woocommerce-form woocommerce-form-login login`
- **Method:** `POST`
- **Action:** Self (`/my-account/`)
- **Fields:**
  - `username` (Text) — Username or email address
  - `password` (Password) — Account password
  - `rememberme` (Checkbox) — Remember me option
  - `woocommerce-login-nonce` (Hidden) — Nonce verification
  - `login` (Submit Button) — "Log in"
""")

print("Generated pages/11_shop.md to pages/14_my_account.md")

# -------------------------------------------------------------
# 15. GENERATE pages/15_privacy_policy.md
# -------------------------------------------------------------
p_privacy = get_page_by_slug("privacy-policy-2")
with open("pages/15_privacy_policy.md", "w", encoding="utf-8") as f:
    f.write(f"""# Privacy Policy — Aura Space Infra Pvt. Ltd.

> **Source URL:** [{p_privacy['url']}]({p_privacy['url']})  
> **WordPress Page ID:** {p_privacy['id']}  
> **Status:** Published  

---

## 1. Who We Are
Our website address is: `https://aurachemicals.in`. Operated by Aura Space Infra Pvt. Ltd. (ROC Ahmedabad).

---

## 2. Comments
When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.  
An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.

---

## 3. Media
If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.

---

## 4. Cookies
- **Comment Cookies:** If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
- **Login Cookies:** If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser. When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
- **Article Editing Cookies:** If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.

---

## 5. Embedded Content from Other Websites
Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.  
These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.

---

## 6. Who We Share Your Data With
If you request a password reset, your IP address will be included in the reset email.

---

## 7. How Long We Retain Your Data
If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.  
For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.

---

## 8. What Rights You Have Over Your Data
If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.

---

## 9. Where Your Data Is Sent
Visitor comments may be checked through an automated spam detection service.

---

## 10. Contact Information for Privacy Concerns
- **Email:** `management.aurachemicals@gmail.com`
- **Phone:** `+91 7220000877`
- **Entity:** Aura Space Infra Pvt. Ltd.
""")

print("Generated pages/15_privacy_policy.md")

# -------------------------------------------------------------
# 16 & 17. GENERATE Blog Posts (Solvents & APIs)
# -------------------------------------------------------------
p_post_solv = get_page_by_slug("solvents", ptype="post")
with open("pages/16_post_solvents.md", "w", encoding="utf-8") as f:
    f.write(f"""# Post: Solvents — Aura Chemicals Blog

> **Source URL:** [{p_post_solv['url']}]({p_post_solv['url']})  
> **Post ID:** {p_post_solv['id']}  
> **Author:** Aura@2024  
> **Date Published:** December 17, 2024  
> **Status:** Published Article  

---

## 1. Article Details
- **Title:** Solvents
- **Category:** Industrial Chemicals & Solvents
- **Post Navigation:**
  - **Previous Post:** [APIs](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/17_post_apis.md)

---

## 2. Interactive Comment Form
- **Form Action:** `/wp-comments-post.php`
- **Method:** `POST`
- **Fields:**
  - `comment` (Textarea, Required) — Comment message
  - `author` (Text, Required) — Name
  - `email` (Email, Required) — Email address
  - `url` (Text) — Website URL
  - `wp-comment-cookies-consent` (Checkbox) — Save details in browser cookie
""")

p_post_api = get_page_by_slug("apis", ptype="post")
with open("pages/17_post_apis.md", "w", encoding="utf-8") as f:
    f.write(f"""# Post: APIs — Aura Chemicals Blog

> **Source URL:** [{p_post_api['url']}]({p_post_api['url']})  
> **Post ID:** {p_post_api['id']}  
> **Author:** Aura@2024  
> **Date Published:** December 17, 2024  
> **Status:** Published Article  

---

## 1. Article Details
- **Title:** APIs
- **Category:** Pharmaceutical Raw Materials & APIs
- **Post Navigation:**
  - **Next Post:** [Solvents](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/16_post_solvents.md)

---

## 2. Interactive Comment Form
- **Form Action:** `/wp-comments-post.php`
- **Method:** `POST`
- **Fields:**
  - `comment` (Textarea, Required) — Comment message
  - `author` (Text, Required) — Name
  - `email` (Email, Required) — Email address
  - `url` (Text) — Website URL
  - `wp-comment-cookies-consent` (Checkbox) — Save details in browser cookie
""")

print("Generated pages/16_post_solvents.md and pages/17_post_apis.md")

print("\nAll 17 page markdown files generated successfully!")
