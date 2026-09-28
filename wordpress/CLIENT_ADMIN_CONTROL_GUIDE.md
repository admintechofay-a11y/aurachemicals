# Aura Chemicals — Client Frontend Control Center Manual
**Architecture:** Headless WordPress CMS (REST API) + React (Vite, TypeScript, Motion Design)  
**Corporate Entity:** Aura Space Infra Private Limited (Aura Chemicals)

---

## 🌟 Executive Overview
With this system, the client has **100% full autonomy and control** over the frontend website directly from the familiar WordPress Admin interface. Every headline, description, phone number, WhatsApp link, metric counter, branding logo, page narrative, chemical product, and inquiry inbox can be updated with immediate, real-time reflection on the React frontend.

---

## 📍 Where to Find Controls in WordPress Admin (`wp-admin`)

### 1. ⚙️ The Main Frontend Control Center: **"Aura Frontend"**
In the left sidebar of WordPress Admin, click **"Aura Frontend"** (or Dashicon Layout).  
This control panel contains **10 specialized tabs**:

| Tab Name | What You Can Control |
|---|---|
| **🏢 Corporate & Legal** | Brand Name, Legal Entity (`Aura Space Infra Pvt. Ltd.`), ROC Jurisdiction (`ROC Ahmedabad`), CIN, GSTIN, Tagline, React Frontend URL |
| **📞 Contact Channels** | Primary Desk Phone, Secondary Landline, WhatsApp Number, Management Email, Sales Email, RFQ Notification Recipient Email, Registered Address, Head Office Address, Operating Hours |
| **🎨 Logos & Branding** | Header Brand Logo (Light background), Footer Brand Logo (Dark background), Favicon / Site Icon (Native WP Media Library Uploader) |
| **🚀 Homepage Hero** | Eyebrow Badge, Main Headline (H1), Subtitle/Description, Primary CTA Button & URL, Secondary CTA Button & URL, Hero Photograph URL + Uploader, Capability Strip Toggle |
| **📊 Live Statistics** | All 4 KPI Counters (`400+` Suppliers, `135` Products, `7+` Years, `19` Sectors) that animate with smooth real-time CountUp motion |
| **🏛️ Pillars & Intro** | Company Intro Heading & Narrative, Services Section Heading & Narrative, 4 Strategic Supply Chain Pillars (Titles & Descriptions) |
| **📖 About Us Page** | Page Title, Executive Overview, Business Model, 5 "Why Choose Us" Cards, Corporate Vision, Mission, Sustainability Policy, Collaboration Statement |
| **🎯 Our Mission Page** | Page Title, Core Mission Statement, Core Vision Statement, 4 Guiding Principles (Quality, Regulatory, Partnerships, Stewardship), Long-Term Vision, Inquiry Desk Copy |
| **📢 Announcement & CTA** | Site-Wide Top Announcement Bar (Enable/Disable toggle, Text message, Link URL), Global Pre-Footer CTA Band (Heading, Body, Button Label & URL) |
| **🌐 Social & SEO** | LinkedIn, Twitter/X, Facebook, YouTube URLs, Page Title Suffix, Global Default Meta Description, Footer Copyright Notice, Regulatory Tagline |
| **⚡ 1-Click Catalog Seeder** | Instant button to synchronize or reset all 135 verified chemical products and 19 industrial sectors into WordPress without duplicates |

---

## 🧪 Managing Chemical Products (135 Verified Catalog)
In the left sidebar, click **"Chemical Products"** (Dashicon Beaker).

### Adding a New Chemical Product:
1. Click **"Add Product"**.
2. **Title:** Enter the chemical name (e.g., `Amlodipine Besylate` or `Acetone (Pure)`).
3. **Description / Excerpt:** Enter product applications or commercial overview.
4. **Product Categories:** Select from Active Pharmaceutical Ingredients (APIs), Solvents, Manufacturing Phosphates, Imports (China Make), Technical Acids, or Industrial Chemicals.
5. **Chemical Specifications Meta Box (Custom Fields):**
   - **CAS Registry Number:** e.g., `89796-99-6` (Indexed for search).
   - **Grade Standard:** e.g., `Pharma Grade (IP / BP / USP)`.
   - **Therapeutic / Industry Class:** e.g., `Antihypertensive / Cardiovascular`.
   - **Molecular Formula:** e.g., `C20H25ClN2O5`.
   - **Molecular Weight:** e.g., `408.88 g/mol`.
   - **Assay / Purity:** e.g., `≥ 99.0%`.
   - **Packaging:** e.g., `25kg Fibre Drums with double PE liner`.
   - **Industrial Applications:** Bulleted or descriptive uses.
   - **Technical Datasheet / COA:** Upload Certificate of Analysis PDF directly.
6. **Featured Image:** Set product packaging or molecular graphic.
7. Click **"Publish"**. It immediately appears on `/products` and `/products/{slug}`!

---

## 🏭 Managing Industrial Sectors (19 Sectors)
In the left sidebar, click **"Industries"** (Dashicon Building).
- Edit existing sectors (Pharmaceuticals, Agrochemicals, Paints & Coatings, Food & Beverage, Water Treatment, etc.).
- Update sector descriptions, applications, and featured sector images.
- Changes appear instantly on the `/industries` page.

---

## 🛡️ Managing Services & NDT Inspection Capabilities
In the left sidebar, click **"Services"** (Dashicon Shield).
- Update Chemical Commerce descriptions.
- Manage NDT Non-Destructive Testing disciplines (Dye Penetrant, Magnetic Particle, Ultrasonic, Radiography, Eddy Current, Visual, Hardness).
- Edit regulatory standards (ISO 9001:2015, ASTM, ASME Section V, ASNT SNT-TC-1A).

---

## 📩 Reviewing Incoming RFQ Quotation Requests
In the left sidebar, click **"Quote Requests"** (Dashicon Email).
Whenever a client submits a quotation inquiry on `/get-a-quote`, `/contact`, or any `/products/{slug}` page:
1. An instant HTML email alert is dispatched to `management.aurachemicals@gmail.com` (or your configured custom recipient).
2. A permanent record is stored under **"Quote Requests"** in WordPress with:
   - Client Full Name & Company Firm
   - Email Address & Phone / WhatsApp Number
   - Chemical Product Requested & CAS Registry Number
   - Target Order Quantity
   - Technical Specifications & Custom Requirements
   - Timestamp and Inquiry Status (`pending`, `quoted`, `fulfilled`)

---

## 🚀 Instant Verification & Live Preview
- In the top WordPress Admin Bar, click **"Live Frontend App"** at any time to open the React website in a new tab.
- Click **"Aura Control Center"** in the top bar to jump straight to the settings page from anywhere in WordPress.
- Clicking **"Preview"** on any Product, Industry, or Page opens the frontend with live preview parameters.
