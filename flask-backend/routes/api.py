import re
from flask import Blueprint, request, jsonify, redirect
from services.ai_assistant import (
    find_best_match,
    find_similar_products_knn,
    trending_searches,
    detect_category_from_text,
    safe_float
)
from models.product import fetch_products_by_category, fetch_products_by_title

api_bp = Blueprint("api", __name__)
FAVICON_URL = "https://i.ibb.co/Wp72bhC0/chat.png"

@api_bp.route("/")
def home():
    return jsonify({
        "message": "👋 Welcome to SmartCart AI Assistant!",
        "endpoints": ["/ask", "/similar", "/trending"]
    })

@api_bp.route("/favicon.ico")
def favicon():
    return redirect(FAVICON_URL)

@api_bp.route("/ask", methods=["POST"])
def ask():
    data = request.get_json(force=True)
    user_input = data.get("query", "").strip().lower()
    if user_input:
        trending_searches[user_input] += 1

    if user_input in ["hi", "hello", "hey"]:
        return jsonify({"answer": "👋 Hello! I am SmartCart.", "yes": True})

    price_search = re.search(r'(?:below|less than|under|<)\s*\$?(\d+(\.\d+)?)', user_input)
    price_gt_search = re.search(r'(?:above|more than|over|>)\s*\$?(\d+(\.\d+)?)', user_input)
    price_limit = float(price_search.group(1)) if price_search else None
    price_gt = float(price_gt_search.group(1)) if price_gt_search else None

    matched_category = detect_category_from_text(user_input)

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
                "answer": f"Yes, '{best_product['title']}' is in stock." if in_stock else f"Sorry, '{best_product['title']}' is out of stock.",
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
        if price_gt is not None:
            filtered = [p for p in filtered if safe_float(p.get("price")) > price_gt]
        return jsonify({"answer": f"Products in '{matched_category}'", "products": filtered, "yes": True})

    return jsonify({"answer": "Sorry, I didn't understand.", "no": True})

@api_bp.route("/similar", methods=["POST"])
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

    category_products = fetch_products_by_category(target_product.get("category", ""))
    similar_products = find_similar_products_knn(target_product, category_products)

    return jsonify({
        "answer": f"Products similar to '{target_product['title']}'",
        "target_product": target_product,
        "similar_products": similar_products,
        "yes": True
    })

@api_bp.route("/trending", methods=["GET"])
def trending():
    top_n = 10
    results = trending_searches.most_common(top_n)
    return jsonify({"trending_searches": [{"query": q, "count": c} for q, c in results]})
