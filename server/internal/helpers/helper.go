package helpers

import (
	"fmt"

	"github.com/idir-44/chat-app/internal/models"
	"github.com/labstack/echo/v4"
)

func GetUser(c echo.Context) (models.User, error) {
	user := c.Get("user")

	if user == nil {
		return models.User{}, fmt.Errorf("current user not found")
	}

	return user.(models.User), nil
}
