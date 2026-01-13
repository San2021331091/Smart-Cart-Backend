import re
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from collections import Counter

from models.product import fetch_all_products, fetch_products_by_category, fetch_products_by_title, normalized_categories

# Tracks trending searches
trending_searches = Counter()

def normalize_text(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()

def safe_float(value: Any) -> float:
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0

def detect_category_from_text(text: str) -> Optional[str]:
    normalized_input = normalize_text(text).replace(" ", "")
    for c, norm_cat in normalized_categories.items():
        if norm_cat in normalized_input:
            return c
    return None

def find_best_match(product_name: str, products: Optional[List[Dict[str, Any]]] = None) -> Optional[Dict[str, Any]]:
    if products is None:
        products = fetch_products_by_title(product_name)
    if not products:
        products = fetch_all_products()
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

def find_similar_products_knn(target_product: Dict[str, Any], all_products: Optional[List[Dict[str, Any]]] = None, k: int = 5) -> List[Dict[str, Any]]:
    if not target_product:
        return []

    if all_products is None:
        category = target_product.get("category") or detect_category_from_text(target_product.get("title", ""))
        all_products = fetch_products_by_category(category) if category else fetch_all_products()
    if not all_products:
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
    for idx, _ in zip(indices[0], distances[0]):
        if all_products[idx] != target_product:
            similar.append(all_products[idx])
        if len(similar) >= k:
            break
    return similar
