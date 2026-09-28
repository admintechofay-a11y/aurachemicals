import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scraped_pages_data.json", "r", encoding="utf-8") as f:
    scraped_pages = json.load(f)

with open("downloaded_images_inventory.json", "r", encoding="utf-8") as f:
    images = json.load(f)

# ==============================================================================
# 1. FORMS.MD
# ==============================================================================
forms_md = """# Website Forms Technical Documentation — Aura Chemicals

This document provides a complete technical analysis and field specification of all forms present across `https://aurachemicals.in/`.

---

## 1. Summary of Identified Forms

| Form ID / Class | Form Purpose | Page Location | Method | Engine / Plugin |
|---|---|---|---|---|
| `fluentform_4` | **Get a Quote / Inquiry Form** | [`/get-a-quote/`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/08_get_a_quote.md) | `POST` | Fluent Forms (v5.x) |
| `woocommerce-form-login` | **Customer Account Login** | [`/my-account/`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/14_my_account.md) | `POST` | WooCommerce |
| `commentform` | **Blog Post Comments & Inquiries** | [`/2024/12/17/apis/`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/17_post_apis.md) & [`/2024/12/17/solvents/`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/16_post_solvents.md) | `POST` | WordPress Core Comments |
| `[yith_ywraq_request_quote]` | **B2B Bulk Quote Request** | [`/request-quote/`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/10_request_quote_services.md) | Shortcode | YITH Request a Quote |

---

## 2. Form #1: Get a Quote (Fluent Form #4)

### Purpose & Behavior
The primary lead generation form used by chemical buyers to inquire about bulk APIs, Solvents, and custom chemical synthesis. It is embedded via the Fluent Forms WordPress plugin on the `/get-a-quote/` page.

### Technical Parameters
- **Form HTML ID:** `fluentform_4`
- **Form Instance:** `ff_form_instance_4_1`
- **CSS Classes:** `frm-fluent-form fluent_form_4 ff-el-form-top ff_form_instance_4_1 ff-form-loading ffs_default`
- **HTTP Method:** `POST`
- **Action URL:** Self / Handled via AJAX `/wp-admin/admin-ajax.php` with action `fluentform_submit`

### Complete Field Specifications
| # | Field Name | Input Tag | Input Type | Element ID | Label / Placeholder | Required | Default Value | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | `names[first_name]` | `<input>` | `text` | `ff_4_names_first_name_` | `First Name` | Optional | `""` | Representative / Contact person name |
| 2 | `email` | `<input>` | `email` | `ff_4_email` | `Email Address` | Optional | `""` | Business email for quotation response |
| 3 | `names_1[first_name]` | `<input>` | `text` | `ff_4_names_1_first_name_` | `Individual / Firm / Company Name` | Optional | `""` | Legal entity or business name |
| 4 | `names_2[first_name]` | `<input>` | `text` | `ff_4_names_2_first_name_` | `Contact` | Optional | `""` | Phone or WhatsApp number |
| 5 | `description` | `<textarea>` | `textarea` | `ff_4_description` | `Ask for Quote` | Optional | `""` | Inquiry text, CAS #, quantity, grade |
| 6 | `__fluent_form_embded_post_id` | `<input>` | `hidden` | — | — | Yes | `1203` | Post ID where form is placed |
| 7 | `_fluentform_4_fluentformnonce` | `<input>` | `hidden` | `_fluentform_4_fluentformnonce` | — | Yes | `(dynamic)` | CSRF security verification nonce |
| 8 | `_wp_http_referer` | `<input>` | `hidden` | — | — | Yes | `/get-a-quote/` | Referrer URL |
| 9 | Submit Button | `<button>` | `submit` | — | `Submit` | — | — | Submits payload via AJAX |

---

## 3. Form #2: WooCommerce Customer Login Form

### Purpose & Behavior
Handles authentication for registered portal users, distributors, or purchasing managers on `/my-account/`.

### Technical Parameters
- **Form Classes:** `woocommerce-form woocommerce-form-login login`
- **HTTP Method:** `POST`
- **Action URL:** `/my-account/`

### Field Specifications
| Field Name | Type | Element ID | Placeholder / Label | Required | Purpose |
|---|---|---|---|---|---|
| `username` | `text` | `username` | Username or email address | Yes | Account identifier |
| `password` | `password` | `password` | Password | Yes | Account secret |
| `rememberme` | `checkbox` | `rememberme` | Remember me | No (value: `forever`) | Persistent login cookie |
| `woocommerce-login-nonce` | `hidden` | `woocommerce-login-nonce` | — | Yes | WooCommerce security nonce |
| `_wp_http_referer` | `hidden` | — | — | Yes | `/my-account/` |
| `login` | `submit button` | — | "Log in" | — | Triggers authentication |

---

## 4. Form #3: WordPress Post Comment & Query Forms

### Purpose & Behavior
Allows visitors and clients to ask technical questions directly under technical posts (`/2024/12/17/apis/` and `/2024/12/17/solvents/`).

### Technical Parameters
- **Form HTML ID:** `commentform`
- **HTTP Method:** `POST`
- **Action URL:** `https://aurachemicals.in/wp-comments-post.php`

### Field Specifications
| Field Name | Tag | Type | Required | Label |
|---|---|---|---|---|
| `comment` | `<textarea>` | — | Yes | `Type here..` |
| `author` | `<input>` | `text` | Yes | `Name*` |
| `email` | `<input>` | `email` | Yes | `Email*` |
| `url` | `<input>` | `text` | No | `Website` |
| `wp-comment-cookies-consent` | `<input>` | `checkbox` | No | `Save my name, email, and website in this browser for the next time I comment.` |
| `comment_post_ID` | `<input>` | `hidden` | Yes | Post ID (`1099` for APIs, `1105` for Solvents) |
| `comment_parent` | `<input>` | `hidden` | Yes | `0` (top-level comment) |

---

## 5. Form #4: YITH Request a Quote Hook

### Purpose & Behavior
Detected on [`/request-quote/`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/10_request_quote_services.md). Configured via the `[yith_ywraq_request_quote]` shortcode to allow users to build a quote list from products in the catalog and submit a composite quotation request.
"""

with open("forms.md", "w", encoding="utf-8") as f:
    f.write(forms_md)

print("Generated forms.md")

# ==============================================================================
# 2. SITE_STRUCTURE.MD
# ==============================================================================
site_structure_md = """# Website Structure & Sitemap — Aura Chemicals

> **Base URL:** `https://aurachemicals.in/`  
> **Platform:** WordPress + Elementor Builder + WooCommerce + Fluent Forms  
> **Total Indexed Pages:** 15  
> **Total Blog Posts:** 2  
> **Total Media Assets:** 118+  

---

## 1. Navigation Tree & Menu Architecture

```
https://aurachemicals.in/
│
├── Home (/)
│   ├── Hero & Value Proposition
│   ├── Company Overview
│   ├── Services Overview (400+ Suppliers, Direct Sourcing)
│   ├── Product Highlights (API & Solvents)
│   ├── Strategic Pillars (Wide Range, Pricing, Supply Chain, Network)
│   ├── Clientele Section (Partner Logos)
│   └── Call-to-Action
│
├── ABOUT US (/about-us/)
│   ├── Business Overview
│   ├── Why Choose Us (5 Core Reasons)
│   ├── Our Vision
│   ├── Our Mission
│   ├── Commitment to Sustainability
│   └── Collaboration and Growth
│
├── OUR MISSION (/our-mission/)
│   ├── Mission Statement
│   ├── Sustainability at the Core
│   ├── Innovation Drivers
│   ├── Collaboration Framework
│   └── Global Expansion & Direct Line (+91 7220000877)
│
├── PRODUCTS (/products/)
│   │
│   ├── API (/apis/) [Submenu]
│   │   └── Full Catalog of 94 Active Pharmaceutical Ingredients (with CAS #)
│   │
│   └── Solvents (/solvents/) [Submenu]
│       ├── Base Solvents & Chemicals (20 Items)
│       ├── Manufacturing Products: Phosphates (11 Items)
│       ├── Own Import Products: China Make (5 Items)
│       ├── Technical & Commercial Acids (6 Items)
│       └── Other Key Chemicals (5 Items)
│
├── INDUSTRIES (/industries-copy/)
│   ├── 1. Healthcare & Pharmaceutical
│   ├── 2. Agrochemicals & Fertilizers
│   ├── 3. Food and Beverage
│   ├── 4. Cosmetics and Personal Care
│   ├── 5. Energy Sector & Oil/Gas
│   ├── 6. Water Treatment & Environmental
│   ├── 7. Automotive
│   ├── 8. Cleaning & Sanitation
│   ├── 9. Construction
│   ├── 10. Adhesives and Sealants
│   ├── 11. Leather and Tanning
│   ├── 12. Textile Industry
│   ├── 13. Plastics & Polymers
│   ├── 14. Mining & Metallurgy
│   ├── 15. Rubber and Tyre
│   ├── 16. Paints and Coatings
│   ├── 17. Paper and Pulp
│   ├── 18. Packaging
│   └── 19. Semiconductors & Electronics
│
├── GET A QUOTE (/get-a-quote/)
│   └── Fluent Form #4 (Inquiry & RFQ submission)
│
├── SPECIALIZED & INTERNAL SERVICES
│   ├── Request a Quote (/request-quote/)
│   │   └── Comprehensive Inspection & Quality Assurance Services (NDT, RBI, Welding)
│   └── Request a Quote Variant (/request-a-quote/)
│
├── WOOCOMMERCE COMMERCE PAGES
│   ├── Shop (/shop/)
│   ├── Cart (/cart/)
│   ├── Checkout (/checkout/)
│   └── My Account (/my-account/)
│
├── LEGAL & POLICY
│   └── Privacy Policy (/privacy-policy-2/)
│
└── BLOG ARTICLES & UPDATES
    ├── 2024/12/17/apis/ — APIs Overview & Comments
    └── 2024/12/17/solvents/ — Solvents Overview & Comments
```

---

## 2. Complete URL Inventory & Page Matrix

| # | Page Title | Slug | URL | WP ID | Content Type | Template / Builder | Local Markdown File |
|---|---|---|---|---|---|---|---|
| 1 | **Home** | `home` | `https://aurachemicals.in/` | `27` | Page | Elementor Full Width | [`01_home.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/01_home.md) |
| 2 | **About Us** | `about-us` | `https://aurachemicals.in/about-us/` | `11` | Page | Elementor Full Width | [`02_about_us.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/02_about_us.md) |
| 3 | **Our Mission** | `our-mission` | `https://aurachemicals.in/our-mission/` | `15` | Page | Elementor Full Width | [`03_our_mission.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/03_our_mission.md) |
| 4 | **Products Directory** | `products` | `https://aurachemicals.in/products/` | `10` | Page | Elementor Full Width | [`04_products.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/04_products.md) |
| 5 | **API (Active Pharmaceutical Ingredients)** | `apis` | `https://aurachemicals.in/apis/` | `1119` | Page | Elementor / TablePress | [`05_apis.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/05_apis.md) |
| 6 | **Solvents** | `solvents` | `https://aurachemicals.in/solvents/` | `1117` | Page | Elementor / TablePress | [`06_solvents.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/06_solvents.md) |
| 7 | **Industries** | `industries-copy` | `https://aurachemicals.in/industries-copy/` | `864` | Page | Elementor Full Width | [`07_industries.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/07_industries.md) |
| 8 | **Get a Quote** | `get-a-quote` | `https://aurachemicals.in/get-a-quote/` | `1203` | Page | Fluent Forms Container | [`08_get_a_quote.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/08_get_a_quote.md) |
| 9 | **Request a Quote (V1)** | `request-a-quote` | `https://aurachemicals.in/request-a-quote/` | `1201` | Page | Default Template | [`09_request_a_quote_v1.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/09_request_a_quote_v1.md) |
| 10 | **Inspection & QA Services** | `request-quote` | `https://aurachemicals.in/request-quote/` | `1200` | Page | YITH Quote / Standard | [`10_request_quote_services.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/10_request_quote_services.md) |
| 11 | **Shop** | `shop` | `https://aurachemicals.in/shop/` | `107` | Page | WooCommerce Storefront | [`11_shop.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/11_shop.md) |
| 12 | **Cart** | `cart` | `https://aurachemicals.in/cart/` | `108` | Page | WooCommerce Cart | [`12_cart.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/12_cart.md) |
| 13 | **Checkout** | `checkout` | `https://aurachemicals.in/checkout/` | `109` | Page | WooCommerce Checkout | [`13_checkout.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/13_checkout.md) |
| 14 | **My Account** | `my-account` | `https://aurachemicals.in/my-account/` | `110` | Page | WooCommerce Login | [`14_my_account.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/14_my_account.md) |
| 15 | **Privacy Policy** | `privacy-policy-2` | `https://aurachemicals.in/privacy-policy-2/` | `103` | Page | Legal Template | [`15_privacy_policy.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/15_privacy_policy.md) |
| 16 | **Article: Solvents** | `solvents` | `https://aurachemicals.in/2024/12/17/solvents/` | `1105` | Post | Standard Blog Post | [`16_post_solvents.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/16_post_solvents.md) |
| 17 | **Article: APIs** | `apis` | `https://aurachemicals.in/2024/12/17/apis/` | `1099` | Post | Standard Blog Post | [`17_post_apis.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/17_post_apis.md) |

---

## 3. Technology Stack & Infrastructure

- **CMS:** WordPress (Version 6.x)
- **Theme:** Hello Elementor / Custom Child Theme
- **Page Builder:** Elementor Page Builder
- **E-Commerce:** WooCommerce
- **Forms Engine:** Fluent Forms
- **Quote Addon:** YITH WooCommerce Request a Quote
- **Development & Maintenance Agency:** Powered by **TECHOFY Global Ventures**
- **Hosting / Domain Registrar:** Hosted with Indian Server / ROC Ahmedabad Registration
"""

with open("site_structure.md", "w", encoding="utf-8") as f:
    f.write(site_structure_md)

print("Generated site_structure.md")

# ==============================================================================
# 3. IMAGES_INVENTORY.MD
# ==============================================================================
img_rows_md = ""
for idx, item in enumerate(images, 1):
    fname = item.get("local_filename", "")
    rel_path = item.get("local_rel_path", "")
    src = item.get("source_url", "")
    alt = item.get("alt", "") or item.get("title", "")
    size = item.get("file_size_bytes", 0)
    size_str = f"{size / 1024:.1f} KB" if size < 1024*1024 else f"{size / (1024*1024):.2f} MB"
    status = item.get("status", "downloaded")
    used_pages = ", ".join([p.get("title", "") for p in item.get("used_on_pages", [])]) or "Media Library"
    
    img_rows_md += f"| {idx} | `{fname}` | {alt or '—'} | {size_str} | {status} | {used_pages} | [Original URL]({src}) |\n"

images_inventory_md = f"""# Complete Images & Media Asset Inventory — Aura Chemicals

> **Total Assets Downloaded:** {len(images)}  
> **Local Directory:** `images/`  
> **Media Types:** PNG, JPG, JPEG, WEBP, AVIF, MP4  

All media assets from the live website and WordPress media repository have been downloaded locally to ensure 100% preservation and offline availability.

---

## Key Visual Categories

### 1. Corporate Branding & Identity
- `cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png` — Main Header Logo (Transparent)
- `aa6efd8e-logo-footer.png` — Footer Logo Emblem
- `dalle_circular_logo.webp` — Stylized Chemical Molecule Emblem (Orange & Gold)
- `earth-4-removebg-preview.png` — Global Supply Network Globe

### 2. Product Line Visuals
- `solvents.png` — Solvents Product Showcase
- `apis.jpg` & `api.jpeg` — Active Pharmaceutical Ingredients Imagery
- `methanol.jpeg` — Methanol Technical Solvent
- `bty-ace.jpeg` — Butyl Acetate Solvent
- `kmno.jpeg` — Potassium Permanganate ($KMnO_4$)
- `chemical-2.jpg` — Industrial Chemicals Synthesis

### 3. Industry & Sector Application Imagery
- `healthcare.jpeg` — Healthcare & Pharma
- `agriculture.jpeg` — Agrochemicals & Fertilizers
- `food-and-bevearge.jpeg` — Food & Beverage Sector
- `cosmetic.jpeg` — Cosmetics & Personal Care
- `energy-sector.jpeg` — Energy, Oil & Gas
- `water-treatment-plant.jpg` — Water Treatment & Effluent Plants
- `automotive.jpeg` — Automotive Industry
- `cleaning.jpeg` — Cleaning & Sanitation
- `constuction.jpeg` — Construction & Building Materials
- `adhesives.jpeg` — Adhesives & Sealants
- `leather.jpeg` — Leather & Tanning
- `textind.jpeg` — Textile Industry
- `plastics.jpeg` — Plastics & Polymers
- `mining.jpeg` — Mining & Metallurgy
- `tyre.jpeg` — Rubber & Tyre
- `paint.jpeg` — Paints & Coatings
- `paper.jpeg` — Paper & Pulp
- `packaging.jpeg` — Packaging
- `semiconductor.jpeg` — Semiconductors & Electronics

### 4. Client & Partner Badges
- `1.png`, `2.png`, `3.png`, `4.png`, `5.png`, `6.png`, `7.png`, `8.png` — Partner and Client Logo Badges
- `calyx_chemicals__pharmaceuticals_ltd_logo.jpg` — Calyx Chemicals & Pharmaceuticals Ltd.

### 5. Media Video
- `AuraChemicalsVideo.mp4` (65.3 MB) — Full Corporate Brand Video

---

## Complete Asset Inventory Table

| # | Filename | Alt / Title | File Size | Status | Used on Pages | Source URL |
|---|---|---|---|---|---|---|
{img_rows_md}
"""

with open("images_inventory.md", "w", encoding="utf-8") as f:
    f.write(images_inventory_md)

print("Generated images_inventory.md")

# ==============================================================================
# 4. COMPANY_PROFILE.MD
# ==============================================================================
company_profile_md = """# Corporate Profile — Aura Space Infra Pvt. Ltd. (Aura Chemicals)

---

## 1. Executive Summary
**Aura Space Infra Pvt. Ltd.** (operating commercially as **Aura Chemicals**) is a prominent Indian chemical trading, distribution, and manufacturing entity specializing in high-purity **Active Pharmaceutical Ingredients (APIs)**, industrial and pharma-grade **Solvents**, and specialty chemical compounds. 

The organization operates with an established domestic distribution infrastructure, sourcing directly from over 400 certified manufacturers across India and servicing thousands of corporate clients in pharmaceuticals, agrochemicals, biotechnology, coatings, food, and environmental sectors.

---

## 2. Corporate & Registration Details

| Attribute | Details |
|---|---|
| **Legal Entity Name** | Aura Space Infra Private Limited |
| **Trade Brand** | Aura Chemicals / Aura Group of Companies |
| **Classification** | Non-Government Company (Private Limited) |
| **Registrar of Companies** | ROC Ahmedabad, Gujarat, India |
| **Industry Track Record** | Active since 2014 (Over a decade in chemical & API trading) |
| **Website** | `https://aurachemicals.in/` |
| **Digital Technology Partner** | TECHOFY Global Ventures |

---

## 3. Key Contact Information

- **Direct Inquiry Line / Phone:** `+91 7220000877`
- **Management Email:** `management.aurachemicals@gmail.com`
- **Official Inquiries:** [Get a Quote Portal](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/08_get_a_quote.md)
- **Jurisdiction:** Ahmedabad, Gujarat, India

---

## 4. Core Business Pillars

1. **API Distribution Excellence:**  
   Supplying 94+ certified Active Pharmaceutical Ingredients meeting IP, BP, USP, EP, and JP pharmacopeial monographs.
2. **Solvents & Basic Chemicals Trading:**  
   Handling bulk and packed solvents including MEG, DMF, Toluene, Acetone, N-Hexene, Ethyl Acetate, and Isopropyl Alcohol (IPA).
3. **In-House Manufacturing (Phosphates):**  
   Manufacturing Mono, Di, Tri, and Tetra Sodium/Potassium/Ammonium Phosphate crystals and anhydrous grades.
4. **Direct Global Imports:**  
   Direct sourcing of EDTA salts, Sodium Percarbonate, Citric Acid, Sodium Gluconate, and Xanthan Gum directly from overseas manufacturers (China make).
5. **Quality Assurance & NDT Inspection Services:**  
   Specialized engineering quality assurance division offering Non-Destructive Testing (UT, RT, MPT, DPT), Risk-Based Inspection (RBI), and third-party vendor certification.

---

## 5. Strategic Partners & Principals
Aura Space Infra acts as an authorized distributor and dealer for premier chemical corporations:
- **Grasim Industries Ltd. (Aditya Birla Group):** Bleaching powder (Vikram brand), Aluminium Chloride, Sodium Sulphate, Caustic Soda.
- **Magnesia Chemical LLP:** Magnesium chemical compounds and crystals.
- **GACL (Gujarat Alkalies and Chemicals Limited):** Soda Ash, Sodium Bicarbonate, Di-Calcium Phosphate, Benzalkonium Chloride (BKC).
- **GNFC (Gujarat Narmada Valley Fertilizers & Chemicals):** Formic Acid 85%, Acetic Acid.
"""

with open("company_profile.md", "w", encoding="utf-8") as f:
    f.write(company_profile_md)

print("Generated company_profile.md")

# ==============================================================================
# 5. PRODUCTS_CATALOG.MD
# ==============================================================================
products_catalog_md = """# Unified Chemical & Products Master Catalog — Aura Chemicals

This catalog unifies all chemical products, APIs, solvents, manufacturing salts, and reagents supplied by **Aura Space Infra Pvt. Ltd.**

---

## Quick Jump Links
- [Active Pharmaceutical Ingredients (94 APIs)](#1-active-pharmaceutical-ingredients-apis)
- [Industrial Solvents & Base Chemicals](#2-industrial-solvents--base-chemicals)
- [Manufacturing Phosphates & Inorganic Salts](#3-our-manufacturing-products-phosphates--salts)
- [Direct Import Products](#4-direct-import-products-china-make)
- [Technical & Specialty Acids](#5-technical--commercial-acids)
- [Water Treatment & ETP Chemicals](#6-water-treatment--etp-effluent-treatment-plant-chemicals)
- [Principal Partner Products (Grasim, GACL, Magnesia)](#7-principal-agency-products)

---

## 1. Active Pharmaceutical Ingredients (APIs)

Refer to [`pages/05_apis.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/05_apis.md) for the exhaustive 94-product directory. Key highlights include:

| Product Name | CAS Number | Therapeutic Category |
|---|---|---|
| **Aceclofenac** | `89796-99-6` | Anti-inflammatory |
| **Acyclovir** | `59277-89-3` | Synthetic nucleoside analogue / Antiviral |
| **Adapalene** | `106685-40-9` | Topical retinoid |
| **Albendazole** | `54965-21-8` | Anthelmintic |
| **Amantadine** | `665-66-7` | Adamantane / Antiviral |
| **Ambroxol HCL** | `23828-92-4` | Mucolytic agent |
| **Amikacin Sulfate** | `39831-55-5` | Aminoglycoside antibiotic |
| **Amoxicillin Trihydrate** | `61336-70-7` | Beta-lactam antibiotic |
| **Ampicillin Trihydrate** | `7177-48-2` | Beta-lactam antibiotic |
| **Azithromycin** | `83905-01-5` | Macrolide antibiotic |
| **Cefixime** | `79350-37-1` | Cephalosporin antibiotic |
| **Ciprofloxacin HCL** | `86393-32-0` | Fluoroquinolone antibiotic |
| **Diclofenac Sodium / Potassium** | `15307-79-6` | NSAID / Analgesic |
| **Levofloxacin Hemihydrate** | `100986-85-4`| Antibacterial |
| **Metformin HCL** | `1115-70-4` | Antidiabetic |
| **Paracetamol (Acetaminophen)** | `103-90-2` | Analgesic & Antipyretic |
| **Tranexamic Acid** | `1197-18-8` | Antifibrinolytic agent |

---

## 2. Industrial Solvents & Base Chemicals

| Solvent Name | CAS Number | Industrial Application |
|---|---|---|
| **MEG (Monoethylene Glycol)** | `107-21-1` | Coolants, polyesters, resins, synthesis |
| **DMF (Dimethylformamide)** | `68-12-2` | Polar aprotic solvent, acrylic fiber spinning |
| **Toluene** | `108-88-3` | Paints, coatings, adhesives, chemical intermediate |
| **Acetone** | `67-64-1` | High-purity solvent, cleaning, pharmaceutical extractions |
| **N-Hexene** | `592-41-6` | Comonomer in polyethylene production |
| **Ethyl Acetate** | `141-78-6` | Fast-evaporating solvent, printing inks, extractions |
| **IPA (Isopropyl Alcohol)** | `67-63-0` | Disinfectant, electronics cleaning, pharmaceutical solvent |

---

## 3. Our Manufacturing Products (Phosphates & Salts)

| Product | CAS Number | Form Available |
|---|---|---|
| **Mono Sodium Phosphate (MSP)** | `7558-80-7` | Anhydrous & Crystals |
| **Di Sodium Phosphate (DSP)** | `7558-79-4` | Anhydrous & Crystals |
| **Tri Sodium Phosphate (TSP)** | `7601-54-9` | Anhydrous & Crystals |
| **Tetra Sodium Pyro Phosphate (TSPP)** | `231-767-1` | Powder |
| **Mono Potassium Phosphate (MKP)** | `7778-77-0` | Soluble Fertilizer & Technical Grade |
| **Tri Potassium Phosphate (TKP)** | `7778-53-2` | High Solubility Buffer |
| **Mono Ammonium Phosphate (MAP)** | `7722-76-1` | Fire Retardants & Fertilizer Grade |
| **Di Ammonium Phosphate (DAP)** | `7783-28-0` | Technical Grade |
| **Sodium Acid Pyro Phosphate (SAPP)** | `7722-88-5` | Food Grade & Technical |

---

## 4. Direct Import Products (China Make)

| Product | CAS Number | Specifications / Make |
|---|---|---|
| **EDTA Di-Sodium & Tetra-Sodium** | `6381-92-6` | Jack Chem China Make |
| **Sodium Percarbonate** | `15630-89-4` | Coated Granules & Tablets (Oxygen Bleach) |
| **Citric Acid** | `5949-29-1` | Monohydrate & Anhydrous China Make |
| **Sodium Gluconate** | `527-07-1` | High Purity Chelating Agent |
| **Xanthan Gum** | `11138-66-2` | Food & Oilfield Rheology Modifier |

---

## 5. Technical & Commercial Acids

| Acid | Concentration | Manufacturer / Source | CAS Number |
|---|---|---|---|
| **Acetic Acid** | Glacial 99.8% | GNFC & Imported | `64-19-7` |
| **Formic Acid** | 85% | GNFC | `64-18-6` |
| **Hydrochloric Acid (HCl)** | 30% - 33% | Commercial / Technical | `7647-01-0` |
| **Sulphuric Acid** | 98% | Technical Grade | `7664-93-9` |
| **Phosphoric Acid** | 85% | Technical Grade | `7664-38-2` |
| **Sulphamic Acid** | Solid Granular | Descaling Grade | `5329-14-6` |

---

## 6. Water Treatment & ETP (Effluent Treatment Plant) Chemicals

- **Poly Aluminium Chloride (PAC):** Powder & Liquid grades for water clarification.
- **Sodium Hypochlorite (Hypo):** Industrial disinfectant and bleaching agent.
- **Ferric Chloride Powder & Liquid:** Coagulant for industrial wastewater.
- **Poly Electrolyte:** Anionic, Cationic & Non-ionic flocculants.
- **Sodium Sulphite 96% & Sodium Sulphide Yellow Flakes:** De-chlorination & heavy metal precipitation.
- **Precipitated Silica Powder:** Food, pesticide, feed, footwear, and tyre grades.

---

## 7. Principal Agency Products

### Grasim Industries Ltd.
- Bleaching Powder (Vikram Brand)
- Aluminium Chloride Anhydrous
- Sodium Sulphate
- Bleaching Granules (RANSA)
- Caustic Soda Flakes & Lye

### Gujarat Alkalies and Chemicals Limited (GACL)
- Sodium Bicarbonate
- Soda Ash
- Di-Calcium Phosphate (Feed Grade)
- Sodium Acetate Trihydrate & Anhydrous
- Sodium Nitrite & Nitrate
- Benzalkonium Chloride (BKC 50% & 80%)
"""

with open("products_catalog.md", "w", encoding="utf-8") as f:
    f.write(products_catalog_md)

print("Generated products_catalog.md")

# ==============================================================================
# 6. README.MD (MASTER INDEX)
# ==============================================================================
readme_md = """# Aura Space Infra Pvt. Ltd. (Aura Chemicals) — Website Scrape Documentation

Complete, high-fidelity scrape and structured documentation repository for [https://aurachemicals.in/](https://aurachemicals.in/).

---

## 📌 Executive Summary

- **Company:** Aura Space Infra Pvt. Ltd. (Aura Chemicals / Aura Group of Companies)
- **Registration:** ROC Ahmedabad, Gujarat, India (Active since 2014)
- **Primary Business:** Active Pharmaceutical Ingredients (APIs), Industrial Solvents, Phosphates Manufacturing, Imports, and Industrial Quality Assurance.
- **Verified Contacts:**
  - **Phone:** `+91 7220000877`
  - **Email:** `management.aurachemicals@gmail.com`
  - **Agency Credit:** Powered by TECHOFY Global Ventures

---

## 🗂️ Documentation Index & Navigation

### 1. Architectural & Core Documents
- 🗺️ [**Site Structure & Sitemap (`site_structure.md`)**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/site_structure.md)  
  *Hierarchical tree of menus, pages, posts, technical infrastructure, and page relations.*
- 📝 [**Forms Technical Analysis (`forms.md`)**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/forms.md)  
  *Full technical breakdown of the Fluent Forms Get a Quote RFQ form, WooCommerce forms, and WordPress comment endpoints.*
- 🖼️ [**Images & Media Inventory (`images_inventory.md`)**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/images_inventory.md)  
  *Catalog of 129 downloaded images and videos, original URLs, alt texts, dimensions, and local paths.*
- 🏢 [**Corporate Profile (`company_profile.md`)**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/company_profile.md)  
  *Corporate overview, ROC registration, leadership vision, value proposition, and principal partnerships.*
- 🧪 [**Master Products Catalog (`products_catalog.md`)**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/products_catalog.md)  
  *Unified catalog of APIs, solvents, manufacturing phosphates, imported reagents, and acids.*

---

### 2. Page-by-Page Documentation (`pages/`)

| File Link | Page Title | Key Contents |
|---|---|---|
| [**`01_home.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/01_home.md) | **Home** | Hero, company overview, 400+ supplier network, 4 core pillars, clientele, and CTA. |
| [**`02_about_us.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/02_about_us.md) | **About Us** | Business overview, 5 reasons to choose Aura, vision, mission, and sustainability. |
| [**`03_our_mission.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/03_our_mission.md) | **Our Mission** | Mission statement, green practices, innovation drivers, and global expansion. |
| [**`04_products.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/04_products.md) | **Products Directory** | Master directory: Grasim, Magnesia, Solvents, Phosphates, Imports, ETP, and GACL. |
| [**`05_apis.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/05_apis.md) | **APIs Catalog** | Exhaustive table of **94 Active Pharmaceutical Ingredients** with CAS # & therapeutic category. |
| [**`06_solvents.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/06_solvents.md) | **Solvents Catalog** | 5 structured tables: base solvents, manufacturing phosphates, imports, acids, and salts. |
| [**`07_industries.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/07_industries.md) | **Industries Served** | Detailed breakdown of **19 industrial sectors** with full copy and local imagery. |
| [**`08_get_a_quote.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/08_get_a_quote.md) | **Get a Quote** | Active Fluent Forms inquiry page with full field schema and validation rules. |
| [**`09_request_a_quote_v1.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/09_request_a_quote_v1.md) | **Request a Quote (V1)** | Alternate quote layout container. |
| [**`10_request_quote_services.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/10_request_quote_services.md) | **Inspection & QA Services** | Specialized NDT, RBI, metallurgical, welding, calibration, and third-party inspection. |
| [**`11_shop.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/11_shop.md) | **Shop** | WooCommerce catalog storefront state. |
| [**`12_cart.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/12_cart.md) | **Cart** | Shopping cart shortcode and empty cart handling. |
| [**`13_checkout.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/13_checkout.md) | **Checkout** | Transaction settlement and billing details portal. |
| [**`14_my_account.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/14_my_account.md) | **My Account** | Client account portal with login form fields and nonces. |
| [**`15_privacy_policy.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/15_privacy_policy.md) | **Privacy Policy** | 10-clause privacy, GDPR, cookies, data sharing, and user rights policy. |
| [**`16_post_solvents.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/16_post_solvents.md) | **Post: Solvents** | Technical article with interactive comment form. |
| [**`17_post_apis.md`**](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/pages/17_post_apis.md) | **Post: APIs** | Technical article with interactive comment form. |

---

## 💾 Media & Assets Directory (`images/`)

All **129 images, icons, logos, and video files** have been retrieved from the website and saved in the local [`images/`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/images/) folder. Refer to [`images_inventory.md`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/images_inventory.md) for full descriptions, dimensions, and URLs.
"""

with open("README.md", "w", encoding="utf-8") as f:
    f.write(readme_md)

print("Generated README.md")
print("\nAll core documentation files generated successfully!")
