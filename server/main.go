package main

import (
	"os"

	"github.com/gin-contrib/cors"
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

	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	hub := ws.NewHub()
	wsHandler := ws.NewHundler(hub)

	go hub.Run()

	router.POST("/signup", controllers.CreateUser)
	router.POST("/login", controllers.Login)
	router.GET("/logout", controllers.Logout)

	router.POST("/ws/createRoom", wsHandler.CreateRoom)
	router.GET("/ws/getRooms", wsHandler.GetRooms)
	router.GET("/ws/getClients/:roomId", wsHandler.GetClients)

	router.GET("/ws/joinRoom/:roomId", wsHandler.JoinRoom)

	router.Run("localhost:" + port)

}
