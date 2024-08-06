package controllers

import (
	"github.com/idir-44/chat-app/internal/services"
	"github.com/idir-44/chat-app/internal/ws"
	"github.com/idir-44/chat-app/pkg/server"
)

type controller struct {
	service services.Service
}

func RegisterHandlers(routerGroup *server.Router, srv services.Service, wsHandler *ws.WsHandler) {
	c := controller{srv}

	routerGroup.POST("/users", c.createUser)

	routerGroup.POST("/login", c.login)

	// Websocket handlers
	routerGroup.POST("/ws/createRoom", wsHandler.CreateRoom)
	routerGroup.GET("/ws/getRooms", wsHandler.GetRooms)
	routerGroup.GET("/ws/getClients/:roomId", wsHandler.GetClients)

	routerGroup.GET("/ws/joinRoom/:roomId", wsHandler.JoinRoom)
}
