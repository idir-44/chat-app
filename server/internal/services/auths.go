package services

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/idir-44/chat-app/internal/models"
	"github.com/idir-44/chat-app/pkg/utils"
)

func (s services) Login(req models.LoginRequest) (string, error) {
	user, err := s.repository.GetUserByEmail(req.Email)
	if err != nil {
		return "", fmt.Errorf("bad credentials %s", err)
	}

	if err := utils.CheckPassword(req.Password, user.Password); err != nil {
		return "", fmt.Errorf("invalid password")
	}

	key := os.Getenv("jwt_secret")
	if key == "" {
		return "", fmt.Errorf("jwt secret is not set")
	}

	token, err := createToken(user, key)
	if err != nil {
		return "", err
	}

	return token, nil

}

type jwtClaims struct {
	models.User
	jwt.StandardClaims
}

func createToken(user models.User, key string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtClaims{
		User: user,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
			IssuedAt:  time.Now().Unix(),
			Id:        uuid.New().String(),
		},
	})

	return token.SignedString([]byte(key))
}
