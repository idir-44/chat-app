package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt"
	"github.com/idir-44/chat-app/db"
	"github.com/idir-44/chat-app/models"
	"github.com/idir-44/chat-app/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var validate = validator.New()
var userCollection *mongo.Collection = db.OpenCollection(db.Client, "users")

type MyJWTClaims struct {
	ID    primitive.ObjectID `bson:"_id"`
	Email *string            `json:"email"`
	jwt.StandardClaims
}

const secretKey = "secret" // this should be in an .env file but la flemme

func CreateUser(c *gin.Context) {

	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"create user error": err.Error()})
		return
	}

	validationErr := validate.Struct(user)

	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"create user error": validationErr.Error()})
		return
	}

	user.ID = primitive.NewObjectID()
	hashedPassword, err := utils.HashPassword(*user.Password)
	user.Password = &hashedPassword

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"failed to hash password": err.Error()})
		return
	}
	result, err := userCollection.InsertOne(context.TODO(), user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"db create user error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

func Login(c *gin.Context) {
	var loginRequest models.LoginByEmailRequest
	var user models.User

	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error login": err.Error()})
		return
	}

	filter := bson.M{"email": loginRequest.Email}

	err := userCollection.FindOne(context.TODO(), filter).Decode(&user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error login": err.Error()})
		return
	}

	err = utils.CheckPassword(*loginRequest.Password, *user.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error login": err.Error()})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, MyJWTClaims{
		ID:    user.ID,
		Email: user.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(1 * time.Hour).Unix(),
		},
	})

	accessToken, err := token.SignedString([]byte(secretKey))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error login": err.Error()})
		return
	}

	c.SetCookie("jwt", accessToken, 3600, "/", "localhost", false, true)

	c.JSON(http.StatusOK, models.LoginResponse{
		ID:    user.ID,
		Email: user.Email,
	})

}

func Logout(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Logged out !"})

}
