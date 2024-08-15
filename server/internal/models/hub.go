package models

import (
	"time"
)

type Room struct {
	ID   string `json:"id"`
	Name string `json:"name"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type Message struct {
	ID string `json:"id"`

	Content string `json:"content"`
	RoomId  string `json:"roomId"`
	Email   string `json:"email"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type CreateRoomReq struct {
	ID   string
	Name string `json:"name"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type ClientRes struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}
