from flask import Flask, request, jsonify, redirect
import requests
import re
from typing import List, Optional, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from collections import Counter
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

FAVICON_URL = "https://i.ibb.co/Wp72bhC0/chat.png"

all_categories = [
    "mens-shoes", "groceries", "motorcycle", "home-decoration", "womens-bags",
    "sunglasses", "furniture", "beauty", "mobile-accessories", "laptops",
    "womens-watches", "tablets", "womens-shoes", "sports-accessories",
    "smartphones", "womens-dresses", "mens-watches", "mens-shirts", "vehicle",
    "fragrances", "womens-jewellery", "skin-care", "kitchen-accessories", "tops"
]

PRODUCTS_API = "https://slimcommerce.onrender.com/products"
normalized_categories = {c: re.sub(r"[^a-z0-9]+", "", c.lower()) for c in all_categories}
trending_searches = Counter()

@app.route("/")
def home():
    return jsonify({
        "message": "👋 Welcome to SmartCart AI Assistant!",
        "endpoints": ["/ask", "/similar", "/trending"]
    })


@app.route("/favicon.ico")
def favicon():
    return redirect(FAVICON_URL)


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


def find_best_match(product_name: str, products: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not products:
        return None
    product_name_lower = product_name.lower()
    for p in products:
        if product_name_lower in p.get('title', '').lower():
            return p

    titles = [p.get('title', '').lower() for p in products]
    vectorizer = TfidfVectorizer().fit_transform([product_name_lower] + titles)
    vectors = vectorizer.toarray()
    query_vec = vectors[0].reshape(1, -1)
    titles_vecs = vectors[1:]
    similarities = cosine_similarity(query_vec, titles_vecs).flatten()
    best_idx = similarities.argmax()
    best_score = similarities[best_idx]
    if best_score > 0.3:
        return products[best_idx]
    return None


def normalize_text(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def safe_float(value: Any) -> float:
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json(force=True)
    user_input = data.get("query", "").strip().lower()

    if user_input:
        trending_searches[user_input] += 1

    if user_input in ["hi", "hello", "hey"]:
        return jsonify({
            "answer": "👋 Hello! I am SmartCart, your AI shopping assistant. Ask me about product availability, price filters, or suggestions!",
            "yes": True
        })

    price_search = re.search(r'(?:below|less than|under|<)\s*\$?(\d+(\.\d+)?)', user_input)
    price_gt_search = re.search(r'(?:above|more than|over|>)\s*\$?(\d+(\.\d+)?)', user_input)
    price_limit = float(price_search.group(1)) if price_search else None
    price_gt = float(price_gt_search.group(1)) if price_gt_search else None

    normalized_input = normalize_text(user_input)
    matched_category = None
    for c, norm_cat in normalized_categories.items():
        if norm_cat in normalized_input.replace(" ", ""):
            matched_category = c
            break

    stock_match = re.search(r'is the (.+?) (in stock|available)\??', user_input)
    if stock_match:
        product_name = stock_match.group(1).strip()
        matched_products = fetch_products_by_title(product_name)
        best_product = find_best_match(product_name, matched_products)
        if best_product:
            stock = best_product.get("stock", 0)
            availability = best_product.get("availabilitystatus", "").lower()
            in_stock = (availability == "in stock") or (int(stock) > 0)
            return jsonify({
                "answer": f"Yes, '{best_product['title']}' is in stock with {stock} items." if in_stock else f"Sorry, '{best_product['title']}' is out of stock.",
                "product": best_product,
                "yes": in_stock,
                "no": not in_stock
            })
        return jsonify({"answer": f"Sorry, no match found for '{product_name}'.", "no": True})

    if matched_category:
        products = fetch_products_by_category(matched_category)
        filtered = products
        if price_limit is not None:
            filtered = [p for p in filtered if safe_float(p.get("price")) < price_limit]
            return jsonify({
                "answer": f"Products in category '{matched_category}' below ${price_limit}:",
                "products": filtered,
                "yes": True
            })
        if price_gt is not None:
            filtered = [p for p in filtered if safe_float(p.get("price")) > price_gt]
            return jsonify({
                "answer": f"Products in category '{matched_category}' above ${price_gt}:",
                "products": filtered,
                "yes": True
            })
        return jsonify({
            "answer": f"Products in category '{matched_category}':",
            "products": filtered,
            "yes": True
        })

    if price_limit is not None:
        all_products = fetch_all_products()
        filtered = [p for p in all_products if safe_float(p.get("price")) < price_limit]
        return jsonify({
            "answer": f"Products below ${price_limit}:",
            "products": filtered,
            "yes": True
        })

    if price_gt is not None:
        all_products = fetch_all_products()
        filtered = [p for p in all_products if safe_float(p.get("price")) > price_gt]
        return jsonify({
            "answer": f"Products above ${price_gt}:",
            "products": filtered,
            "yes": True
        })

    return jsonify({"answer": "Sorry, I didn't understand. Try asking about stock, price, or categories.", "no": True})


def find_similar_products_knn(target_product: Dict[str, Any], all_products: List[Dict[str, Any]], k: int = 5) -> List[Dict[str, Any]]:
    if not target_product or not all_products:
        return []

    corpus = [f"{p.get('category', '')} {p.get('title', '')}" for p in all_products]
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(corpus)

    try:
        target_index = all_products.index(target_product)
        target_vector = vectors[target_index]
    except ValueError:
        target_text = f"{target_product.get('category', '')} {target_product.get('title', '')}"
        target_vector = vectorizer.transform([target_text])

    knn = NearestNeighbors(n_neighbors=k+1, metric='cosine')
    knn.fit(vectors)

    distances, indices = knn.kneighbors(target_vector, return_distance=True)

    similar = []
    for idx, dist in zip(indices[0], distances[0]):
        if all_products[idx] != target_product:
            similar.append(all_products[idx])
        if len(similar) >= k:
            break

    return similar


@app.route("/similar", methods=["POST"])
def similar():
    data = request.get_json(force=True)
    product_query = data.get("query", "").strip()
    if not product_query:
        return jsonify({"error": "Missing product title"}), 400

    trending_searches[product_query.lower()] += 1

    matched_products = fetch_products_by_title(product_query)
    target_product = find_best_match(product_query, matched_products)

    if not target_product:
        return jsonify({"answer": f"No product found for '{product_query}'.", "no": True})

    category = target_product.get("category", "")
    category_products = fetch_products_by_category(category)
    similar_products = find_similar_products_knn(target_product, category_products, k=5)

    return jsonify({
        "answer": f"Products similar to '{target_product['title']}' in category '{category}':",
        "target_product": target_product,
        "similar_products": similar_products,
        "yes": True
    })


@app.route("/trending", methods=["GET"])
def trending():
    top_n = 10
    results = trending_searches.most_common(top_n)
    return jsonify({
        "trending_searches": [
            {"query": query, "count": count} for query, count in results
        ]
    })


if __name__ == "__main__":
    app.run(debug=True)
