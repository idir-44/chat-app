package repositories

import (
	"github.com/idir-44/chat-app/internal/models"
	"github.com/uptrace/bun"
)

type repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) Repository {
	return repository{db}
}

type Repository interface {
	CreateUser(req models.User) (models.User, error)
	GetUserByEmail(email string) (models.User, error)
	CreateRoom(req models.CreateRoomReq) (models.Room, error)
	GetRooms() ([]models.Room, error)
	SaveMessages([]models.Message) error
	GetMessages(roomID string) ([]models.Message, error)
}
