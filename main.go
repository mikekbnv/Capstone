package main

import (
	"github.com/mikekbnv/grpc-react-web/database"
	handlers "github.com/mikekbnv/grpc-react-web/internal/handler"
)

func main() {
	database.ConnectDb()
	go handlers.RunServer()
}
