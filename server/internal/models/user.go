package models

import (
	"time"
)

type User struct {
	ID       string `json:"userID"`
	Email    string `json:"email"`
	Password string `json:"-"`

	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

type CreatUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
