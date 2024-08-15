package ws

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/idir-44/chat-app/internal/helpers"
	"github.com/idir-44/chat-app/internal/models"
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

func (h *WsHandler) CreateRoom(c echo.Context) error {
	_, err := helpers.GetUser(c)
	if err != nil {
		return err
	}

	var req models.CreateRoomReq

	if err := c.Bind(&req); err != nil {
		return err
	}

	res, err := h.hub.repository.CreateRoom(req)
	if err != nil {
		return err
	}

	h.hub.Rooms[res.ID] = &Room{
		ID:      res.ID,
		Name:    res.Name,
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
		Conn:     conn,
		Message:  make(chan models.Message, 10),
		Messages: make([]models.Message, 0),
		ID:       clientID,
		RoomId:   roomID,
		Email:    email,
	}

	// Register a new Client
	h.hub.Register <- cl

	go cl.writeMessage()
	go cl.readMessage(h.hub)

	return nil

}

func (h *WsHandler) GetRooms(c echo.Context) error {
	_, err := helpers.GetUser(c)
	if err != nil {
		return err
	}

	rooms := make([]models.Room, 0)

	for _, room := range h.hub.Rooms {
		rooms = append(rooms, models.Room{
			ID:   room.ID,
			Name: room.Name,
		})
	}

	return c.JSON(http.StatusOK, rooms)

}

func (h *WsHandler) GetMessages(c echo.Context) error {
	_, err := helpers.GetUser(c)
	if err != nil {
		return err
	}

	roomID := c.Param("roomId")

	messages, err := h.hub.repository.GetMessages(roomID)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, messages)

}
