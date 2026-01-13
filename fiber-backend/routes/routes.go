package routes

import (
	"fiber-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("✅ Product notification server running")
	})

	app.Get("/notifications", controllers.GetNotifications)

	// Category controller
	categoryController := &controllers.CategoryController{}

	// Subcategories route
	app.Get("/maincategories", categoryController.GetSubcategories)
}
