package ws

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/idir-44/chat-app/internal/models"
)

type Client struct {
	Conn     *websocket.Conn
	Message  chan models.Message
	Messages []models.Message
	ID       string
	RoomId   string
	Email    string
}

func (c *Client) writeMessage() {
	defer func() {
		c.Conn.Close()
	}()

	for {
		message, ok := <-c.Message
		if !ok {
			return
		}

		if message.Email == c.Email {
			c.Messages = append(c.Messages, message)
		}

		c.Conn.WriteJSON(message)
	}
}

func (c *Client) readMessage(hub *Hub) {
	defer func() {
		hub.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, m, err := c.Conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		msg := models.Message{
			Content: string(m),
			RoomId:  c.RoomId,
			Email:   c.Email,
		}

		hub.Broadcast <- msg
	}
}
