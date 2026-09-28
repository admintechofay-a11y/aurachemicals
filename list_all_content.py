import requests
import json

BASE_URL = "https://aurachemicals.in"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

pages = requests.get(f"{BASE_URL}/wp-json/wp/v2/pages?per_page=100", headers=headers).json()
print("=== ALL PAGES ===")
for p in pages:
    print(f"ID: {p['id']}, Slug: {p['slug']}, Title: {p['title']['rendered']}, Link: {p['link']}")

posts = requests.get(f"{BASE_URL}/wp-json/wp/v2/posts?per_page=100", headers=headers).json()
print("\n=== ALL POSTS ===")
for p in posts:
    print(f"ID: {p['id']}, Slug: {p['slug']}, Title: {p['title']['rendered']}, Link: {p['link']}")
