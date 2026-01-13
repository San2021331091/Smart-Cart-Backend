<?php
namespace App\Models;

use App\Database;

class CartItem {
    public static function getAll($userUid = null) {
        $db = Database::connect();
        $values = []; $whereSQL = '';
        if ($userUid) { $whereSQL = 'WHERE user_uid = $1'; $values[] = $userUid; }

        $query = "SELECT * FROM cart_items $whereSQL ORDER BY added_at DESC";
        $result = pg_query_params($db, $query, $values);
        $items = [];
        while ($row = pg_fetch_assoc($result)) {
            $items[] = [
                'id' => (int)$row['id'],
                'user_uid' => $row['user_uid'],
                'product_id' => (int)$row['product_id'],
                'img_url' => $row['img_url'],
                'quantity' => (int)$row['quantity'],
                'price' => isset($row['price']) ? (float)$row['price'] : null,
                'added_at' => $row['added_at']
            ];
        }
        return $items;
    }

    public static function getById($id) {
        $db = Database::connect();
        $result = pg_query_params($db, "SELECT * FROM cart_items WHERE id = $1", [$id]);
        return pg_fetch_assoc($result) ? self::format(pg_fetch_assoc($result)) : null;
    }

    public static function update($id, $data) {
        $db = Database::connect();
        $fields = []; $values = []; $i = 1;
        if (isset($data['quantity'])) { $fields[] = "quantity = $$i"; $values[] = (int)$data['quantity']; $i++; }
        if (isset($data['price'])) { $fields[] = "price = $$i"; $values[] = (float)$data['price']; $i++; }
        if (empty($fields)) return null;

        $values[] = $id;
        $sql = "UPDATE cart_items SET ".implode(', ', $fields)." WHERE id = $$i RETURNING *";
        $result = pg_query_params($db, $sql, $values);
        if ($row = pg_fetch_assoc($result)) return self::format($row);
        return null;
    }

    public static function delete($id) {
        $db = Database::connect();
        $result = pg_query_params($db, "DELETE FROM cart_items WHERE id = $1 RETURNING *", [$id]);
        if ($row = pg_fetch_assoc($result)) return self::format($row);
        return null;
    }

    private static function format($row) {
        return [
            'id' => (int)$row['id'],
            'user_uid' => $row['user_uid'],
            'product_id' => (int)$row['product_id'],
            'img_url' => $row['img_url'],
            'quantity' => (int)$row['quantity'],
            'price' => isset($row['price']) ? (float)$row['price'] : null,
            'added_at' => $row['added_at']
        ];
    }
}
