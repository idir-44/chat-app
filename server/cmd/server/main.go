package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/idir-44/chat-app/internal/controllers"
	"github.com/idir-44/chat-app/internal/repositories"
	"github.com/idir-44/chat-app/internal/services"
	"github.com/idir-44/chat-app/internal/ws"
	"github.com/idir-44/chat-app/pkg/database"
	"github.com/idir-44/chat-app/pkg/server"
)

func main() {
	srv := server.New(server.Config{Port: 8080})

	db, err := database.Connect()
	if err != nil {
		log.Fatalf("failed to init store: %s", err)
		return
	}
	defer db.Close()

	repository := repositories.NewRepository(db)
	service := services.NewService(repository)

	v1 := srv.NewGroup("/v1")

	hub := ws.NewHub()
	wsHandler := ws.NewHundler(hub)

	go hub.Run()

	controllers.RegisterHandlers(v1, service, wsHandler)

	data, err := json.MarshalIndent(srv.Router.Routes(), "", "  ")
	if err != nil {
		fmt.Printf("failed to marshal routes: %s", err)
	}

	fmt.Println(string(data))

	srv.Run()

}
