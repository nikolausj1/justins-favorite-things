#!/usr/bin/env python3
"""
Add a product to Justin's Favorite Things.

Usage:
    python3 scripts/add-product.py <ASIN>
    python3 scripts/add-product.py          # manual entry mode

Requires: pip3 install rembg Pillow requests beautifulsoup4
"""

import sys
import os
import re
import json
from pathlib import Path
from io import BytesIO
from datetime import date

# Paths relative to project root
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PRODUCTS_JSON = PROJECT_ROOT / "data" / "products.json"
IMAGES_DIR = PROJECT_ROOT / "public" / "images" / "products"


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def fetch_from_amazon(asin: str) -> dict | None:
    """Attempt to fetch product info from Amazon. Returns None on failure."""
    try:
        import requests
        from bs4 import BeautifulSoup

        url = f"https://www.amazon.com/dp/{asin}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code != 200:
            return None

        soup = BeautifulSoup(resp.text, "html.parser")

        # Try to get product title
        title_el = soup.find(id="productTitle")
        title = title_el.get_text(strip=True) if title_el else None

        # Try to get main image
        img_el = soup.find(id="landingImage") or soup.find(id="imgBlkFront")
        image_url = None
        if img_el:
            image_url = img_el.get("data-old-hires") or img_el.get("src")

        if title:
            return {"title": title, "image_url": image_url}
        return None
    except Exception:
        return None


def download_and_process_image(image_url: str, slug: str) -> str:
    """Download image, remove background, resize, and save."""
    import requests
    from PIL import Image
    from rembg import remove

    print("  Downloading image...")
    resp = requests.get(image_url, timeout=30)
    resp.raise_for_status()
    input_img = Image.open(BytesIO(resp.content)).convert("RGBA")

    print("  Removing background...")
    output_img = remove(input_img)

    # Resize to max 800x800, maintaining aspect ratio
    output_img.thumbnail((800, 800), Image.LANCZOS)

    output_path = IMAGES_DIR / f"{slug}.png"
    output_img.save(output_path, "PNG", optimize=True)
    print(f"  Saved to: {output_path}")

    return f"/images/products/{slug}.png"


def load_products() -> list:
    """Load existing products from JSON."""
    if PRODUCTS_JSON.exists():
        with open(PRODUCTS_JSON, "r") as f:
            return json.load(f)
    return []


def save_products(products: list):
    """Save products to JSON."""
    with open(PRODUCTS_JSON, "w") as f:
        json.dump(products, f, indent=2)
    print(f"  Updated: {PRODUCTS_JSON}")


def get_existing_categories(products: list) -> list[str]:
    """Get unique categories from existing products."""
    return sorted(set(p["category"] for p in products))


def main():
    asin = sys.argv[1] if len(sys.argv) > 1 else input("Enter ASIN: ").strip()

    if not asin:
        print("Error: ASIN is required.")
        sys.exit(1)

    print(f"\nProcessing ASIN: {asin}")

    # Check for duplicate
    products = load_products()
    if any(p["asin"] == asin for p in products):
        print(f"Error: Product with ASIN {asin} already exists.")
        sys.exit(1)

    # Try auto-fetch
    print("Attempting to fetch from Amazon...")
    fetched = fetch_from_amazon(asin)

    if fetched:
        print(f"  Found: {fetched['title']}")
        name = input(f"Product name [{fetched['title']}]: ").strip() or fetched["title"]
        image_url = fetched.get("image_url")
        if image_url:
            print(f"  Image URL found: {image_url[:80]}...")
            use_fetched = input("Use this image? [Y/n]: ").strip().lower()
            if use_fetched == "n":
                image_url = input("Image URL: ").strip()
        else:
            image_url = input("Image URL (paste from Amazon): ").strip()
    else:
        print("  Could not auto-fetch. Manual entry required.")
        name = input("Product name: ").strip()
        image_url = input("Image URL (paste from Amazon): ").strip()

    if not name:
        print("Error: Product name is required.")
        sys.exit(1)

    # Category
    existing_cats = get_existing_categories(products)
    if existing_cats:
        print(f"  Existing categories: {', '.join(existing_cats)}")
    category = input("Category: ").strip()

    # Tagline and personal note
    tagline = input("Tagline (one-line summary): ").strip()
    personal_note = input("Personal note (Justin says...): ").strip()

    slug = slugify(name)

    # Process image
    if image_url:
        image_path = download_and_process_image(image_url, slug)
    else:
        print("  Skipping image processing (no URL provided)")
        image_path = f"/images/products/{slug}.png"

    # Build affiliate URL
    tag = os.environ.get("NEXT_PUBLIC_AMAZON_TAG", "YOUR_TAG_HERE")
    affiliate_url = f"https://www.amazon.com/dp/{asin}?tag={tag}"

    # Create product entry
    product = {
        "id": slug,
        "name": name,
        "asin": asin,
        "tagline": tagline,
        "personalNote": personal_note,
        "category": category,
        "image": image_path,
        "affiliateUrl": affiliate_url,
        "dateAdded": date.today().isoformat(),
    }

    products.append(product)
    save_products(products)

    print(f"\nAdded: {name}")
    print(f"  ID: {slug}")
    print(f"  Category: {category}")
    print(f"  Image: {image_path}")
    print(f"  Affiliate URL: {affiliate_url}")
    print("\nDon't forget to commit and push!")


if __name__ == "__main__":
    main()
