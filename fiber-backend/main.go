package main

import (
	"log"
	"os"

	"fiber-backend/config"
	"fiber-backend/models"
	"fiber-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ No .env file found, using system environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	// Connect to database
	config.ConnectDB()


	models.Migrate(config.DB)

	// Initialize Fiber
	app := fiber.New()
	app.Use(cors.New())

	// Setup routes
	routes.Setup(app)

	log.Println("🚀 Server running on " + port)
	log.Fatal(app.Listen(":" + port))
}
