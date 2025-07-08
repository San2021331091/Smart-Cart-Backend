package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

// ---------- Models ----------

type Product struct {
	ID                   uint           `gorm:"primaryKey"`
	Title                string         `gorm:"not null"`
	Description          string
	Category             string
	Price                float64
	DiscountPercentage   float64
	Rating               float64
	Stock                int
	Tags                 datatypes.JSON `gorm:"type:jsonb"`
	Brand                string
	SKU                  string
	Weight               float64
	Dimensions           datatypes.JSON `gorm:"type:jsonb"`
	AvailabilityStatus   string
	MinimumOrderQuantity int
	Meta                 datatypes.JSON `gorm:"type:jsonb"`
	Images               datatypes.JSON `gorm:"type:jsonb"`
	Thumbnail            string
}

// Temporary struct to inject a timestamp
type ProductNotification struct {
	ID          uint
	Title       string
	Category    string
	Description string
	CreatedAt   time.Time
}

type NotificationResponse struct {
	Type      string    `json:"type"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️ No .env file found, using system environment variables")
	}

	dsn := os.Getenv("DATABASE_URL")
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	// Connect to database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatal("❌ Failed to connect to DB:", err)
	}

	_ = db.AutoMigrate(&Product{})

	app := fiber.New()

	// ✅ Enable CORS for all origins
	app.Use(cors.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("✅ Product notification server running")
	})

	app.Get("/notifications", func(c *fiber.Ctx) error {
		var prodNotifs []ProductNotification
		var notifications []NotificationResponse

		rawQuery := `
			SELECT 
				id, 
				title, 
				category, 
				description, 
				CURRENT_TIMESTAMP AS created_at
			FROM products 
			ORDER BY id DESC 
			LIMIT 5
		`

		if err := db.Raw(rawQuery).Scan(&prodNotifs).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to load product notifications"})
		}

		for _, p := range prodNotifs {
			notifications = append(notifications, NotificationResponse{
				Type:      "product",
				Title:     "New Product: " + p.Title,
				Message:   p.Description + " (" + p.Category + ")",
				Timestamp: p.CreatedAt,
			})
		}

		return c.JSON(notifications)
	})

	log.Println("🚀 Server running on http://localhost:" + port)
	log.Fatal(app.Listen(":" + port))
}
