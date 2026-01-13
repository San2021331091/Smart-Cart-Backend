import requests
import re
from typing import List, Dict, Any

PRODUCTS_API = "https://slimcommerce.onrender.com/products"

all_categories = [
    "mens-shoes", "groceries", "motorcycle", "home-decoration", "womens-bags",
    "sunglasses", "furniture", "beauty", "mobile-accessories", "laptops",
    "womens-watches", "tablets", "womens-shoes", "sports-accessories",
    "smartphones", "womens-dresses", "mens-watches", "mens-shirts", "vehicle",
    "fragrances", "womens-jewellery", "skin-care", "kitchen-accessories", "tops"
]

normalized_categories = {c: re.sub(r"[^a-z0-9]+", "", c.lower()) for c in all_categories}


def fetch_all_products() -> List[Dict[str, Any]]:
    try:
        resp = requests.get(PRODUCTS_API, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"Error fetching all products: {e}")
        return []


def fetch_products_by_category(category: str) -> List[Dict[str, Any]]:
    try:
        url = f"{PRODUCTS_API}?category={category}"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"Error fetching products by category '{category}': {e}")
        return []


def fetch_products_by_title(title_query: str) -> List[Dict[str, Any]]:
    try:
        url = f"{PRODUCTS_API}?title={title_query}"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"Error fetching products by title '{title_query}': {e}")
        return []
