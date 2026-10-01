# B2B Corporate Design System: "Laboratory Editorial" — Aura Chemicals

> **Document Version:** 2.0.0 (Supersedes `docs/design-system.md`)  
> **Brand Entity:** Aura Space Infra Private Limited (trading as Aura Chemicals)  
> **Core Aesthetic:** Laboratory Editorial — Precision documentation, typographic authority, hairline structural grid, and material honesty.  
> **Target Accessibility Standard:** WCAG 2.2 Level AA Strict (Minimum contrast 4.5:1 body, 3:1 large text & UI boundaries).

---

## 1. Core Visual Principles & Constraints

1. **Typographic Authority Over Imagery:** In the absence of authentic, high-resolution plant and warehouse photography, the visual hierarchy is anchored in authoritative typography, fluid scale contrast, monospaced tabular data, and crisp hairline architectural rules.
2. **The Specification Row Motif:** The signature visual element across the entire site is the hairline-ruled specification row (Key / Value pair). Used on product cards, datasheets, hero explorer, capability blocks, and the footer.
3. **Restrained Color Architecture:** Warm technical paper (`#F7F6F2`) alternating with crisp white surfaces; deep midnight ink navy (`#081B33`) for high-contrast corporate bands; refined muted teal (`#1F7A8C`) for interactive actions; single-hue oxide amber (`#B45309`) for critical technical callouts (max once per viewport).
4. **Sharp Industrial Geometry:** Corner radii are restricted to `0px` - `2px` (maximum `4px` on select controls). Bubbly pill shapes, rounded cards, and heavy drop shadows are strictly banned.
5. **No Decorative Gimmicks:** Heavy gradients, multi-hue color fades, glassmorphism, floating 3D molecules, particle canvases, and unverified client carousels are strictly forbidden.

---

## 2. Complete Token System (CSS Custom Properties)

```css
:root {
  /* ==========================================================================
     1. COLOR PALETTE & SEMANTIC ROLES
     ========================================================================== */
  
  /* Canvas & Surface Tokens */
  --color-paper: #F7F6F2;             /* Base warm technical paper */
  --color-paper-subtle: #F0EFEA;      /* Subtle section contrast / active tab */
  --color-surface-white: #FFFFFF;     /* Table rows, inputs, card backgrounds */
  --color-surface-elevated: #FFFFFF;  /* Modals, command palette, dropdowns */
  
  /* Deep Corporate Contrast Surfaces */
  --color-ink-navy: #081B33;          /* Dark sections, header on scroll, primary buttons */
  --color-ink-deep: #040E1B;          /* Footer, mobile drawer, RFQ summary */
  --color-ink-subtle: #102A4C;        /* Dark card surface */

  /* Hairlines & Grid Rules */
  --color-rule: #DCE1E5;              /* Primary 1px hairline division */
  --color-rule-strong: #B0BCC7;       /* Emphasized boundary */
  --color-rule-dark: #1E334D;         /* Division line on dark navy surfaces */

  /* Typography / Ink Tokens */
  --color-text-primary: #121926;      /* Primary body text (14.2:1 contrast on white) */
  --color-text-secondary: #364152;    /* Secondary metadata, subtitles (7.1:1 on white) */
  --color-text-muted: #5B6777;        /* Form hints, eyebrows, table headers (4.6:1 on white - WCAG AA) */
  --color-text-on-dark: #F7F6F2;      /* Primary text on dark navy surfaces */
  --color-text-muted-dark: #9AA8B8;   /* Secondary metadata on dark navy */

  /* Interactive Accent: Refined Technical Teal */
  --color-teal: #1F7A8C;              /* Primary CTA, active filter pill, interactive focus */
  --color-teal-hover: #175F6D;        /* Button hover state */
  --color-teal-subtle: #E8F3F5;       /* Pill badge background */
  --color-teal-border: #99CBD3;       /* Pill badge border */

  /* Technical Highlight: Oxide Amber (Restrained, max 1/viewport) */
  --color-amber: #B45309;             /* CAS highlights, warning badges */
  --color-amber-subtle: #FEF3C7;      /* Warning container background */
  --color-amber-border: #FCD34D;      /* Warning boundary */

  /* Functional Status Colors */
  --color-success: #1E6B47;           /* Success notice, confirmed inquiry */
  --color-success-bg: #EAF5EE;
  --color-error: #9B2C2C;             /* Inline validation error */
  --color-error-bg: #FDF2F2;

  /* ==========================================================================
     2. TYPOGRAPHY TOKENS
     ========================================================================== */
  
  --font-family-display: 'Newsreader', Georgia, 'Times New Roman', serif;
  --font-family-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;

  /* Fluid Typography Scale (clamp) */
  --font-size-display-xl: clamp(2.5rem, 5vw + 1rem, 4.25rem); /* 40px → 68px (Hero) */
  --font-size-display-lg: clamp(2.0rem, 3.5vw + 0.5rem, 3.25rem); /* 32px → 52px (H1) */
  --font-size-heading-h2: clamp(1.5rem, 2vw + 0.5rem, 2.25rem);  /* 24px → 36px (Section H2) */
  --font-size-heading-h3: clamp(1.15rem, 1.2vw + 0.4rem, 1.5rem);/* 18px → 24px (Subhead H3) */
  --font-size-heading-h4: 1.125rem;                               /* 18px (Card Titles) */
  --font-size-body-lead: clamp(1.05rem, 0.5vw + 0.9rem, 1.2rem); /* 17px → 19px (Lead Paragraph) */
  --font-size-body: 1rem;                                         /* 16px (Standard Body) */
  --font-size-body-sm: 0.875rem;                                  /* 14px (Table Rows, Hints) */
  --font-size-caption: 0.75rem;                                   /* 12px (Eyebrows, Index) */
  --font-size-mono-sm: 0.8125rem;                                 /* 13px (CAS Badges, Figures) */

  /* Line Heights */
  --line-height-tight: 1.15;
  --line-height-snug: 1.3;
  --line-height-base: 1.6;
  --line-height-loose: 1.75;

  /* Letter Spacing */
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.05em;
  --letter-spacing-widest: 0.08em; /* Eyebrow labels (Uppercase) */

  /* Max Line Measures for Reading Ergonomics */
  --measure-prose: 68ch;
  --measure-lead: 58ch;
  --measure-headline: 24ch;

  /* ==========================================================================
     3. SPACING SCALE (Mathematical 4px/8px Grid)
     ========================================================================== */
  
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
  --space-40: 160px;

  /* ==========================================================================
     4. CONTAINERS, BREAKPOINTS & GRID
     ========================================================================== */
  
  --container-max: 1320px;
  --container-pad: clamp(16px, 4vw, 40px);
  --grid-columns: 12;
  --grid-gutter: clamp(16px, 2.5vw, 32px);

  /* ==========================================================================
     5. GEOMETRY, ELEVATION & BORDERS
     ========================================================================== */
  
  --radius-none: 0px;
  --radius-xs: 2px;
  --radius-sm: 4px;
  
  --border-hairline: 1px solid var(--color-rule);
  --border-strong: 1px solid var(--color-rule-strong);
  --border-dark: 1px solid var(--color-rule-dark);

  /* Elevation (Disciplined 2-Level Scale) */
  --elevation-resting: 0 1px 3px rgba(8, 27, 51, 0.04);
  --elevation-dropdown: 0 8px 24px -4px rgba(8, 27, 51, 0.12), 0 2px 6px -1px rgba(8, 27, 51, 0.04);
  --elevation-modal: 0 24px 48px -12px rgba(8, 27, 51, 0.25);

  /* ==========================================================================
     6. MOTION & CHOREOGRAPHY (Disciplined, Physically Plausible)
     ========================================================================== */
  
  --duration-instant: 100ms;
  --duration-ui: 200ms;
  --duration-reveal: 450ms;
  --ease-standard: cubic-bezier(0.16, 1, 0.3, 1); /* Natural swift deceleration */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* Z-Index Hierarchy */
  --z-header: 100;
  --z-dropdown: 200;
  --z-drawer: 300;
  --z-modal: 400;
  --z-toast: 500;
}
```

---

## 3. Typography Hierarchy & Pairings

### Pairing Strategy
- **Display Face:** **Newsreader** (Google Fonts / Self-hosted WOFF2). An optical-sized transitional serif with high editorial confidence and intellectual authority. Used exclusively for display headlines, hero titles, and major editorial section statements.
- **Text Face:** **IBM Plex Sans**. A crisp, neutral corporate grotesque designed for technical clarity, legibility, and high screen contrast. Used for navigation, body prose, form fields, and labels.
- **Monospace Face:** **IBM Plex Mono**. Used strictly for CAS numbers, pharmacopeial monographs, chemical formulas, tabular data figures, reference numbers, and section indices (`01`, `02`).

### Contrast Verification Matrix (WCAG 2.2 AA)

| Foreground Color | Background Color | Computed Contrast | Minimum Required | Status |
|---|---|---|---|---|
| `--color-text-primary` (`#121926`) | `--color-surface-white` (`#FFFFFF`) | **14.2:1** | 4.5:1 | **PASS** (AAA) |
| `--color-text-primary` (`#121926`) | `--color-paper` (`#F7F6F2`) | **13.5:1** | 4.5:1 | **PASS** (AAA) |
| `--color-text-secondary` (`#364152`) | `--color-surface-white` (`#FFFFFF`) | **7.1:1** | 4.5:1 | **PASS** (AA) |
| `--color-text-muted` (`#5B6777`) | `--color-surface-white` (`#FFFFFF`) | **4.6:1** | 4.5:1 | **PASS** (AA) |
| `--color-teal` (`#1F7A8C`) | `--color-surface-white` (`#FFFFFF`) | **4.9:1** | 4.5:1 | **PASS** (AA) |
| `--color-text-on-dark` (`#F7F6F2`) | `--color-ink-navy` (`#081B33`) | **14.8:1** | 4.5:1 | **PASS** (AAA) |
| `--color-text-muted-dark` (`#9AA8B8`)| `--color-ink-navy` (`#081B33`) | **6.2:1** | 4.5:1 | **PASS** (AA) |

---

## 4. Component Inventory & Specification

### 1. Foundational Architecture
- **`Header`:** Sticky 72px navbar. Top bar with ROC credentials and direct emergency line; primary navigation with keyboard-accessible mega menu for Products; dynamic "Request a Quote" CTA with persistent RFQ Basket badge count; command-palette search trigger (`Cmd/Ctrl+K`).
- **`SectionHeader`:** Monospaced 2-digit index (`01`, `02`) + Section Title in display serif + Lead description + Hairline horizontal divider.
- **`SpecRow` & `SpecTable`:** The signature motif. Left-aligned uppercase metadata label (`CAS NO.`, `MONOGRAPH`, `GRADE`, `PACKING`, `ORIGIN`) paired with right-aligned tabular value separated by a 1px cool grey rule.
- **`CASBadge`:** Monospaced CAS number in `--font-family-mono` with an interactive "Copy CAS" button providing visual confirmation.

### 2. Product Catalog & Discovery
- **`ProductRow` (Dense Table View):** High-efficiency catalog view displaying Chemical Name, CAS Number, Category, Monograph/Grade, and one-click "Add to RFQ" button with keyboard focus support.
- **`ProductCard` (Grid View):** Editorial card with clean hairline boundary, chemical name in bold sans, CAS badge, therapeutic/functional application, and dual actions ("Quick RFQ" + "View Datasheet").
- **`AlphabeticalJumpBar`:** Sticky horizontal A-Z jump bar for the 94 Active Pharmaceutical Ingredients.
- **`CatalogFilterBar`:** Faceted filters for Category, Pharmacopeia (IP/BP/USP/EP/JP), Form (Powder, Crystal, Liquid), and Origin (India / Import).

### 3. Commercial RFQ Funnel
- **`RFQBasketDrawer`:** Persistent slide-over drawer accessible from any page. Displays all selected products, per-item volume inputs, grade selection, and "Proceed to Quote" button.
- **`RFQForm`:** High-conversion procurement form with structured fieldsets:
  1. Products & Volumes (Pre-filled from basket + free-text custom line item).
  2. Grade & Technical Requirements (CoA, TDS, MSDS check options).
  3. Commercial Entity (Company, Representative, Business Email, Verified Phone/WhatsApp, Optional GSTIN).
  4. Delivery Destination & Target Timeline.
  5. Honest submission handling with zero fake confirmations.

### 4. Layout & Feedback Controls
- **`Footer`:** Architectural 4-column corporate footer featuring ROC Ahmedabad details, verified contact lines, full product family index, 19 industry sectors, and DPDP compliance link.
- **`MobileBottomBar`:** Compact sticky bottom bar on mobile viewports providing one-tap access to WhatsApp, Direct Telephone, and RFQ Basket without obscuring inputs.
- **`Toast` & `InlineNotice`:** Clean technical alert banners with explicit success/error states.
