package services

import "github.com/idir-44/chat-app/internal/models"

func (s services) CreateUser(req models.User) (models.User, error) {
	return s.repository.CreateUser(req)
}
