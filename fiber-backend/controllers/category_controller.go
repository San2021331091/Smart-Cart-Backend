package controllers

import (
	"fiber-backend/config"
	"fiber-backend/models"

	"github.com/gofiber/fiber/v2"
)

type CategoryController struct{}

func (cc *CategoryController) GetSubcategories(c *fiber.Ctx) error {
	var mains []models.MainCategory

	// Fetch main categories
	if err := config.DB.
		Table("maincategories").
		Select("maincategory_id, name, imgurl").
		Order("maincategory_id").
		Find(&mains).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "cannot fetch main categories",
			"msg":   err.Error(),
		})
	}

	// Fetch subcategories
	var subs []models.Subcategory
	if err := config.DB.
		Table("maincategories").
		Select("id, slug, name, maincategory_id").
		Order("maincategory_id, id").
		Find(&subs).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "cannot fetch subcategories",
			"msg":   err.Error(),
		})
	}

	// Map subcategories
	subMap := make(map[int][]models.Subcategory)
	for _, s := range subs {
		subMap[s.MainCategoryID] = append(subMap[s.MainCategoryID], s)
	}

	for i := range mains {
		mains[i].Subcategories = subMap[mains[i].ID]
	}

	return c.JSON(mains)
}
