package ws

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/idir-44/chat-app/internal/helpers"
	"github.com/labstack/echo/v4"
)

type WsHandler struct {
	hub *Hub
}

func NewHundler(h *Hub) *WsHandler {
	return &WsHandler{
		hub: h,
	}
}

type CreateRoomReq struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h *WsHandler) CreateRoom(c echo.Context) error {
	_, err := helpers.GetUser(c)
	if err != nil {
		return err
	}

	var req CreateRoomReq

	if err := c.Bind(&req); err != nil {
		return err
	}

	h.hub.Rooms[req.ID] = &Room{
		ID:      req.ID,
		Name:    req.Name,
		Clients: make(map[string]*Client),
	}

	return c.JSON(http.StatusOK, req)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *WsHandler) JoinRoom(c echo.Context) error {
	user, err := helpers.GetUser(c)
	if err != nil {
		return err
	}

	conn, err := upgrader.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}

	roomID := c.Param("roomId")
	email := user.Email
	clientID := user.ID

	cl := &Client{
		Conn:    conn,
		Message: make(chan *Message, 10),
		ID:      clientID,
		RoomId:  roomID,
		Email:   email,
	}

	m := &Message{
		Content: "A new user has joined the room",
		RoomId:  roomID,
		Email:   email,
	}

	// Register a new Client
	h.hub.Register <- cl
	// Broadcast the message
	h.hub.Broadcast <- m

	go cl.writeMessage()
	cl.readMessage(h.hub)

	return nil

}

type RoomRes struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h *WsHandler) GetRooms(c echo.Context) error {
	_, err := helpers.GetUser(c)
	if err != nil {
		return err
	}

	rooms := make([]RoomRes, 0)

	for _, room := range h.hub.Rooms {
		rooms = append(rooms, RoomRes{
			ID:   room.ID,
			Name: room.Name,
		})
	}

	return c.JSON(http.StatusOK, rooms)

}

type ClientRes struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

func (h *WsHandler) GetClients(c echo.Context) error {
	_, err := helpers.GetUser(c)
	if err != nil {
		return err
	}

	var clients []ClientRes

	roomId := c.Param("roomId")

	if _, ok := h.hub.Rooms[roomId]; !ok {
		return fmt.Errorf("room not found")
	}

	if h.hub.Rooms[roomId].Clients == nil {
		return fmt.Errorf("no clients in the room")
	}

	for _, client := range h.hub.Rooms[roomId].Clients {
		clients = append(clients, ClientRes{
			ID:    client.ID,
			Email: client.Email,
		})
	}

	return c.JSON(http.StatusOK, clients)
}
