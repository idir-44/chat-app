package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID       primitive.ObjectID `bson:"_id"`
	Email    *string            `json:"email"`
	Password *string            `json:"password"`
}

type LoginByEmailRequest struct {
	Email    *string `json:"email"`
	Password *string `json:"password"`
}

type LoginResponse struct {
	ID    primitive.ObjectID `bson:"_id"`
	Email *string            `json:"email"`
}
