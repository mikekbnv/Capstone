package types

import "gorm.io/gorm"

type Employee struct {
	gorm.Model
	Id         int    `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	First_Name string `json:"first_name" gorm:"text;not null;default:null"`
	Last_Name  string `json:"last_name" gorm:"text;not null;default:''"`
}
