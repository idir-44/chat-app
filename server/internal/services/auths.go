package services

import (
	"fmt"
	"os"

	"github.com/idir-44/chat-app/internal/jwttoken"
	"github.com/idir-44/chat-app/internal/models"
	"github.com/idir-44/chat-app/pkg/utils"
)

func (s services) Login(req models.LoginRequest) (models.User, string, error) {
	user, err := s.repository.GetUserByEmail(req.Email)
	if err != nil {
		return models.User{}, "", fmt.Errorf("bad credentials %s", err)
	}

	if err := utils.CheckPassword(req.Password, user.Password); err != nil {
		return models.User{}, "", fmt.Errorf("invalid password: %s", err)
	}

	key := os.Getenv("jwt_secret")
	if key == "" {
		return models.User{}, "", fmt.Errorf("jwt secret is not set")
	}

	token, err := jwttoken.CreateToken(user, key)
	if err != nil {
		return models.User{}, "", err
	}

	return user, token, nil

}
