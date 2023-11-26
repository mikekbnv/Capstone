package types

import (
	"time"

	"gorm.io/gorm"
)
//Types used in the project
type Employee struct {
	gorm.Model
	Id         int32  `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	First_Name string `json:"first_name" gorm:"text;not null;default:null"`
	Last_Name  string `json:"last_name" gorm:"text;not null;default:''"`
	Role       string `json:"role" gorm:"text;not null;default:''"`
}

type Visit_log struct {
	gorm.Model
	Id          int       `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Employee_id int       `json:"employee_id" gorm:"not null;default:null"`
	Date        time.Time `json:"date" gorm:"not null;default:null"`
	Status      string    `json:"status" gorm:"text;not null;default:''"`
}
