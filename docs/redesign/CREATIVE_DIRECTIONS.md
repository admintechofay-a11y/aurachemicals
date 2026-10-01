# Creative Direction Proposal — Aura Chemicals

> **Document Version:** 1.0.0  
> **Prepared for:** Aura Space Infra Pvt. Ltd. (Aura Chemicals)  
> **Core Objective:** Establish an authoritative visual identity for B2B chemical and pharmaceutical trading that conveys profound institutional credibility, technical rigor, and commercial reliability to global buyers.

---

## Visual Direction Comparison Matrix

| Attribute | Direction A: "Laboratory Editorial" *(Recommended)* | Direction B: "Industrial Monograph" | Direction C: "Pharmacopeia Minimal" |
|---|---|---|---|
| **Aesthetic Spirit** | Precision laboratory documentation crossed with high-tier financial/technical editorial (Merck KGaA, Stripe Press). | High-density European chemical engineering handbook (Evonik, BASF, Clariant). | Swiss clinical pharmaceutical standard (Lonza, Roche, Novartis procurement). |
| **Dominant Canvas** | Warm technical paper (`#F7F6F2` / `#FAF9F5`) with deep ink navy (`#081B33`) contrast bands. | Cool platinum slate (`#F1F3F5` / `#FFFFFF`) with heavy Prussian blue (`#0B2545`) structural framing. | Stark sterile white (`#FFFFFF`) with cool clinical grey (`#F8FAFC`) card panels. |
| **Primary Accent** | Refined Muted Teal (`#1F7A8C`, hover: `#165A68`) — 4.9:1 AA on light surfaces. | Industrial Cobalt (`#155E9C`, hover: `#0D4472`) with restrained Oxide Amber (`#B45309`). | Clinical Cyan-Teal (`#0E7490`, hover: `#155E75`) with Emerald status indicators. |
| **Display Typography** | High-authority optical serif: **Newsreader** or **Instrument Serif** (clean, authoritative, intellectual). | Refined geometric/humanist grotesk: **Inter Tight** or **Geist** (sharp, technical, modern). | Strict Swiss Neo-Grotesk: **IBM Plex Sans** / **Helvetica Neue** style (objective, neutral). |
| **Body & Technical** | **IBM Plex Sans** (body, 16px/1.6) + **IBM Plex Mono** (CAS numbers, formulas, tabular data). | **IBM Plex Sans** (body) + **IBM Plex Mono** (tabular figures & codes). | **IBM Plex Sans** (body) + **IBM Plex Mono** (tabular figures & codes). |
| **Signature Motif** | **The Specification Row:** Hairline-ruled key/value pairs (`CAS`, `Purity`, `Grade`, `Monograph`) across all cards. | **The Architectural Box:** Density-ruled modular compartments with heavy section indices. | **The Certificate Badge:** Clean micro-pill badges referencing ISO, GMP, and Pharmacopeia standards. |
| **Grid & Rules** | 12-column grid with 1px cool grey hairlines (`#DDE2E5`), numbered 2-digit indices (`01`, `02`). | 12-column grid with dual 1px rules and prominent section dividers (`#CBD5E1`). | 12-column minimalist grid with generous white space and thin border outlines (`#E2E8F0`). |
| **Corner Radius** | Sharp geometry: `0px` to `2px` max (signaling clinical accuracy). | `2px` to `4px` (structured engineering feel). | `0px` (razor-sharp modernist clinical). |

---

## 1. Direction A: "Laboratory Editorial" (Recommended Default)

### Rationale
Direction A elevates the visual language of technical documents (datasheets, Certificates of Analysis, pharmacopeial monographs) into a modern, refined web system. It creates dramatic scale contrast between large, quiet display headlines and dense, hairline-ruled specification tables. It instantly separates Aura Chemicals from the sea of generic, template-driven chemical websites with blue gradients and stock beakers.

### Core Tokens
```css
:root {
  /* Surfaces */
  --color-paper: #F7F6F2;           /* Warm technical paper base */
  --color-paper-alt: #EFECE6;       /* Subdued container background */
  --color-surface-white: #FFFFFF;   /* Crisp card and table background */
  --color-ink-navy: #081B33;        /* Deep midnight ink for dark sections */
  --color-ink-dark: #040E1B;        /* High-contrast footer & drawer */

  /* Text */
  --color-text-primary: #121926;    /* Deep technical charcoal (14.2:1 contrast) */
  --color-text-secondary: #475467;  /* Clear editorial metadata (5.4:1 contrast) */
  --color-text-muted: #667085;      /* Captions and table headers */
  --color-text-on-dark: #F7F6F2;    /* Pure paper on ink navy */

  /* Hairlines & Boundaries */
  --color-hairline: #DDE2E5;        /* 1px structural hairline grid */
  --color-hairline-dark: #1E2E42;   /* Rule on ink navy */

  /* Accents */
  --color-teal: #1F7A8C;            /* Primary commercial action & active states */
  --color-teal-hover: #165A68;      /* Hover state */
  --color-amber-oxide: #B45309;     /* Restrained secondary highlight (max 1/viewport) */

  /* Typography */
  --font-display: 'Newsreader', Georgia, serif;
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  /* Geometry & Rules */
  --radius-sharp: 0px;
  --radius-subtle: 2px;
  --border-hairline: 1px solid var(--color-hairline);
}
```

### Page-Frame Wireframe (Home Hero & Spec Explorer)
```
+-----------------------------------------------------------------------------------------------+
| AURA CHEMICALS [Logo]      Products   Industries   Services   About   Contact    [Request Quote] (Basket: 0) |
+-----------------------------------------------------------------------------------------------+
| 01 / PROCUREMENT PORTAL                                                            AHMEDABAD, IN |
|===============================================================================================|
|                                                  | [ SPECIFICATION PRODUCT FINDER ]          |
| Active Pharmaceutical Ingredients,               | +---------------------------------------+ |
| Solvents & Manufactured Phosphates               | | Search by chemical name or CAS #...    | |
| for Regulated Manufacturing.                     | +---------------------------------------+ |
|                                                  | Quick Category Index:                    |
| Sourcing directly from domestic manufacturers    | [01 APIs] [02 Solvents] [03 Phosphates]  |
| and direct global imports since 2014.            |                                           |
|                                                  | RECENT SPECIFICATIONS ADDED:             |
| [ Request Commercial Quote ]  [ Browse Catalog ] | - Paracetamol (CAS 103-90-2) · IP/BP/USP |
|                                                  | - Mono Sodium Phosphate (CAS 7558-80-7)   |
|--------------------------------------------------+-------------------------------------------|
| ESTABLISHED 2014  |  94 APIS LISTED  |  19 INDUSTRIES  |  IP · BP · USP · EP · JP COMPLIANT  |
|===============================================================================================|
| 02 / CORE SUPPLY PILLARS                                                         SPECIFICATION|
|-----------------------------------------------------------------------------------------------|
| 01. API DISTRIBUTION EXCELLENCE         [94 Items]  Analgesic, Antibiotic, NSAID Monographs  →|
| 02. INDUSTRIAL SOLVENTS & INTERMEDIATES [20 Items]  MEG, DMF, Toluene, Acetone, IPA, Hexene  →|
| 03. IN-HOUSE PHOSPHATE SYNTHESIS        [11 Items]  Mono, Di, Tri Sodium/Potassium/Ammonium  →|
| 04. DIRECT GLOBAL IMPORTS               [05 Items]  EDTA Salts, Citric Acid, Xanthan Gum     →|
| 05. TECHNICAL & COMMERCIAL ACIDS        [06 Items]  Acetic Acid (GNFC 99.8%), Formic Acid    →|
| 06. NDT & THIRD-PARTY INSPECTION        [06 Fields] ASME / API 510 / ASTM Quality Assurance  →|
+-----------------------------------------------------------------------------------------------+
```

---

## 2. Direction B: "Industrial Monograph"

### Concept
Clean, brutalist European chemical distributor aesthetic. Heavy vertical rhythm, prominent monospaced labels, cool slate-grey tones, and high-visibility corporate blue headers.

### Core Tokens
- Base: `#F1F3F5` (Platinum) / `#FFFFFF`
- Deep: `#0B2545` (Prussian Blue)
- Accent: `#155E9C` (Cobalt) / `#C96A24` (Amber)
- Fonts: `Inter Tight` (Display) + `IBM Plex Sans` (Body) + `IBM Plex Mono` (Mono)
- Radius: `2px` - `4px`

---

## 3. Direction C: "Pharmacopeia Minimal"

### Concept
Swiss pharmaceutical laboratory minimalism. Maximum whitespace, light clinical cyan-teal accents, stark contrast, zero serif type, extreme focus on purity percentages, molecular weights, and analytical parameters.

### Core Tokens
- Base: `#FFFFFF` / `#F8FAFC`
- Deep: `#0F172A` (Obsidian Slate)
- Accent: `#0D9488` (Clinical Teal)
- Fonts: `IBM Plex Sans` (Display & Body) + `IBM Plex Mono` (Mono)
- Radius: `0px`

---

## Recommendation & Execution Decision

**Selected Direction: Direction A ("Laboratory Editorial").**  
As stipulated in the master instructions:
- It maintains the verified brand DNA (Navy `#0B2545` evolved to deep midnight ink `#081B33`, paired with refined teal `#1F7A8C`).
- It establishes unmatched typographic authority through optical serif display typography balanced by strict monospaced specification rows.
- It honors the material truth of the company without faking stock laboratory photography.

We will now proceed with Direction A and implement the definitive design system in `/docs/redesign/DESIGN_SYSTEM.md`.
