package main

import (
	"log"

	"github.com/mikekbnv/grpc-react-web/database"
	handlers "github.com/mikekbnv/grpc-react-web/internal/handler"
)

func main() {
	database.ConnectDb()
	_, err := database.RDB.Ping(database.Ctx).Result()
	if err != nil {
		log.Fatal(err)
	}
	handlers.RunServer()
}
