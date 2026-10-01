import urllib.request
import urllib.error
import re
import os

BASE_URL = os.environ.get("BASE_URL", "http://localhost:4173")

ROUTES = [
    ("/", "Homepage"),
    ("/about-us", "About Us"),
    ("/our-mission", "Our Mission"),
    ("/products", "Product Catalog"),
    ("/products/api", "Product Category: API"),
    ("/products/solvents", "Product Category: Solvents"),
    ("/products/aceclofenac", "Product Detail: Aceclofenac"),
    ("/products/acyclovir", "Product Detail: Acyclovir"),
    ("/industries", "Industries Served"),
    ("/services", "Services & Capabilities"),
    ("/get-a-quote", "Request a Quote"),
    ("/get-a-quote?product=Aceclofenac&cas=89796-99-6", "RFQ with Pre-filled Parameters"),
    ("/contact", "Contact Corporate Desk"),
    ("/privacy-policy", "Privacy Policy"),
]

FORBIDDEN_PATTERNS = [
    r"lorem\s+ipsum",
    r"client\s+1",
    r"client\s+2",
    r"abc\s+pharma",
    r"coming\s+soon",
    r"\bundefined\b",
    r"\bNaN\b",
    r"\[object\s+Object\]",
]

def run_qa():
    print("=" * 60)
    print("AURA CHEMICALS — COMPREHENSIVE QA & ROUTING AUDIT")
    print("=" * 60)

    success_count = 0

    for path, label in ROUTES:
        url = f"{BASE_URL}{path}"
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) QA-Bot"}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                status = response.getcode()
                html = response.read().decode("utf-8")

                print(f"\n[PASS] {label} ({path}) -> HTTP {status}")

                # Check forbidden patterns in HTML response
                found_forbidden = []
                for pattern in FORBIDDEN_PATTERNS:
                    if re.search(pattern, html, re.IGNORECASE):
                        found_forbidden.append(pattern)

                if found_forbidden:
                    print(f"  [WARN] Found prohibited placeholder matches: {found_forbidden}")
                else:
                    print("  [OK] No forbidden placeholder strings detected.")

                success_count += 1
        except Exception as e:
            print(f"\n[FAIL] {label} ({path}) -> Error: {e}")

    print("\n" + "=" * 60)
    print(f"RESULTS: {success_count}/{len(ROUTES)} routes verified successfully.")
    print("=" * 60)

if __name__ == "__main__":
    run_qa()
