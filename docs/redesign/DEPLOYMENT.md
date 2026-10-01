# Production Deployment & Hosting Runbook

> **Client:** Aura Space Infra Pvt. Ltd. (trading as Aura Chemicals)  
> **Target Environment:** High-Availability Static SSG Frontend + Hardened Headless WordPress Core  
> **Canonical Domain:** `https://aurachemicals.in`  
> **API Subdomain / Path:** `https://api.aurachemicals.in/wp-json/aura/v1` or `https://aurachemicals.in/wp-json/aura/v1`  
> **Author:** Antigravity Engineering

---

## 1. System Architecture Overview

The Aura Chemicals platform uses a decoupled, hybrid-resilient architecture engineered for maximum performance, commercial security, and procurement uptime:

```
[ B2B Buyer / Client Browser ]
              │
              ▼
    [ Nginx Reverse Proxy & CDN ]
       │                     │
       │ (Static SSG HTML)   │ (/wp-json/aura/v1/* API calls)
       ▼                     ▼
[ /frontend/dist/ ]   [ PHP-FPM / Headless WordPress ]
(Pre-rendered pages)    (Custom CPTs, Quote Requests, CSV Export)
```

- **Frontend:** Built with React 18, TypeScript, and Vite. Statically pre-rendered via Playwright into 151 canonical static HTML files (`frontend/dist/`). Includes client-side offline fallback data layer containing all 135 verified chemical specifications.
- **Backend:** WordPress 6.x running `aura-chemicals-core` plugin, handling RFQ management, transient IP rate-limiting, honeypot protection, custom metadata, and secure CSV inquiry exports.
- **Resilience Guarantee:** If the WordPress instance experiences downtime or maintenance, the frontend continues to serve full product specifications, contact information, and generates client-side printable RFQ dossiers and WhatsApp inquiries without interruption.

---

## 2. Production Build Pipeline

### Prerequisites
- Node.js `v18.x` or later (tested on `v20.x` and `v24.x`).
- NPM `v9.x` or later.
- Chromium / Playwright headless runtime dependencies.

### Step-by-Step Build Commands
```bash
# 1. Navigate to frontend root
cd frontend

# 2. Install production dependencies
npm ci

# 3. Compile TypeScript and build production bundle
npm run build

# 4. Execute SSG Pre-rendering Pipeline
node ../scripts/prerender.js

# 5. Verify build integrity & banned patterns check
node ../scripts/check_banned_patterns.js
```

### Verification
Ensure `frontend/dist/` contains:
- `index.html` (Corporate Homepage)
- `about-us/index.html`
- `our-mission/index.html`
- `products/index.html`
- `industries/index.html`
- `services/index.html`
- `get-a-quote/index.html`
- `contact/index.html`
- `privacy-policy/index.html`
- `terms/index.html`
- 135 individual product directories under `products/detail/<slug>/index.html`
- `sitemap.xml` and `robots.txt`

---

## 3. Nginx Server Configuration

Save this configuration at `/etc/nginx/sites-available/aurachemicals.in`:

```nginx
# ==============================================================================
# Aura Chemicals — Production Nginx Configuration
# ==============================================================================

# 1. Canonical Redirect: HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name aurachemicals.in www.aurachemicals.in;
    return 301 https://aurachemicals.in$request_uri;
}

# 2. Canonical Redirect: www to non-www
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.aurachemicals.in;

    ssl_certificate /etc/letsencrypt/live/aurachemicals.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aurachemicals.in/privkey.pem;

    return 301 https://aurachemicals.in$request_uri;
}

# 3. Primary Production Server Block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name aurachemicals.in;

    root /var/www/aurachemicals/current/frontend/dist;
    index index.html;

    # SSL TLS Settings
    ssl_certificate /etc/letsencrypt/live/aurachemicals.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aurachemicals.in/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    # HSTS & Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://api.aurachemicals.in https://aurachemicals.in http://localhost:* ws://localhost:*;" always;

    # Gzip & Brotli Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # --------------------------------------------------------------------------
    # Legacy URL 301 Redirects (Preserve SEO Equity from Legacy WooCommerce)
    # --------------------------------------------------------------------------
    location ~* ^/product-category/(.*)$ {
        return 301 /products;
    }
    location = /shop {
        return 301 /products;
    }
    location = /shop/ {
        return 301 /products;
    }
    location ~* ^/cart {
        return 301 /get-a-quote;
    }
    location ~* ^/checkout {
        return 301 /get-a-quote;
    }
    location = /sample-page {
        return 301 /;
    }
    location = /sample-page/ {
        return 301 /;
    }

    # --------------------------------------------------------------------------
    # Static Assets & Immutable Caching
    # --------------------------------------------------------------------------
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    location ~* \.(?:ico|css|js|gif|jpe?g|png|webp|svg|woff2?|eot|ttf)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }

    # --------------------------------------------------------------------------
    # API Proxying to WordPress Core (Optional Sub-Path Routing)
    # --------------------------------------------------------------------------
    location /wp-json/aura/v1/ {
        proxy_pass http://127.0.0.1:8080/wp-json/aura/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # --------------------------------------------------------------------------
    # Routing: Serve Pre-rendered SSG Files First, Fallback to SPA Router
    # --------------------------------------------------------------------------
    location / {
        try_files $uri $uri/ $uri/index.html /index.html =404;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Block access to hidden dotfiles
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

---

## 4. Apache `.htaccess` Fallback Configuration

If deployed in a traditional LAMP / cPanel environment, use the following `.htaccess` in the web root:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # Legacy 301 Redirects
    RewriteRule ^product-category/.*$ /products [R=301,L]
    RewriteRule ^shop/?$ /products [R=301,L]
    RewriteRule ^cart/?$ /get-a-quote [R=301,L]
    RewriteRule ^checkout/?$ /get-a-quote [R=301,L]
    RewriteRule ^sample-page/?$ / [R=301,L]

    # Serve pre-rendered HTML directory index if it exists
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteCond %{REQUEST_FILENAME}/index.html -f
    RewriteRule ^(.*)$ $1/index.html [L]

    # Serve existing files directly
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # Fallback to SPA router
    RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    
    <FilesMatch "\.(html|htm)$">
        Header set Cache-Control "no-cache, must-revalidate"
    </FilesMatch>

    <FilesMatch "\.(js|css|webp|png|jpg|jpeg|svg|woff|woff2)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>
</IfModule>
```

---

## 5. Zero-Downtime Deployment Procedure

We recommend a release-symlink strategy on the production host:

```bash
# Directory Structure on Server
# /var/www/aurachemicals/
# ├── releases/
# │   ├── 20260930_100000/
# │   └── 20260930_120000/
# ├── current -> releases/20260930_120000/
# └── shared/
#     └── .env

# Deploy Script Execution
RELEASE_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RELEASE_DIR="/var/www/aurachemicals/releases/${RELEASE_TIMESTAMP}"

mkdir -p "$RELEASE_DIR"
git clone --depth 1 https://github.com/admintechofay-a11y/aurachemicals.git "$RELEASE_DIR"

cd "$RELEASE_DIR/frontend"
npm ci
npm run build
node ../scripts/prerender.js

# Atomically flip symlink
ln -sfn "$RELEASE_DIR" /var/www/aurachemicals/current

# Reload Nginx
sudo systemctl reload nginx

# Cleanup releases keeping last 3
cd /var/www/aurachemicals/releases && ls -dt */ | tail -n +4 | xargs rm -rf
```

---

## 6. Post-Deployment Verification Checklist

Execute these validation tests immediately after deployment:

- [ ] **HTTP to HTTPS Redirect:** `curl -I http://aurachemicals.in` returns `301 Moved Permanently` to `https://aurachemicals.in/`.
- [ ] **Security Headers:** Run `curl -I https://aurachemicals.in` and verify `Strict-Transport-Security`, `X-Content-Type-Options`, and `X-Frame-Options`.
- [ ] **SSG Prerendering Verification:** Run `curl -s https://aurachemicals.in/products/detail/aceclofenac | grep -i "Aceclofenac"` — verify that raw HTML contains product specifications, H1 title, and CAS number without executing client JavaScript.
- [ ] **RFQ Ingestion Smoke Test:** Submit a test quotation inquiry via the `/get-a-quote` interface. Verify submission succeeds, records in WordPress `quote_request` table, and dispatches email notification.
- [ ] **Printable View Test:** Navigate to any product detail page, trigger Ctrl+P / Cmd+P, and verify clean two-column monochrome spec dossier layout.
- [ ] **A-Z Jump Links:** Navigate to `/products` and verify clicking alphabet jump pills scrolls immediately to corresponding chemical listing group.
