# Website Forms Technical Documentation — Aura Chemicals

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
