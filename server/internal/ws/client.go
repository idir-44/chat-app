package ws

import (
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn    *websocket.Conn
	Message chan *Message
	ID      string `json:"id"`
	RoomId  string `json:"roomId"`
	Email   string `json:"email"`
}

type Message struct {
	Content string `json:"content"`
	RoomId  string `json:"roomId"`
	Email   string `json:"email"`
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

		msg := &Message{
			Content: string(m),
			RoomId:  c.RoomId,
			Email:   c.Email,
		}

		hub.Broadcast <- msg
	}
}
