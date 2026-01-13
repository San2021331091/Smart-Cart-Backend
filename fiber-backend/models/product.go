package models

import (
	"time"

	"gorm.io/datatypes"
	
)

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


