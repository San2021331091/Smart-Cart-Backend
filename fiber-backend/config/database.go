package config

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	

	if dsn == "" {
		log.Fatal("❌ DATABASE_URL is empty. Check your .env file")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{SingularTable: true},
		Logger:         logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatal("❌ Failed to connect to DB:", err)
	}

	DB = db
	log.Println("✅ Connected to DB successfully")
}
