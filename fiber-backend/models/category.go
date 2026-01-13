package models

type Subcategory struct {
	ID             int    `gorm:"column:id" json:"id"`
	Slug           string `gorm:"column:slug" json:"slug"`
	Name           string `gorm:"column:name" json:"name"`
	MainCategoryID int    `gorm:"column:maincategory_id" json:"-"`
}

type MainCategory struct {
	ID            int           `gorm:"column:maincategory_id" json:"maincategory_id"`
	Name          string        `gorm:"column:name" json:"maincategory_name"`
	ImgURL        string        `gorm:"column:imgurl" json:"imgURL"` 
	Subcategories []Subcategory `gorm:"-" json:"subcategories"`
}
