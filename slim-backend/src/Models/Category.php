<?php
namespace App\Models;

use App\Database;

class Category {
    public static function getAll() {
        $db = Database::connect();
        $result = pg_query($db, "SELECT * FROM categories ORDER BY id ASC");
        $categories = [];
        while ($row = pg_fetch_assoc($result)) $categories[] = $row;
        return $categories;
    }

    public static function getById($id) {
        $db = Database::connect();
        $result = pg_query_params($db, "SELECT * FROM categories WHERE id = $1", [$id]);
        return pg_fetch_assoc($result) ?: null;
    }
}
