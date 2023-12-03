package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/idir-44/chat-app/controllers"
	"github.com/idir-44/chat-app/ws"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	router := gin.Default()

	hub := ws.NewHub()
	wsHandler := ws.NewHundler(hub)

	go hub.Run()

	router.POST("/signup", controllers.CreateUser)
	router.POST("/login", controllers.Login)
	router.GET("/logout", controllers.Logout)

	router.POST("/ws/createRoom", wsHandler.CreateRoom)
	router.GET("/ws/joinRoom/:roomId", wsHandler.JoinRoom)
	router.GET("/ws/getRooms", wsHandler.GetRooms)
	router.GET("/ws/getClients/:roomId", wsHandler.GetClients)

	router.Run("localhost:" + port)

}
