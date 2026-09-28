# REST API Specification & Endpoints — Aura Chemicals

> **Base Route:** `/wp-json/aura/v1/`  
> **API Version:** `v1`  
> **Protocol:** HTTPS with CORS restrictions for production and staging domains.  
> **Auth:** Public GET endpoints; Rate-limited POST `/inquiries` endpoint.  

---

## 1. Global Standards & Protocols

### A. HTTP Caching & Conditional Requests
All public read endpoints implement standard caching headers to minimize latency and server load:
- **`Cache-Control`:** `public, max-age=300, stale-while-revalidate=3600` (5-minute cache with 1-hour stale serving).
- **`ETag`:** Generated via MD5 hash of the response JSON payload. Supports conditional `If-None-Match` requests, returning `304 Not Modified` when unchanged.
- **`Last-Modified`:** Header derived from the most recently modified post or option within the requested resource set.

### B. Standard Pagination Headers
Collection endpoints (`/products`, etc.) return pagination metadata via both JSON body and standard HTTP headers:
- `X-WP-Total`: Total count of matching items.
- `X-WP-TotalPages`: Total available pages.
- `Link`: Standard RFC 5988 link relations for `next`, `prev`, `first`, and `last`.

### C. Standardized Error Response Format
All error responses adhere to the standard WP-REST error structure:
```json
{
  "code": "resource_not_found",
  "message": "The requested product slug was not found.",
  "data": {
    "status": 404,
    "details": []
  }
}
```

### D. Reusable Sub-Schemas

#### 1. Image Object (`ImageDto`)
Every image response contains dimensions, alt text, and responsive srcset:
```json
{
  "url": "https://aurachemicals.in/wp-content/uploads/2024/10/pexels-pixabay-247763-scaled.jpg",
  "width": 2560,
  "height": 1707,
  "alt": "Modern pharmaceutical quality testing laboratory",
  "srcset": "https://aurachemicals.in/.../pexels-pixabay-247763-1024x683.jpg 1024w, https://aurachemicals.in/.../pexels-pixabay-247763-scaled.jpg 2560w"
}
```

#### 2. SEO Object (`SeoDto`)
Compatible with Yoast SEO (`_yoast_wpseo_*`) and Rank Math (`rank_math_*`), falling back to native WordPress values:
```json
{
  "meta_title": "Aceclofenac (CAS 89796-99-6) | Aura Chemicals",
  "meta_description": "High-purity Aceclofenac API supplied by Aura Space Infra Pvt. Ltd. Verified CAS 89796-99-6 for anti-inflammatory pharmaceutical formulations.",
  "canonical_url": "https://aurachemicals.in/products/api/aceclofenac",
  "og_title": "Aceclofenac (CAS 89796-99-6) | Aura Chemicals",
  "og_description": "High-purity Aceclofenac API supplied by Aura Space Infra Pvt. Ltd.",
  "og_image": "https://aurachemicals.in/wp-content/uploads/2024/12/apis.jpg",
  "og_type": "article",
  "twitter_card": "summary_large_image",
  "json_ld": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Aceclofenac",
    "category": "Active Pharmaceutical Ingredients"
  }
}
```

---

## 2. Detailed Endpoint Specifications

### 1. Global Settings
`GET /wp-json/aura/v1/settings`
- **Purpose:** Supplies global company identity, branding logos, contact lines, registration, and footer data in a single request.
- **Example Response:**
```json
{
  "company": {
    "brand_name": "Aura Chemicals",
    "legal_name": "Aura Space Infra Private Limited",
    "group_name": "Aura Group of Companies",
    "tagline": "Your Trusted Partner in Chemical Excellence",
    "roc_registration": "ROC Ahmedabad",
    "experience_years": "7+ Years",
    "supplier_count": 400,
    "phone": "+91 7220000877",
    "email": "management.aurachemicals@gmail.com",
    "address": null,
    "business_hours": null,
    "social_links": []
  },
  "branding": {
    "header_logo": {
      "url": "/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png",
      "width": 185,
      "height": 58,
      "alt": "Aura Chemicals Logo"
    },
    "footer_logo": {
      "url": "/images/aa6efd8e-logo-footer.png",
      "width": 185,
      "height": 58,
      "alt": "Aura Chemicals Logo"
    }
  },
  "footer": {
    "copyright_text": "Copyright © 2026 Aura Space Infra Pvt. Ltd. All rights reserved.",
    "powered_by": "TECHOFY Global Ventures"
  }
}
```

---

### 2. Aggregated Homepage
`GET /wp-json/aura/v1/home`
- **Purpose:** Fetches all sections of the homepage in one round-trip (Hero, Intro, Services overview, 4 Strategic Pillars, Featured categories, Supplier metrics, Clientele badges, Final CTA).
- **Example Response:**
```json
{
  "hero": {
    "eyebrow": "Aura Group of Companies",
    "title": "Aura Space Infra Pvt. Ltd.",
    "tagline": "Your Trusted Partner in Chemical Excellence",
    "cta_primary": { "label": "Request a Quote", "url": "/get-a-quote" },
    "cta_secondary": { "label": "Explore Products", "url": "/products" },
    "image": {
      "url": "/images/pexels-pixabay-247763-scaled.jpg",
      "width": 2560,
      "height": 1707,
      "alt": "Chemical Research Laboratory"
    }
  },
  "intro": {
    "heading": "Our Company",
    "body": "The company has earned a strong reputation as a reliable, quality-driven supplier through decades of collective market experience, maintaining close long-term relationships with customers and developing a deep understanding of their specific chemical requirements."
  },
  "services": {
    "heading": "Our Services",
    "body": "Assured quality and reliability in API distribution through 400+ leading suppliers across India, actively serving thousands of customers across diverse industries. Through direct sourcing from domestic manufacturers with proven chemical expertise, we efficiently secure supplies, develop customized compounds, and deliver high-purity products to our clients."
  },
  "pillars": [
    {
      "id": "wide-range",
      "title": "Wide Range of Products",
      "description": "Aura Chemicals offers a diverse portfolio of chemical solutions catering to various industries. Whether you’re in manufacturing, agriculture, or healthcare, we have the right products to meet your specific needs."
    },
    {
      "id": "competitive-pricing",
      "title": "Competitive Pricing",
      "description": "Experience affordability without compromising quality. Aura Chemicals offers competitive pricing, making our products accessible to businesses of all sizes."
    },
    {
      "id": "reliable-supply-chain",
      "title": "Reliable Supply Chain",
      "description": "Count on a consistent and reliable supply chain when you choose Aura Chemicals. We understand the importance of timely deliveries, ensuring that your operations run smoothly without interruptions."
    },
    {
      "id": "extensive-network",
      "title": "Extensive Network",
      "description": "With over 7 years of specialized experience in API distribution since 2014, the company is classified as a Non-Government private entity registered with the Registrar of Companies (ROC Ahmedabad)."
    }
  ],
  "clientele": {
    "heading": "OUR CLIENTELE",
    "subheading": "Trusted Partners in Chemical Excellence",
    "clients": [
      { "id": 1, "name": "Calyx Chemicals & Pharmaceuticals Ltd.", "logo_url": "/images/calyx_chemicals__pharmaceuticals_ltd_logo.jpg" },
      { "id": 2, "name": "Partner Manufacturer 1", "logo_url": "/images/1.png" },
      { "id": 3, "name": "Partner Manufacturer 2", "logo_url": "/images/2.png" },
      { "id": 4, "name": "Partner Manufacturer 3", "logo_url": "/images/3.png" },
      { "id": 5, "name": "Partner Manufacturer 4", "logo_url": "/images/4.png" }
    ]
  },
  "cta": {
    "heading": "Join Us on the Journey to Excellence",
    "body": "Whether you are a small-scale enterprise or a large industrial manufacturer, Aura Chemicals invites you to partner with us for chemical excellence. Experience the reliability, precision, and customer commitment that have established our reputation in chemical distribution.",
    "button": { "label": "Explore Products", "url": "/products" }
  },
  "seo": { "meta_title": "Home | Aura Space Infra Pvt. Ltd. - Chemical Excellence" }
}
```

---

### 3. Page by Slug
`GET /wp-json/aura/v1/pages/{slug}`
- **Parameters:** `slug` (string, required — e.g. `about-us`, `our-mission`, `privacy-policy`).
- **Example Response:**
```json
{
  "id": 11,
  "slug": "about-us",
  "title": "ABOUT US",
  "content_html": "<p>At Aura Space Infra Private Limited, we are a trusted and reliable name in the global pharmaceutical and chemical trading industry...</p>",
  "sections": {
    "overview": "At Aura Space Infra Private Limited, we are a trusted partner...",
    "business_overview": "Aura Space Infra Private Limited is a premier distributor and service provider...",
    "why_choose_us": [
      { "title": "Reliable Sourcing", "description": "Built strong relationships with leading manufacturers." },
      { "title": "Regulatory Compliance", "description": "Complies with stringent global regulations and standards." },
      { "title": "Diverse Product Portfolio", "description": "Wide range of solvents and APIs for various applications." },
      { "title": "Customer-Centric Service", "description": "Tailored solutions exceeding expectations." },
      { "title": "Timely Delivery", "description": "Prioritizing on-time delivery to prevent supply chain disruptions." }
    ],
    "vision": "To be the leading trading company in the API and chemical sector...",
    "mission": "To provide reliable, cost-effective, and high-quality solutions...",
    "sustainability": "Sustainability is at the core of our business practices...",
    "collaboration": "At Aura Space Infra Pvt Ltd, we believe in the power of collaboration..."
  },
  "seo": { "meta_title": "About Us | Aura Space Infra Pvt. Ltd." }
}
```

---

### 4. Product Catalog Listing
`GET /wp-json/aura/v1/products`
- **Query Parameters:**
  - `category` (string, optional — category slug e.g. `api`, `solvents`, `acids`)
  - `search` (string, optional — chemical name or CAS number)
  - `industry` (string, optional — industry sector slug)
  - `page` (integer, optional, default: 1)
  - `per_page` (integer, optional, default: 20, max: 100)
- **Example Response:**
```json
{
  "total": 94,
  "total_pages": 5,
  "current_page": 1,
  "per_page": 20,
  "products": [
    {
      "id": 111901,
      "slug": "aceclofenac",
      "chemical_name": "Aceclofenac",
      "cas_number": "89796-99-6",
      "category": { "name": "Active Pharmaceutical Ingredients", "slug": "api" },
      "therapeutic_category": "Anti-inflammatory",
      "grade": null,
      "short_description": "Non-steroidal anti-inflammatory drug (NSAID) API used in pain and arthritis formulations.",
      "image": null,
      "has_datasheet": false
    },
    {
      "id": 111902,
      "slug": "acyclovir",
      "chemical_name": "Acyclovir",
      "cas_number": "59277-89-3",
      "category": { "name": "Active Pharmaceutical Ingredients", "slug": "api" },
      "therapeutic_category": "Synthetic nucleoside analogues",
      "grade": null,
      "short_description": "Antiviral medication API primarily used for the treatment of herpes simplex virus infections.",
      "image": null,
      "has_datasheet": false
    }
  ]
}
```

---

### 5. Product Detail View
`GET /wp-json/aura/v1/products/{slug}`
- **Parameters:** `slug` (string, required — e.g. `aceclofenac`, `monoethylene-glycol`).
- **Example Response:**
```json
{
  "id": 111901,
  "slug": "aceclofenac",
  "chemical_name": "Aceclofenac",
  "cas_number": "89796-99-6",
  "category": {
    "name": "Active Pharmaceutical Ingredients",
    "slug": "api"
  },
  "therapeutic_category": "Anti-inflammatory",
  "molecular_formula": null,
  "molecular_weight": null,
  "grade": null,
  "purity": null,
  "packaging": null,
  "applications": null,
  "datasheet_url": null,
  "image": {
    "url": "/images/apis.jpg",
    "alt": "Aceclofenac Pharmaceutical API"
  },
  "gallery": [],
  "related_industries": [
    { "slug": "healthcare", "title": "Healthcare & Pharmaceutical Industry" }
  ],
  "seo": {
    "meta_title": "Aceclofenac CAS 89796-99-6 | API Supplier | Aura Chemicals",
    "meta_description": "High-purity Aceclofenac Active Pharmaceutical Ingredient (CAS 89796-99-6). Inquire for CoA, MSDS, and bulk quotation from Aura Space Infra Pvt. Ltd."
  }
}
```

---

### 6. Product Categories Directory
`GET /wp-json/aura/v1/product-categories`
- **Purpose:** Provides all verified taxonomy terms with counts for client-side category filters and navigation.
- **Example Response:**
```json
[
  { "id": 1, "name": "Active Pharmaceutical Ingredients", "slug": "api", "count": 94 },
  { "id": 2, "name": "Solvents & Base Chemicals", "slug": "solvents", "count": 20 },
  { "id": 3, "name": "Manufacturing Products (Phosphates)", "slug": "manufacturing-phosphates", "count": 11 },
  { "id": 4, "name": "Own Import Products (China Make)", "slug": "imports", "count": 5 },
  { "id": 5, "name": "Technical & Commercial Acids", "slug": "acids", "count": 6 },
  { "id": 6, "name": "ETP & Industrial Chemicals", "slug": "industrial-chemicals", "count": 14 },
  { "id": 7, "name": "M/S. Grasim Ind. Ltd.", "slug": "grasim-products", "count": 6 },
  { "id": 8, "name": "M/S. Magnesia Chemical LLP", "slug": "magnesia-products", "count": 4 },
  { "id": 9, "name": "GACL Products", "slug": "gacl-products", "count": 7 }
]
```

---

### 7. Industries Collection
`GET /wp-json/aura/v1/industries`
- **Purpose:** Delivers all 19 verified industry sectors with full copy and local image objects.
- **Example Response:**
```json
[
  {
    "id": 1,
    "slug": "healthcare",
    "title": "Healthcare & Pharmaceutical Industry",
    "overview": "At Aura Chemicals, we are dedicated to advancing the healthcare and pharmaceutical sector by supplying high-purity APIs, intermediates, and specialty chemicals. Our products comply with stringent regulatory standards, ensuring safety, efficacy, and consistency in pharmaceutical formulations.",
    "image": {
      "url": "/images/healthcare.jpeg",
      "width": 612,
      "height": 408,
      "alt": "Healthcare and Pharmaceutical Chemical Solutions"
    }
  },
  {
    "id": 2,
    "slug": "agrochemicals",
    "title": "Agrochemicals & Fertilizers",
    "overview": "We provide high-quality chemicals essential for the formulation of pesticides, herbicides, and fertilizers...",
    "image": {
      "url": "/images/agriculture.jpeg",
      "width": 612,
      "height": 408,
      "alt": "Agricultural Chemicals and Fertilizer Sourcing"
    }
  }
]
```

---

### 8. Services Collection
`GET /wp-json/aura/v1/services`
- **Purpose:** Delivers verified supply chain, distribution, and NDT/QA inspection service blocks.
- **Example Response:**
```json
[
  {
    "slug": "chemical-distribution",
    "title": "Chemical Sourcing & API Distribution",
    "description": "Assured quality and security in API supplies via 400+ leading domestic manufacturers with chemistry expertise.",
    "capabilities": [
      "Direct domestic manufacturer relationships",
      "Customized chemical synthesis and compound sourcing",
      "Pan-India timely logistics and supply chain continuity"
    ]
  },
  {
    "slug": "inspection-qa-services",
    "title": "Inspection & Quality Assurance Services",
    "description": "Comprehensive engineering testing and quality control solutions adhering to ASME, API, ISO, and ASTM guidelines.",
    "capabilities": [
      "Non-Destructive Testing (UT, RT, MPT, DPT, VT, ECT, PAUT, TOFD)",
      "Metallurgical & Corrosion Investigation (Failure analysis, PMI)",
      "Welding & Fabrication Inspection (WPS / PQR / WPQ qualification)",
      "In-Service Inspection & RBI (API 510, API 570, API 653)",
      "Instrument Calibration & Dimensional Verification",
      "Civil & Concrete Non-Destructive Testing"
    ]
  }
]
```

---

### 9. Clients & Partner Badges
`GET /wp-json/aura/v1/clients`
- **Purpose:** Delivers verified client badges and logos for the clientele carousel.
- **Example Response:**
```json
[
  {
    "id": 1,
    "name": "Calyx Chemicals & Pharmaceuticals Ltd.",
    "logo": {
      "url": "/images/calyx_chemicals__pharmaceuticals_ltd_logo.jpg",
      "width": 300,
      "height": 100,
      "alt": "Calyx Chemicals & Pharmaceuticals Ltd. Logo"
    }
  }
]
```

---

### 10. Inquiries & Quotation Submissions (POST)
`POST /wp-json/aura/v1/inquiries`
- **Security & Anti-Spam:**
  - Honeypot check (field `website_url_hp` must be empty).
  - Time-based token (submission rejected if sent < 3 seconds after form render).
  - IP-based transient rate limiting (max 5 requests per 10 minutes per IP).
  - Server-side email and string sanitization (`sanitize_email`, `sanitize_text_field`).
- **Request Body (JSON):**
```json
{
  "name": "Rajesh Sharma",
  "company": "Gujarat Formulations Ltd.",
  "email": "procurement@gujaratpharma.com",
  "phone": "+91 98250 12345",
  "product": "Aceclofenac",
  "cas_number": "89796-99-6",
  "quantity": "500 kg",
  "requirement": "Require IP grade for immediate manufacturing batch. Please share CoA.",
  "consent": true,
  "website_url_hp": ""
}
```
- **Success Response (HTTP 201 Created):**
```json
{
  "success": true,
  "message": "Thank you. Your quotation request has been received by our procurement desk.",
  "inquiry_id": 1402
}
```
- **Validation Failure Response (HTTP 422 Unprocessable Entity):**
```json
{
  "code": "validation_failed",
  "message": "Please correct the errors in the submission.",
  "data": {
    "status": 422,
    "errors": {
      "email": "A valid corporate email address is required.",
      "phone": "A valid contact phone number is required."
    }
  }
}
```
