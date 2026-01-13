package controllers

import (
	"fiber-backend/config"
	"fiber-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetNotifications(c *fiber.Ctx) error {
	var prodNotifs []models.ProductNotification
	var notifications []models.NotificationResponse

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

	if err := config.DB.Raw(rawQuery).Scan(&prodNotifs).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to load product notifications"})
	}

	for _, p := range prodNotifs {
		notifications = append(notifications, models.NotificationResponse{
			Type:      "product",
			Title:     "New Product: " + p.Title,
			Message:   p.Description + " (" + p.Category + ")",
			Timestamp: p.CreatedAt,
		})
	}

	return c.JSON(notifications)
}
