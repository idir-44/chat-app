package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/idir-44/chat-app/controllers"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	router := gin.Default()

	router.POST("/signup", controllers.CreateUser)
	router.POST("/login", controllers.Login)
	router.GET("/logout", controllers.Logout)

	router.Run("localhost:" + port)

}
