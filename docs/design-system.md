# B2B Corporate Design System — Aura Chemicals

> **Design Theme:** Industrial Precision, Corporate Pharmacy & Chemical Integrity  
> **Target Audience:** B2B Procurement Officers, Formulators, Plant Heads, and Chemical Trading Desks  
> **Accessibility Target:** WCAG 2.1 Level AA Compliant  

---

## 1. Design Philosophy & Aesthetic Constraints

- **Restrained & Credible:** Visual styling mirrors high-tier pharmaceutical manufacturers and industrial annual reports (e.g. BASF, Merck KGaA, Evonik).
- **Strictly Banned:** Purple/violet/neon hues, heavy gradients, glassmorphism, floating decorative 3D molecules, particles, stock photo illustrations of models, emoji as icons, bubbly high border-radius (>4px).
- **Layout Rhythm:** 12-column grid system, maximum container width of `1280px`, left-aligned technical hierarchy, generous whitespace, thin `1px` structural borders (`#D9E0E7`).

---

## 2. Design Tokens (CSS Variables)

```css
:root {
  /* Brand Palette */
  --color-primary: #0B2545;       /* Deep Navy - Dominant Brand Color */
  --color-secondary: #1F5A8C;     /* Industrial Blue - Structural Accents */
  --color-accent: #2A7F86;        /* Muted Teal - Primary CTAs & Active States */
  --color-accent-hover: #22666C;  /* Darker Muted Teal for Hover */

  /* Neutral Surface & Background Tokens */
  --color-bg: #FFFFFF;            /* Page Background */
  --color-surface: #F5F7FA;       /* Card & Section Alternate Background */
  --color-surface-hover: #EDF2F7; /* Table Row & Card Hover State */
  --color-border: #D9E0E7;        /* Subtle 1px Technical Division Line */
  --color-border-focus: #1F5A8C;  /* Form Input Focus Ring */

  /* Typography & Readability Tokens */
  --color-text: #1F2933;          /* Primary Body Text (13.9:1 on White) */
  --color-muted: #5B6773;         /* Secondary Labels & Metadata (5.6:1 on White) */
  --color-text-inverse: #FFFFFF;  /* Text on Primary Navy Surfaces */

  /* Functional Status Colors */
  --color-success: #1E6B47;       /* Muted Forest Green */
  --color-success-bg: #EAF5EE;
  --color-error: #9B2C2C;         /* Muted Brick Red */
  --color-error-bg: #FDF2F2;
  --color-warning: #92540D;       /* Warm Ochre Amber */
  --color-warning-bg: #FEF8E7;

  /* Typography Scale */
  --font-family-base: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;

  /* Spacing Scale (8px Grid) */
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

  /* Elevation & Borders */
  --radius-sm: 2px;
  --radius-md: 4px;
  --shadow-sm: 0 1px 2px 0 rgba(11, 37, 69, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(11, 37, 69, 0.08), 0 2px 4px -1px rgba(11, 37, 69, 0.04);
  --shadow-hover: 0 10px 15px -3px rgba(11, 37, 69, 0.1), 0 4px 6px -2px rgba(11, 37, 69, 0.05);

  /* Containers */
  --container-max: 1280px;
  --container-pad: clamp(16px, 4vw, 32px);
}
```

---

## 3. Fluid Typography Scale (`clamp()`)

Single font family **IBM Plex Sans** (Weights: Regular 400, Medium 500, Semi-Bold 600). Monospace font **IBM Plex Mono** for CAS numbers and chemical formulas.

| Element | Fluid Clamp Formula | Desktop Equivalent | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| **Display H1** | `clamp(2.25rem, 4vw + 1rem, 3.25rem)` | 36px → 52px | 1.15 | -0.02em | Homepage Hero Headline |
| **Section H2**| `clamp(1.75rem, 2.5vw + 0.5rem, 2.25rem)` | 28px → 36px | 1.25 | -0.01em | Major Page Sections |
| **Subheading H3**| `clamp(1.25rem, 1.5vw + 0.5rem, 1.625rem)` | 20px → 26px | 1.35 | 0 | Card Headings & Group Titles |
| **Eyebrow Label** | `0.75rem` / `12px` | 12px (Fixed) | 1.5 | +0.08em (Uppercase) | Section categories, badges |
| **Body Large** | `clamp(1.0625rem, 0.5vw + 0.9rem, 1.1875rem)` | 17px → 19px | 1.6 | 0 | Lead paragraphs & hero subtitles |
| **Body Regular** | `1rem` / `16px` | 16px (Fixed) | 1.6 | 0 | Standard body copy, descriptions |
| **Body Small** | `0.875rem` / `14px` | 14px (Fixed) | 1.5 | 0 | Metadata, table rows, form hints |
| **CAS Code Badge**| `0.8125rem` / `13px` | 13px (Mono) | 1.4 | +0.02em | CAS Numbers e.g. `89796-99-6` |

---

## 4. Layout & Grid System

- **Container:** Maximum width `1280px` with auto centering and responsive horizontal padding `clamp(16px, 4vw, 32px)`.
- **12-Column Grid:** Standard CSS grid with column gap `clamp(16px, 2vw, 32px)` and row gap `clamp(24px, 3vw, 48px)`.
- **Section Vertical Padding:**
  - Desktop (≥1024px): `96px` to `120px` top and bottom.
  - Tablet (768px - 1023px): `64px` to `80px`.
  - Mobile (<768px): `48px` to `64px`.

---

## 5. Motion Guidelines (Framer Motion)

Strictly restrained to prevent distraction. All animations respect `@media (prefers-reduced-motion: reduce)`.
- **Entrance Animation:** Single fade-up reveal (y-offset: `12px`, duration: `350ms`, easing: `[0.21, 0.45, 0.27, 0.9]`, triggered once on view).
- **Card Hover:** Subtle elevation translation (y-offset: `-2px`, duration: `200ms`, shadow transition to `--shadow-hover`).
- **Image Hover:** Max scale `1.03` inside an `overflow: hidden` container (duration: `400ms`).
- **Zero Scroll-Jacking:** Natural native browser scroll behavior throughout.

---

## 6. Complete Component Library Inventory

1. **Foundational & Layout Components:**
   - `Container`: Bounds content to 1280px with fluid gutter padding.
   - `Section`: Structured section container with background variants (`default`, `surface`, `navy`).
   - `SectionHeading`: Standardized section header with eyebrow label, H2 title, and optional lead description.
   - `Breadcrumb`: Structured schema-compatible navigation path (`Home > Products > API > Aceclofenac`).

2. **Navigation Components:**
   - `Navbar`: Sticky white header with 1px border, logo from WP, multi-level dropdowns, and "Request a Quote" CTA.
   - `MobileMenu`: Accessible slide-over drawer with focus trap and ARIA expanded state.
   - `Footer`: 4-column corporate footer with company credentials, product links, and legal disclosures.

3. **Data & Catalog Components:**
   - `ProductCard`: Technical card showing Chemical Name, CAS badge, category tag, brief description, and RFQ CTA.
   - `CategoryCard`: Category hub card with verified item count and representative photography.
   - `IndustryCard`: Sector card showing verified industry image, title, and sector overview excerpt.
   - `ServiceCard`: Technical capability card displaying inspection/sourcing methods and standards badges.
   - `LogoGrid`: Grayscale-to-color responsive partner logo grid with consistent aspect ratio.
   - `TechnicalSpecTable`: Clean key-value specification table (CAS, Formula, Grade) rendering only non-empty fields.

4. **Interactive & Form Controls:**
   - `Button`: Variants (`primary`, `secondary`, `outline`, `text`) with loading spinner and disabled state.
   - `SearchInput`: Debounced instant search bar with clear button and CAS pattern recognition.
   - `FilterBar`: Category and industry pill filter tabs with active states and counts.
   - `FormField`: Accessible form wrapper with explicit `<label>`, floating hint, required indicator, and ARIA error binding.
   - `Pagination`: Server-aligned page navigator with prev, next, page numbers, and ellipsis.
   - `QuoteModal`: Quick RFQ inquiry modal pre-filling chemical name and CAS number.

5. **Feedback & Utility States:**
   - `Skeleton`: Content-shaped placeholder shimmer for loading states matching exact card dimensions.
   - `ErrorState`: Professional corporate error display with retry trigger.
   - `EmptyState`: Clean notice ("No products are currently available in this category") without fake content.
   - `CTABand`: High-conversion closing banner with dual CTAs (Request Quote + Contact Desk).
