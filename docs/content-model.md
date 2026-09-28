# WordPress Content Model & REST API Schema — Aura Chemicals

> **Document Version:** 1.0.0  
> **System Architecture:** Headless WordPress (Backend CMS) + React Vite (Frontend)  
> **Target Endpoint Base:** `/wp-json/wp/v2/` and `/wp-json/aura/v1/`  

---

## 1. Custom Post Types (CPT) Specifications

All CPTs are registered with `show_in_rest = true` to enable full programmatic access via the WordPress REST API.

| Post Type Slug | Singular Label | Plural Label | Public | REST Route | UI Supports | Description |
|---|---|---|---|---|---|---|
| `product` | Product / Chemical | Products | `true` | `/wp-json/wp/v2/product` | `title`, `editor`, `thumbnail`, `excerpt`, `custom-fields` | Individual chemicals, APIs, solvents, salts, and acids. |
| `service` | Service | Services | `true` | `/wp-json/wp/v2/service` | `title`, `editor`, `thumbnail`, `excerpt` | Core capabilities: Sourcing, Supply Chain Logistics, and Inspection/QA. |
| `industry` | Industry Sector | Industries | `true` | `/wp-json/wp/v2/industry` | `title`, `editor`, `thumbnail`, `excerpt` | The 19 verified industrial sectors served by Aura Chemicals. |
| `client` | Client / Partner | Clients | `true` | `/wp-json/wp/v2/client` | `title`, `thumbnail` | Verified client badges and strategic distribution partners. |
| `quote_request` | Quote Request | Quote Requests | `false` *(Admin only)* | `/wp-json/aura/v1/inquiries` *(POST)* | `title`, `custom-fields` | Private lead capture entries submitted via RFQ form. |

> [!NOTE]
> In accordance with Non-Negotiable Rule 1, CPTs `team_member`, `certification`, and `faq` are **omitted** because no verified data exists on the source website.

---

## 2. Taxonomies

### `product_category` (Attached to `product`)
- **Type:** Hierarchical Taxonomy (`show_in_rest = true`)
- **REST Route:** `/wp-json/wp/v2/product_category`
- **Verified Terms (Only categories existing in source content):**
  1. `api` — Active Pharmaceutical Ingredients (94 products)
  2. `solvents` — Solvents & Basic Intermediates (20 products)
  3. `manufacturing-phosphates` — Our Manufacturing Products / Phosphates (11 products)
  4. `imports` — Our Own Import Products / China Make (5 products)
  5. `acids` — Commercial & Industrial Acids (6 products)
  6. `industrial-chemicals` — Effluent Treatment & Industrial Chemicals (14 products)
  7. `grasim-products` — M/S. Grasim Ind. Ltd. Agency Products (6 products)
  8. `magnesia-products` — M/S. Magnesia Chemical LLP Agency Products (4 products)
  9. `gacl-products` — GACL Products (7 products)

---

## 3. Product Field Specifications (Post Meta / ACF)

All fields are **optional**. If a field is empty in WordPress, the frontend UI strictly omits the corresponding row/element (per Non-Negotiable Rule 3).

| Field Slug | Label | Field Type | REST Key | Verified Source Data Example | UI Visibility Rule |
|---|---|---|---|---|---|
| `chemical_name` | Chemical / Trade Name | Text | `meta.chemical_name` | `"Aceclofenac"` / `"Mono Sodium Phosphate"` | Fallback to post title |
| `cas_number` | CAS Number | Text | `meta.cas_number` | `"89796-99-6"` | Hidden if empty |
| `therapeutic_category` | Therapeutic / Functional Category | Text | `meta.therapeutic_category` | `"Anti-inflammatory"` / `"Sanitation agent"` | Hidden if empty |
| `molecular_formula` | Molecular Formula | Text | `meta.molecular_formula` | *Empty in source* | Hidden if empty |
| `molecular_weight` | Molecular Weight | Text | `meta.molecular_weight` | *Empty in source* | Hidden if empty |
| `grade` | Chemical Grade | Text | `meta.grade` | `"Anhydrous & Crystals"` / `"GNFC 85%"` | Hidden if empty |
| `purity` | Purity / Assay | Text | `meta.purity` | *Empty in source* | Hidden if empty |
| `applications` | Industrial Applications | WYSIWYG / Textarea | `meta.applications` | Sector use cases | Hidden if empty |
| `industries` | Associated Industries | Post Object / Relationship | `meta.industry_ids` | IDs of linked `industry` posts | Hidden if empty |
| `packaging` | Packaging Options | Text | `meta.packaging` | `"25kg HDPE Bags"`, `"ISO Tanks"` | Hidden if empty |
| `datasheet_file` | Technical Document / COA / MSDS | File (PDF) | `meta.datasheet_url` | Downloadable PDF URL | Hidden if empty |
| `short_description` | Product Summary | Textarea | `meta.short_description` | 1-2 sentence overview | Hidden if empty |
| `gallery` | Additional Photos | Gallery / Array | `meta.gallery_urls` | Image URLs array | Hidden if empty |
| `seo_title` | Custom SEO Title | Text | `meta.seo_title` | Meta title override | Fallback to post title |
| `seo_description` | Custom Meta Description | Textarea | `meta.seo_description` | Meta description override | Fallback to excerpt |

---

## 4. Industry Field Specifications

| Field Slug | Label | Field Type | REST Key | Description |
|---|---|---|---|---|
| `sector_name` | Industry Sector Name | Text | `title.rendered` | e.g. "Healthcare & Pharmaceutical Industry" |
| `overview` | Sector Overview Copy | WYSIWYG | `content.rendered` | Full verified sector copy from source site |
| `sector_icon` | Sector Icon / Glyph | Image / SVG | `meta.sector_icon` | Optional UI icon |
| `featured_image` | Representative Photo | Image | `_embedded['wp:featuredmedia']` | Verified 612x408 sector photography |
| `display_order` | Sort Order | Number | `meta.display_order` | Ordering integer (1 to 19) |

---

## 5. Service Field Specifications

| Field Slug | Label | Field Type | REST Key | Description |
|---|---|---|---|---|
| `service_title` | Service Title | Text | `title.rendered` | e.g. "Sourcing & Distribution", "Inspection & QA" |
| `overview` | Service Description | WYSIWYG | `content.rendered` | Verified capabilities copy |
| `capabilities_list` | Specific Methods / Tests | Textarea / List | `meta.capabilities_list` | NDT, Metallurgical, Welding, RBI methods |
| `standards_compliance`| Codes & Standards | Text | `meta.standards_compliance`| `"ASME, API, ISO, AWS, ASTM, BIS"` |

---

## 6. Client / Partner Field Specifications

| Field Slug | Label | Field Type | REST Key | Description |
|---|---|---|---|---|
| `client_name` | Client / Partner Name | Text | `title.rendered` | e.g. "Calyx Chemicals & Pharmaceuticals Ltd." |
| `logo` | Partner Logo | Image | `_embedded['wp:featuredmedia']` | Transparent logo badge (300x150) |
| `website_url` | Partner Website | URL | `meta.website_url` | Optional outbound link |

---

## 7. Quote Request Field Specifications (Private CPT: `quote_request`)

| Field Slug | Label | Field Type | Description |
|---|---|---|---|
| `contact_name` | Representative Name | Text | Submitter's full name |
| `company_name` | Company / Firm Name | Text | Submitter's organization |
| `email` | Email Address | Email | Contact email for quotation reply |
| `phone` | Phone / Mobile | Text | Contact phone number |
| `product_name` | Product Inquired | Text | Pre-filled chemical name or free-text |
| `quantity` | Estimated Quantity | Text | e.g., "5 MT", "500 kg", "Drum" |
| `requirement` | Requirement / Grade Details | Textarea | Notes, CAS #, purity expectations |
| `ip_address` | Submitter IP | Text | Security & rate-limiting audit |
| `status` | Lead Status | Select | `new` (default), `in_progress`, `closed` |

---

## 8. Options Pages Architecture

To ensure zero commercial dependency on ACF Pro, options are registered via WordPress native settings API (`register_setting`) and exposed under `/wp-json/aura/v1/settings`:

### A. Company Settings (`/wp-json/aura/v1/settings`)
- `brand_name` (Text: `"Aura Chemicals"`)
- `legal_name` (Text: `"Aura Space Infra Private Limited"`)
- `group_name` (Text: `"Aura Group of Companies"`)
- `tagline` (Text: `"Your Trusted Partner in Chemical Excellence"`)
- `roc_registration` (Text: `"ROC Ahmedabad"`)
- `supplier_count` (Number: `400`)
- `experience_years` (Text: `"7+ Years"`)
- `phone_primary` (Text: `"+91 7220000877"`)
- `email_primary` (Text: `"management.aurachemicals@gmail.com"`)
- `address` (Textarea: *Hidden if empty*)
- `business_hours` (Text: *Hidden if empty*)
- `social_links` (JSON Array: *Hidden if empty*)
- `header_logo_url` (Image URL)
- `footer_logo_url` (Image URL)

### B. Homepage Settings
- `hero_eyebrow` (Text: `"Aura Group of Companies"`)
- `hero_title` (Text: `"Aura Space Infra Pvt. Ltd."`)
- `hero_tagline` (Text: `"Your Trusted Partner in Chemical Excellence"`)
- `hero_image_url` (Image URL)
- `intro_heading` (Text: `"Our Company"`)
- `intro_body` (Textarea: Company overview text)
- `services_heading` (Text: `"Our Services"`)
- `services_body` (Textarea: 400+ supplier and direct domestic sourcing text)
- `clientele_heading` (Text: `"OUR CLIENTELE"`)
- `clientele_subheading` (Text: `"Trusted Partners in Chemical Excellence"`)
- `cta_heading` (Text: `"Join Us on the Journey to Excellence"`)
- `cta_body` (Textarea: Partnership invitation text)

### C. Footer Settings
- `copyright_text` (Text: `"Copyright © 2026 Aura Space Infra Pvt. Ltd. All rights reserved."`)
- `powered_by_text` (Text: `"Powered by TECHOFY Global Ventures"`)
