package services

import (
	"github.com/idir-44/chat-app/internal/models"
	"github.com/idir-44/chat-app/internal/repositories"
)

type services struct {
	repository repositories.Repository
}

func NewService(repo repositories.Repository) Service {
	return services{repo}
}

type Service interface {
	CreateUser(req models.CreatUserRequest) (models.User, error)
	Login(req models.LoginRequest) (models.User, string, error)
}
