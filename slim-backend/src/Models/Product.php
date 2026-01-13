<?php
namespace App\Models;

use App\Database;

class Product {
    public static function parseJsonFields(&$row) {
        $fields = ['tags', 'dimensions', 'meta', 'images'];
        foreach ($fields as $field) {
            $row[$field] = json_decode($row[$field] ?? 'null', true);
        }
    }

    public static function getAll($params = []) {
        $db = Database::connect();
        $whereClauses = [];
        $values = [];
        $i = 1;

        if (!empty($params['search'])) {
            $whereClauses[] = "(LOWER(title) LIKE LOWER($$i) OR LOWER(brand) LIKE LOWER($$i) OR LOWER(description) LIKE LOWER($$i))";
            $values[] = '%' . $params['search'] . '%';
            $i++;
        }
        if (!empty($params['title'])) { $whereClauses[] = "LOWER(title) = LOWER($$i)"; $values[] = $params['title']; $i++; }
        if (!empty($params['category'])) { $whereClauses[] = "category = $$i"; $values[] = $params['category']; $i++; }
        if (!empty($params['minPrice'])) { $whereClauses[] = "price >= $$i"; $values[] = $params['minPrice']; $i++; }
        if (!empty($params['maxPrice'])) { $whereClauses[] = "price <= $$i"; $values[] = $params['maxPrice']; $i++; }
        if (!empty($params['tags'])) {
            foreach (explode(',', $params['tags']) as $tag) {
                $whereClauses[] = "tags @> $$i::jsonb";
                $values[] = json_encode([$tag]);
                $i++;
            }
        }

        $whereSQL = count($whereClauses) > 0 ? 'WHERE ' . implode(' AND ', $whereClauses) : '';
        $allowedSortFields = ['price', 'rating', 'title', 'stock', 'id'];
        $sortBy = in_array($params['sortBy'] ?? '', $allowedSortFields) ? $params['sortBy'] : 'id';
        $order = strtoupper($params['order'] ?? 'ASC') === 'DESC' ? 'DESC' : 'ASC';
        $limit = isset($params['limit']) && is_numeric($params['limit']) ? (int)$params['limit'] : null;
        $offset = isset($params['offset']) && is_numeric($params['offset']) ? (int)$params['offset'] : 0;

        $query = "SELECT * FROM products $whereSQL ORDER BY $sortBy $order";
        if ($limit !== null) $query .= " LIMIT $limit OFFSET $offset";

        $result = pg_query_params($db, $query, $values);
        $products = [];
        while ($row = pg_fetch_assoc($result)) {
            self::parseJsonFields($row);
            $products[] = $row;
        }
        return $products;
    }

    public static function getById($id) {
        $db = Database::connect();
        $result = pg_query_params($db, "SELECT * FROM products WHERE id = $1", [$id]);
        if ($row = pg_fetch_assoc($result)) {
            self::parseJsonFields($row);
            return $row;
        }
        return null;
    }

    public static function getTrending() {
        $db = Database::connect();
        $query = "
            SELECT *, 
            ((rating*2) + (discountPercentage*0.5) + (CASE WHEN stock=0 THEN 0 ELSE 100.0/stock END) +
            (CASE WHEN meta->>'updatedAt' IS NOT NULL THEN 30.0/(EXTRACT(DAY FROM NOW()-(meta->>'updatedAt')::timestamp)+1) ELSE 0 END)
            ) AS trending_score
            FROM products ORDER BY trending_score DESC LIMIT 10
        ";
        $result = pg_query($db, $query);
        $trending = [];
        while ($row = pg_fetch_assoc($result)) {
            self::parseJsonFields($row);
            $trending[] = $row;
        }
        return $trending;
    }

    public static function getSimilar($id) {
        $db = Database::connect();
        $product = self::getById($id);
        if (!$product) return null;
        $result = pg_query_params($db, "SELECT * FROM products WHERE id != $1 AND category = $2 LIMIT 10", [$id, $product['category']]);
        $similar = [];
        while ($row = pg_fetch_assoc($result)) {
            self::parseJsonFields($row);
            $similar[] = $row;
        }
        return $similar;
    }

    public static function getTodaysSales() {
        $db = Database::connect();
        $query = "
            SELECT * FROM products
            WHERE is_on_sale = TRUE
            AND CURRENT_DATE BETWEEN sale_start AND sale_end
            ORDER BY discountPercentage DESC LIMIT 10
        ";
        $result = pg_query($db, $query);
        $sales = [];
        while ($row = pg_fetch_assoc($result)) {
            self::parseJsonFields($row);
            $sales[] = $row;
        }
        return $sales;
    }
}
