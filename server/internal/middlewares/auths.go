package middlewares

import (
	"fmt"
	"os"

	"github.com/idir-44/chat-app/internal/jwttoken"
	"github.com/labstack/echo/v4"
)

func AddCurentUser(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cookies, err := c.Cookie("token")
		if err != nil {
			return next(c)
		}

		key := os.Getenv("jwt_secret")
		if key == "" {
			return fmt.Errorf("jwt secret is not set")
		}
		user, err := jwttoken.ParseToken(cookies.Value, key)
		if err != nil {
			return err
		}

		c.Set("user", user)

		return next(c)

	}
}
