package controllers

import (
	"net/http"
	"time"

	"github.com/idir-44/chat-app/internal/models"
	"github.com/labstack/echo/v4"
)

func (r controller) login(c echo.Context) error {
	var req models.LoginRequest

	if err := c.Bind(&req); err != nil {
		return err
	}

	user, token, err := r.service.Login(req)
	if err != nil {
		return err
	}

	cookie := new(http.Cookie)
	cookie.Name = "token"
	cookie.Value = token
	cookie.Expires = time.Now().Add(24 * time.Hour)
	cookie.HttpOnly = true
	c.SetCookie(cookie)

	res := models.User{
		ID:    user.ID,
		Email: user.Email,
	}

	return c.JSON(http.StatusOK, res)
}
