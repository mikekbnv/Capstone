package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/mikekbnv/grpc-react-web/internal/types"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Dbinstance struct {
	Db *gorm.DB
}

var DB Dbinstance

func ConnectDb() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	dsn := fmt.Sprintf(
		"host=db user=%s password=%s dbname=%s port=5432 sslmode=disable",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database. \n", err)
		os.Exit(2)
	}

	log.Println("connected")
	db.Logger = logger.Default.LogMode(logger.Info)

	log.Println("running migrations")
	db.AutoMigrate(&types.Employee{})
	db.AutoMigrate(&types.Visit_log{})

	DB = Dbinstance{
		Db: db,
	}
}
