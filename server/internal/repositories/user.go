package repositories

import (
	"context"
	"time"

	"github.com/idir-44/chat-app/internal/models"
)

func (r repository) CreateUser(user models.User) (models.User, error) {

	user.CreatedAt = time.Now().UTC()
	user.UpdatedAt = time.Now().UTC()

	_, err := r.db.NewInsert().Model(&user).ExcludeColumn("id").Returning("*").Exec(context.TODO())
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}
