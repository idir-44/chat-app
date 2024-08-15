package ws

import (
	"log"

	"github.com/idir-44/chat-app/internal/models"
	"github.com/idir-44/chat-app/internal/repositories"
)

type Room struct {
	ID      string
	Name    string
	Clients map[string]*Client
}

type Hub struct {
	repository repositories.Repository
	Rooms      map[string]*Room
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan models.Message
}

func NewHub(repository repositories.Repository) *Hub {
	return &Hub{
		repository: repository,
		Rooms:      make(map[string]*Room),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan models.Message, 5),
	}
}

func (h *Hub) Run() {
	rooms, err := h.repository.GetRooms()
	if err != nil {
		log.Panicf("error getting rooms %q", err)
	}

	for _, room := range rooms {
		h.Rooms[room.ID] = &Room{
			ID:      room.ID,
			Name:    room.Name,
			Clients: make(map[string]*Client),
		}
	}

	for {
		select {
		case cl := <-h.Register:
			if _, ok := h.Rooms[cl.RoomId]; ok {
				r := h.Rooms[cl.RoomId]

				if _, ok := r.Clients[cl.ID]; !ok {
					r.Clients[cl.ID] = cl
				}
			}
		case cl := <-h.Unregister:
			if _, ok := h.Rooms[cl.RoomId]; ok {
				if _, ok := h.Rooms[cl.RoomId].Clients[cl.ID]; ok {
					if cl.Messages != nil && len(cl.Messages) != 0 {
						if err := h.repository.SaveMessages(cl.Messages); err != nil {
							log.Printf("error saving messages: %q", err)
						}
					}

					delete(h.Rooms[cl.RoomId].Clients, cl.ID)
					close(cl.Message)
				}
			}
		case m := <-h.Broadcast:
			if _, ok := h.Rooms[m.RoomId]; ok {
				for _, cl := range h.Rooms[m.RoomId].Clients {
					cl.Message <- m
				}
			}
		}
	}
}
