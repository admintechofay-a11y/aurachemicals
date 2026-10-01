# Exhaustive Technical & Design Audit — Aura Chemicals Website

> **Audit Date:** 2026-09-29  
> **Auditors:** Creative Director & Principal Systems Architect, Front-end & SEO Lead  
> **Target Entity:** Aura Space Infra Private Limited (trading as Aura Chemicals)  
> **Live Site:** `https://aurachemicals.in/`  
> **Repository:** `https://github.com/admintechofay-a11y/aurachemicals`  
> **Evaluation Scope:** Frontend SPA (React 18 + Vite + TypeScript), WordPress Headless Core Plugin & Theme, Media Inventory (129 files), Route Matrix, Content Integrity, Accessibility (axe-core WCAG 2.2 AA), and SEO Crawlability.

---

## Executive Summary of Audit Findings

The existing codebase contains a working React 18 single-page application and WordPress headless bridge, but exhibits fundamental design debt, architectural weaknesses, and trust-eroding artifacts:

1. **Fake Success in RFQ Submissions (`api/client.ts:337-360`):** The inquiry submission function swallows all network errors or bypass triggers and returns a hardcoded `{ success: true, inquiry_id: random }`. A prospective procurement officer inquiring about bulk APIs or solvents would see a fake confirmation screen while their data is silently dropped if the backend is unreachable.
2. **Fabricated & Unverified Clientele Badges:** The homepage features a "Clientele" carousel with placeholder files `1.png` through `8.png` labelled as "Partner Manufacturer 1", "Partner Manufacturer 2", etc. This actively undermines buyer trust.
3. **Severe SEO Blindspots (Pure CSR):** The entire site is rendered client-side (`<div id="root"></div>`). Search engines crawling for "Paracetamol API supplier Ahmedabad", "CAS 103-90-2 Gujarat", or "Mono Sodium Phosphate manufacturer" receive an empty HTML document. Dynamic per-route page titles, meta descriptions, and JSON-LD product schemas are absent during routing.
4. **Media Asset Quality Crisis:** Of 129 local media assets, only 7 meet high-resolution criteria (>1200px) — and several of those are generic Pexels stock photos of smiling models in white coats, which violate B2B material honesty. 42 assets are cropped 150x150 thumbnails or discarded artifacts. 29 industry images are low-res (612x408) JPEG thumbnails.
5. **Accessibility (WCAG 2.2 AA) Violations:** axe-core audits across all 10 key routes revealed serious contrast ratio failures (secondary text `#5A626B` on `#ECEEEF` card surfaces), erratic heading hierarchies (H1 jumping straight to H3), and critical unlabelled form controls (`<select>` without accessible name on the catalog page).
6. **Inconsistent Experience Claims:** The site alternates between "7+ Years", "Over a decade", and "Active since 2014" without mathematical coherence.

---

## 1. Complete Route Inventory

Baseline screenshots captured at 1440px (Desktop), 820px (Tablet), and 390px (Mobile) for all routes and archived in [`docs/redesign/screenshots/baseline/`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/docs/redesign/screenshots/baseline/).

| # | Route URL | Purpose & Buyer Intent | Frontend Component | Data Source | Live Site Equivalent Slug | Baseline Status |
|---|---|---|---|---|---|---|
| 1 | `/` | Corporate value proposition, category entry, company grounding, trust proof | `HomePage.tsx` | `api.getHome()`, `api.getSettings()`, `api.getProducts()` | `/` (Home, ID 27) | **Needs Total Overhaul** (Stock photos, fake partner badges, generic cards) |
| 2 | `/about-us` | Corporate registration, track record, ROC verification, sourcing model | `AboutPage.tsx` | `api.getPage('about-us')` | `/about-us/` (ID 11) | **Needs Editorial Polish** (Excessive generic marketing prose, lacking proof points) |
| 3 | `/our-mission` | Sustainability, innovation, collaboration framework | `MissionPage.tsx` | `api.getPage('our-mission')` | `/our-mission/` (ID 15) | **Merge Candidate** (Redundant with About; should be consolidated into corporate narrative) |
| 4 | `/products` | Unified searchable catalog (APIs, Solvents, Phosphates, Imports, Acids) | `ProductsPage.tsx` | `api.getProducts()`, `api.getProductCategories()` | `/products/`, `/apis/`, `/solvents/` | **Functional but Template-like** (Needs dense tabular view, CAS copy, pharmacopeia filters) |
| 5 | `/products/detail/:slug` | Technical chemical datasheet, specifications, CoA request, RFQ trigger | `ProductDetailPage.tsx` | `api.getProduct(slug)` | N/A (Live site used static TablePress tables) | **Thin Content** (Missing molecular formulas, molecular weight, hazard notes; needs print stylesheet) |
| 6 | `/industries` | 19 target industrial sectors served by Aura chemical supply | `IndustriesPage.tsx` | `api.getIndustries()` | `/industries-copy/` (ID 864) | **Visual Weakness** (Low-res 612x408 images; needs structured product linkage) |
| 7 | `/services` | Engineering quality assurance, NDT inspection, third-party certification | `ServicesPage.tsx` | `api.getServices()` | `/request-quote/` (ID 1200) | **Credible Content, Weak Layout** (Needs rigorous scope tables, standards badges, dedicated inspection RFQ) |
| 8 | `/get-a-quote` | Primary conversion funnel: multi-field commercial RFQ form | `QuotePage.tsx` | `api.submitInquiry()` | `/get-a-quote/` (Fluent Form #4, ID 1203) | **High Critical Risk** (Fakes success on network failure, lacks RFQ multi-product basket) |
| 9 | `/contact` | Corporate contact details, direct telephone/WhatsApp, management email | `ContactPage.tsx` | `api.getSettings()` | N/A (Live site embedded in footer) | **Acceptable baseline** (Needs intent routing: quote vs doc request vs inspection vs general) |
| 10 | `/privacy-policy` | Legal privacy notice under Indian law (DPDP Act alignment) | `PrivacyPolicyPage.tsx` | Static content | `/privacy-policy-2/` (ID 103) | **Needs Legal Review** (Generic template; needs data retention policy for RFQ inquiries) |

### Legacy URL Preservation & 301 Redirect Status

The following legacy WordPress and WooCommerce routes are handled client-side via React Router `<Navigate replace />` in `App.tsx`:
- `/apis` ➔ 301 to `/products/api`
- `/solvents` ➔ 301 to `/products/solvents`
- `/industries-copy` ➔ 301 to `/industries`
- `/request-a-quote` ➔ 301 to `/get-a-quote`
- `/request-quote` ➔ 301 to `/services`
- `/privacy-policy-2` ➔ 301 to `/privacy-policy`
- `/shop` ➔ 301 to `/products` (WooCommerce retired)
- `/cart` ➔ 301 to `/get-a-quote` (WooCommerce retired)
- `/checkout` ➔ 301 to `/get-a-quote` (WooCommerce retired)
- `/my-account` ➔ 301 to `/contact` (WooCommerce retired)
- `/2024/12/17/apis/` ➔ Unhandled (Must redirect to `/products/api`)
- `/2024/12/17/solvents/` ➔ Unhandled (Must redirect to `/products/solvents`)

---

## 2. Content & Claims Inventory (Verification Status)

Every claim in the repository has been traced back to source files and categorized according to truthfulness and launch admissibility.

| # | Content Claim / Statistic | Location in Repo | Source Verification | Status | Launch Action |
|---|---|---|---|---|---|
| 1 | **Legal Entity:** Aura Space Infra Private Limited | `company_profile.md`, `settings.php` | Verified with ROC Ahmedabad records | **VERIFIED** | Retain in header, footer, corporate profile |
| 2 | **Active Since:** 2014 | `company_profile.md`, ROC filings | Verified | **VERIFIED** | Use "Since 2014" uniformly. Remove conflicting "7+ years". |
| 3 | **Experience Claims:** "7+ Years" vs "Over a decade" | `mockData.ts:18`, `02_about_us.md` | Inconsistent. 2014 to 2026 is 12 years. | **INCONSISTENT** | Compute dynamically from 2014 or state "Established 2014". |
| 4 | **Supplier Network:** "400+ certified/audited manufacturers" | `01_home.md:21`, `mockData.ts:19` | Found on live WordPress site, but no audit records or certificates exist | **UNVERIFIED** | Flag to owner. State "Domestic sourcing network across 400+ chemical manufacturers" without claiming accredited audit unless proven. |
| 5 | **Client Base:** "Thousands of corporate clients" | `company_profile.md:8`, `mockData.ts:20` | Unsubstantiated marketing claim | **UNVERIFIED** | Remove specific numeric claim. Rephrase to "Serving formulation and manufacturing plants across India". |
| 6 | **Pharmacopeia Monographs:** IP, BP, USP, EP, JP | `05_apis.md`, `products_catalog.md` | Standard pharmaceutical pharmacopeia monographs | **VERIFIED (Industry Standard)** | Present as typographic specification marks on API product cards and datasheets. |
| 7 | **Principal Partners:** Grasim, GACL, GNFC, Magnesia Chemical LLP | `06_solvents.md`, `products_catalog.md` | Stated in catalog under specific chemical distributorships | **PROVISIONAL** | Render as text list ("Principals and Product Lines We Distribute"). Do NOT display corporate logos without written permission. |
| 8 | **Partner Logos:** `1.png`, `2.png`, `3.png`, `4.png`, `5.png`, `6.png`, `7.png`, `8.png` | `images/`, `mockData.ts:96-102` | Synthetic placeholder logos | **FABRICATED** | **STRICTLY PURGE.** Never render fabricated client logos. |
| 9 | **Client Badge:** Calyx Chemicals & Pharmaceuticals Ltd. | `images/calyx_...jpg`, `mockData.ts:95` | Downloaded from live site media library | **UNCONFIRMED PERMISSION** | Omit logo until owner provides client consent documentation. |
| 10 | **Contact Information:** `+91 7220000877`, `management.aurachemicals@gmail.com` | `company_profile.md`, live site | Direct line and email found on live site | **VERIFIED** | Retain in header, footer, contact bar, and RFQ confirmation. |
| 11 | **Registration Numbers:** GST, CIN, IEC, Drug License numbers | Nowhere in repo | Missing | **MISSING (Launch-Blocking)** | Request from owner. Do not invent. Display placeholders in GAP register. |
| 12 | **Inspection & QA Services:** NDT (UT, RT, MPT, DPT), RBI, Welding | `10_request_quote_services.md`, `api.md:378` | Verified on live site and WordPress service post | **VERIFIED** | Retain with dedicated technical specification table and inspection RFQ variant. |
| 13 | **In-House Manufacturing:** Sodium, Potassium, Ammonium Phosphates | `products_catalog.md:58`, `06_solvents.md` | Stated in corporate profile as manufactured lines | **VERIFIED** | Feature as core manufacturing pillar with specification breakdown. |
| 14 | **Direct Global Imports:** EDTA salts, Percarbonate, Citric Acid, Xanthan Gum | `products_catalog.md:74`, `06_solvents.md` | Stated in catalog as China-make direct imports | **VERIFIED** | Feature as direct import capability pillar. |

---

## 3. Image Inventory & Resolution Analysis

Comprehensive analysis of all 129 files in `images/` from `images_analysis.json` and local inspection:

### Breakdown by Usability Tier

| Quality Tier | Definition | Total Count | Representative Assets | Architectural Decision |
|---|---|---|---|---|
| **Tier A (Usable Premium)** | High-res (≥1200px width), clear focus, acceptable composition | **7 files** | `api.jpeg` (1280x720), `hero-scaled.jpg` (1600x1067), `pexels-pixabay-247763-scaled.jpg` (1600x1067), `a1ffcde9-mission-vission-22x.jpg` (1260x1448) | **Careful Curation Only:** The `pexels-*` images are stock photos of lab models; under Creative Direction rules, stock photos of smiling models are **banned**. We will utilize authentic product/industrial imagery and technical typography rather than generic stock models. |
| **Tier B (Usable Small)** | 400px to 1199px width, sector thumbnails, product visuals | **29 files** | 19 sector images: `healthcare.jpeg` (612x408), `agriculture.jpeg` (612x408), `paint.jpeg` (612x408), `water-treatment-plant.jpg` (612x408), `tyre.jpeg` (612x408), `adhesives.jpeg` (612x408), `apis.jpg` (737x419), `solvents.png` (800x600) | Usable within controlled aspect-ratio card containers (3:2 or 4:3) with consistent cool duotone/grade treatment. Must NOT be stretched across wide viewports. |
| **Tier C (Icon Only)** | <400px width, brand logos, graphic marks | **51 files** | `cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png` (185x58 logo), `aa6efd8e-logo-footer.png`, vector marks | Usable only as header/footer logo and iconography. Require SVG vectorization for crisp rendering on retina displays. |
| **Tier D (Discard / Purge)** | 150x150 cropped thumbnails, placeholder logos, test artifacts | **42 files** | `1.png` through `8.png` (fake client logos), `*-150x150.png`, `woocommerce-placeholder.png`, `desktop-screenshot-*.png` | **Purge from production build.** Do not deploy in bundle. |

### Usability Summary & Missing Assets
- **Zero authentic warehouse, tanker, dispatch, or manufacturing plant photographs exist** in the repository.
- **Hero Image:** Current hero relies on generic stock photo `pexels-pixabay-247763-scaled.jpg` (beakers and pipettes). The redesign must pivot to a high-authority "Laboratory Editorial" typographic and diagrammatic hero with an interactive specification search console.
- A dedicated **Photoshoot Brief** (`/docs/redesign/PHOTOSHOOT_BRIEF.md`) must be provided for the owner to commission real facility and packaging photography.

---

## 4. Design Debt & Component Duplication

1. **Hardcoded Color Tokens & Conflicting Systems:**
   - `frontend/src/styles/index.css` defines a "Graphite & Mineral" palette (`--color-ink: #16191D; --color-brand: #33526B; --color-accent: #5E8C9A`).
   - `docs/design-system.md` specifies a Navy/Industrial Blue/Teal palette (`#0B2545`, `#1F5A8C`, `#2A7F86`).
   - Multiple components have inline hex colors and raw pixel dimensions (e.g. `QuotePage.tsx:165`, `HomePage.tsx:160`).
2. **Duplicated & Overlapping Components:**
   - Multiple container wrappers: `Container.tsx`, inline styled container divs, and section wrappers.
   - `IndustryCard.tsx` and `ProductCard.tsx` repeat card layout logic without sharing base specification rows.
   - `MotionPrimitives.tsx` wraps every heading in separate framer-motion `<Reveal>` tags, creating unnecessary DOM overhead and potential hydration/scroll lag.
3. **Weak Typographic Hierarchy & Scale Contrast:**
   - Headings blend together on desktop; hero titles lack authoritative display scale.
   - CAS numbers are frequently rendered in standard proportional font rather than monospaced figures with clipboard affordance.
   - Chemical formulas (e.g. $H_2SO_4$, $Na_3PO_4$) are rendered as plain flat text ("H2SO4") without semantic `<sub>` subscripting.
4. **Dead Links and Unhandled User Flows:**
   - Product detail pages have a "Download Datasheet" button that is either disabled or links to `#` because no PDFs are attached.
   - "Explore Products" buttons on multiple pages reload the current view instead of focusing the category filters.

---

## 5. SEO Baseline & Crawlability Deficits

| SEO Factor | Current State in Repository | Severity | Target Architecture in Redesign |
|---|---|---|---|
| **Rendering Strategy** | Pure Client-Side SPA (CSR). HTML contains only `<div id="root"></div>`. | **CRITICAL** | Build-time pre-rendering (SSG) for all core routes and every product/industry page. Crawlers receive full semantic HTML. |
| **Title Tags** | Single static `<title>` in `index.html` across all routes. No dynamic title update on route change. | **HIGH** | Unique, programmatic title per page: `{Product Name} (CAS {CAS}) Supplier & Price | Aura Chemicals`. |
| **Meta Descriptions** | Static site-wide description. 0 dynamic meta descriptions. | **HIGH** | Data-driven meta descriptions targeting commercial procurement intent. |
| **Heading Structure (H1)** | Inconsistent; some subpages have multiple H1 elements; heading level skips from H1 to H3. | **MEDIUM** | Strict semantic hierarchy: exactly one `<h1>` per page, followed by `<h2>` section headers and `<h3>` component titles. |
| **Canonical URLs** | Hardcoded to homepage `https://aurachemicals.in/` on every route. | **HIGH** | Dynamic canonical link matching the current route path. |
| **Structured Data (Schema.org)** | Hardcoded `Corporation` schema on `index.html`. No `Product`, `BreadcrumbList`, or `Organization` sameAs links. | **HIGH** | Rich JSON-LD on product pages (`Product` without fake reviews), `BreadcrumbList` on subpages, verified `LocalBusiness`. |
| **Open Graph / Twitter** | Static default image pointing to business card logo file across all pages. | **MEDIUM** | Route-specific OG tags with branded category cards. |
| **Sitemap & Robots** | `sitemap.xml` exists in `public/`, but contains stale lastmod dates and lacks dynamic product generation. | **MEDIUM** | Automated build-time sitemap generator syncing directly with verified product catalog. |

---

## 6. Performance & Accessibility Baseline

### Build & Bundle Size Analysis (Vite Production Build)
- **`dist/index.html`:** 3.53 kB (gzipped: 1.20 kB)
- **`dist/assets/index.css`:** 12.87 kB (gzipped: 3.37 kB)
- **`dist/assets/motion-SEDH1-42.js`:** 88.77 kB (gzipped: 30.92 kB)
- **`dist/assets/index.js`:** 446.84 kB (gzipped: 113.10 kB)
- **Total Initial JS Bundle:** **144.02 kB gzipped** (Just inside the 150 kB budget, but lacks route-level code splitting).

### Font Loading Strategy
- Current: External Google Fonts request (`fonts.googleapis.com` & `fonts.gstatic.com`).
- Issue: Introduces render-blocking external DNS/TLS handshakes and layout shifts (FOUT/FOIT).
- Fix: Self-host subsetted WOFF2 font files in `/public/fonts/` with `font-display: swap` and metric-matched fallbacks.

### Automated Accessibility Audit Results (axe-core WCAG 2.2 AA)
Audit executed against the local production preview server using Playwright on Microsoft Edge at 1440x900 across all 10 routes (saved in [`docs/redesign/axe_baseline.json`](file:///c:/Users/HP/OneDrive/Desktop/technofy%20office%20work/aurachemicals/docs/redesign/axe_baseline.json)):

| Route Audited | Passes | Violations Count | Specific Violations & Impact |
|---|---|---|---|
| **Home (`/`)** | 36 | 2 | `color-contrast` (SERIOUS - 3 nodes on secondary text and pill tags), `heading-order` (MODERATE - 1 node) |
| **About Us (`/about-us`)** | 35 | 2 | `color-contrast` (SERIOUS - 2 nodes), `heading-order` (MODERATE - 2 nodes) |
| **Our Mission (`/our-mission`)** | 35 | 2 | `color-contrast` (SERIOUS - 2 nodes), `heading-order` (MODERATE - 1 node) |
| **Products Catalog (`/products`)** | 39 | 3 | `color-contrast` (SERIOUS - 2 nodes), `heading-order` (MODERATE - 2 nodes), `select-name` (**CRITICAL** - Category select dropdown missing accessible label) |
| **Product Detail (`/products/detail/aceclofenac`)** | 39 | 2 | `color-contrast` (SERIOUS - 2 nodes), `heading-order` (MODERATE - 1 node) |
| **Industries (`/industries`)** | 38 | 2 | `color-contrast` (SERIOUS - 2 nodes), `heading-order` (MODERATE - 1 node) |
| **Services (`/services`)** | 35 | 2 | `color-contrast` (SERIOUS - 2 nodes), `heading-order` (MODERATE - 1 node) |
| **Request a Quote (`/get-a-quote`)** | 42 | 1 | `color-contrast` (SERIOUS - 2 nodes on helper microcopy) |
| **Contact (`/contact`)** | 40 | 1 | `color-contrast` (SERIOUS - 2 nodes) |
| **Privacy Policy (`/privacy-policy`)** | 35 | 2 | `color-contrast` (SERIOUS - 2 nodes), `heading-order` (MODERATE - 1 node) |

**Accessibility Key Finding:** Zero critical errors exist outside of the Catalog `<select>` accessible name, but color contrast consistently fails AA standards on muted labels across every page. This will be completely resolved by our verified contrast token scale.

---

## 7. Data Flow & Catalog Architecture

### Current Flow
1. **Catalog Source:** Stored in two locations: `api/mockData.ts` and `api/verifiedProducts.ts` (3,110 lines of static product definitions).
2. **WordPress API Integration:** `api/client.ts` attempts to query `/wp-json/aura/v1/products`. If unreachable or running on hosted domain with local config, it silently falls back to `VERIFIED_PRODUCTS`.
3. **RFQ Submission Vulnerability:**
   ```typescript
   // client.ts:353-359
   } catch (err) {
     return {
       success: true,
       message: 'Thank you. Your quotation inquiry has been recorded and transmitted to the sales desk.',
       inquiry_id: Math.floor(Math.random() * 9000) + 1000,
     };
   }
   ```
   **Audit Verdict:** This is unacceptable for commercial enterprise software. A failed submission must honestly notify the user, preserve all entered form state in localStorage, and provide immediate fallback contact channels (Direct phone, WhatsApp pre-filled message, management email).

### Target Architecture in Redesign
- Unify product catalog into a single, strictly typed data source (`data/catalog/`) with explicit verification flags per product.
- Static pre-rendering generates static HTML directly from this source of truth at build time.
- The RFQ submission pipeline requires end-to-end confirmation with error preservation and multi-product basket persistence.
