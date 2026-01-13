<?php
namespace App\Models;

use App\Database;

class Review {
    public static function getAll($productId = null) {
        $db = Database::connect();
        $values = [];
        $whereSQL = '';

        if ($productId) { $whereSQL = 'WHERE product_id = $1'; $values[] = $productId; }

        $query = "SELECT * FROM reviews $whereSQL ORDER BY date DESC";
        $result = pg_query_params($db, $query, $values);
        $reviews = [];
        while ($row = pg_fetch_assoc($result)) {
            $reviews[] = [
                'id' => (int)$row['id'],
                'product_id' => (int)$row['product_id'],
                'rating' => (int)$row['rating'],
                'comment' => $row['comment'],
                'date' => $row['date'],
                'reviewerName' => $row['reviewername'],
                'reviewerEmail' => $row['revieweremail']
            ];
        }
        return $reviews;
    }

    public static function getById($id) {
        $db = Database::connect();
        $result = pg_query_params($db, "SELECT * FROM reviews WHERE id = $1", [$id]);
        if ($row = pg_fetch_assoc($result)) {
            return [
                'id' => (int)$row['id'],
                'product_id' => (int)$row['product_id'],
                'rating' => (int)$row['rating'],
                'comment' => $row['comment'],
                'date' => $row['date'],
                'reviewerName' => $row['reviewername'],
                'reviewerEmail' => $row['revieweremail']
            ];
        }
        return null;
    }

    public static function getByProduct($productId) {
        $db = Database::connect();
        $query = "
            SELECT r.*, p.title, p.thumbnail
            FROM reviews r
            INNER JOIN products p ON r.product_id = p.id
            WHERE r.product_id = $1
            ORDER BY r.date DESC
        ";
        $result = pg_query_params($db, $query, [$productId]);
        $reviews = [];
        while ($row = pg_fetch_assoc($result)) {
            $reviews[] = [
                'id' => (int)$row['id'],
                'product_id' => (int)$row['product_id'],
                'rating' => (int)$row['rating'],
                'comment' => $row['comment'],
                'date' => $row['date'],
                'reviewerName' => $row['reviewername'],
                'reviewerEmail' => $row['revieweremail'],
                'productTitle' => $row['title'],
                'productThumbnail' => $row['thumbnail']
            ];
        }
        return $reviews;
    }
}
