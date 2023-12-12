package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type User struct {
	conn     *websocket.Conn
	username string
}

var users = make(map[string]*User)

func printUsers() {
    fmt.Println("List of Users:")
    for username, user := range users {
        fmt.Printf("Username: %s, Connection: %v\n", username, user.conn)
    }
}

func Message(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	// Lire les données JSON depuis la première connexion
	_, jsonData, err := conn.ReadMessage()
	if err != nil {
		fmt.Println(err)
		return
	}

	// Struct pour stocker les données initiales, y compris le nom d'utilisateur
	var initialData struct {
		Username string `json:"username"`
		// Ajoutez d'autres champs si nécessaire
	}

	err = json.Unmarshal(jsonData, &initialData)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("username :", initialData.Username)

	username := initialData.Username

	user := &User{
		conn:     conn,
		username: username,
	}

	printUsers()

	fmt.Println("New User : ", &user)
	users[username] = user

	// Informer les autres utilisateurs de la nouvelle connexion
	broadcast(fmt.Sprintf("%s joined the chat", username))

	// Gérer les messages
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			delete(users, username)
			broadcast(fmt.Sprintf("%s left the chat", username))
			return
		}
	

		// Vous devriez recevoir un objet JSON du frontend avec les champs "message", "sender", et "recipient"
		// Voici un exemple basique :
		// {"message": "Hello", "sender": "Alice", "recipient": "Bob"}
		var messageData map[string]string
		err = json.Unmarshal(p, &messageData)
		if err != nil {
			fmt.Println(err)
			return
		}

		recipientUsername := messageData["recipient"]
		recipientUser, ok := users[recipientUsername]
		fmt.Println("recipientUsername : ", recipientUsername)
		fmt.Println("ok : ", ok)

		fmt.Printf("After adding user. Users count: %d\n", len(users))


		if ok {
			recipientUser.conn.WriteMessage(websocket.TextMessage, p)
		} else {
			broadcast(messageData["message"])
		}
	}
}

func broadcast(message string) {
	for _, user := range users {
		err := user.conn.WriteMessage(websocket.TextMessage, []byte(message))
		if err != nil {
			fmt.Println(err)
			return
		}
	}
}
