<?php
namespace App;

class Database {
    private static $connection;

    public static function connect() {
        if (!self::$connection) {
            $pgConnStr = sprintf(
                "host=%s port=%s dbname=%s user=%s password=%s sslmode=%s",
                $_ENV['DB_HOST'],
                $_ENV['DB_PORT'],
                $_ENV['DB_NAME'],
                $_ENV['DB_USER'],
                $_ENV['DB_PASS'],
                $_ENV['DB_SSLMODE']
            );
            self::$connection = pg_connect($pgConnStr);

            if (!self::$connection) {
                die("❌ Database connection failed.");
            }
        }
        return self::$connection;
    }
}
