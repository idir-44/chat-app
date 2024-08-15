package repositories

import (
	"context"
	"time"

	"github.com/idir-44/chat-app/internal/models"
)

func (r repository) CreateRoom(req models.CreateRoomReq) (models.Room, error) {
	room := models.Room{
		Name: req.Name,

		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}

	_, err := r.db.NewInsert().Model(&room).ExcludeColumn("id").Returning("*").Exec(context.TODO())
	if err != nil {
		return models.Room{}, err
	}

	return room, nil

}

func (r repository) GetRooms() ([]models.Room, error) {
	var res []models.Room

	err := r.db.NewSelect().Model(&res).Scan(context.TODO())

	return res, err

}

func (r repository) SaveMessages(messages []models.Message) error {

	_, err := r.db.NewInsert().Model(&messages).ExcludeColumn("id").Exec(context.TODO())

	return err
}

func (r repository) GetMessages(roomID string) ([]models.Message, error) {
	var messages []models.Message

	err := r.db.NewSelect().Model(&messages).Where("room_id = ?", roomID).Scan(context.TODO())

	return messages, err

}
