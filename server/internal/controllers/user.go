package controllers

import (
	"net/http"

	"github.com/idir-44/chat-app/internal/models"
	"github.com/labstack/echo/v4"
)

func (r controller) createUser(c echo.Context) error {
	req := models.CreatUserRequest{}

	if err := c.Bind(&req); err != nil {
		return err
	}

	user, err := r.service.CreateUser(req)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, user)
}

func (r controller) getCurrentUser(c echo.Context) error {
	user, err := r.getUser(c)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, err)
	}

	res := models.User{
		ID:    user.ID,
		Email: user.Email,
	}

	return c.JSON(http.StatusOK, res)
}
