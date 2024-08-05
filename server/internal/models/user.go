package models

import (
	"time"
)

type User struct {
	Id       string `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`

	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

type CreatUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
