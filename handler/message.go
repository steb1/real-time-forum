package handler

import (
	"encoding/json"
	"fmt"
	"forum/data/models"
	"net/http"
	"sort"
	"time"

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

type userStatus struct {
	Nom         string   `json:"nom"`
	OnlineUsers []string `json:"onlineUsers"`
}

func updateStatus(users map[string]*User, username string) []string {
	var OnlineUsersByProfile []string
	i := 0
	for v := range users {
		i++
		var user userStatus
		user.Nom = v
		user.OnlineUsers = cleanTab(GetOnlineUsers(username), v)

		jsonData, err := json.Marshal(user)
		if err != nil {
			fmt.Println(err)
			return nil
		}

		OnlineUsersByProfile = append(OnlineUsersByProfile, string(jsonData)+",")
	}
	return OnlineUsersByProfile
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
	username := initialData.Username

	user := &User{
		conn:     conn,
		username: username,
	}

	users[username] = user

	// Informer les autres utilisateurs de la nouvelle connexion
	// broadcast(fmt.Sprintf("%s joined the chat", username))

	var OnlineUsersByProfile []string
	i := 0
	for v := range users {
		i++
		var user userStatus
		user.Nom = v
		user.OnlineUsers = cleanTab(GetOnlineUsers(username), v)

		jsonData, err := json.Marshal(user)
		if err != nil {
			fmt.Println(err)
			return
		}
		OnlineUsersByProfile = append(OnlineUsersByProfile, string(jsonData)+",")
	}

	fmt.Println("online users : ", OnlineUsersByProfile)
	broadcast(fmt.Sprintf("updateUsers|%v", OnlineUsersByProfile))

	// broadcast <- fmt.Sprintf("updateUsers|%v", onlineUsers)

	// Gérer les messages
	for {
		fmt.Println("ON MESSAGE")
		_, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			delete(users, username)
			var OnlineUsersByProfile []string
			i := 0
			for v := range users {
				i++
				var user userStatus
				user.Nom = v
				user.OnlineUsers = cleanTab(GetOnlineUsers(username), v)

				jsonData, err := json.Marshal(user)
				if err != nil {
					fmt.Println(err)
					return
				}
				OnlineUsersByProfile = append(OnlineUsersByProfile, string(jsonData)+",")
			}
			broadcast(fmt.Sprintf("updateUsers|%v", OnlineUsersByProfile))
			// broadcast(fmt.Sprintf("%s left the chat", username))
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
		user1Name := messageData["sender"]
		recipientUser, ok := users[recipientUsername]
		user1, _ := users[user1Name]
		fmt.Println("recipientUsername : ", recipientUsername)

		fmt.Printf("After adding user. Users count: %d\n", len(users))

		var messageStruct models.Message

		messageStruct.Author = username
		messageStruct.Message = messageData["message"]
		messageStruct.Receiver = recipientUsername
		messageStruct.Time = time.Now().Format("2006-01-02 15:04:05")

		_, err = models.MessageRepo.CreateMessage(messageStruct)

		if err != nil {
			fmt.Println(err)
		}

		fmt.Println("updateStatus : ", updateStatus(users, user1Name))

		OnlineUsersByProfile = updateStatus(users, user1Name)
		broadcast(fmt.Sprintf("updateUsers|%v", OnlineUsersByProfile))

		if ok {
			// broadcast2Users(messageData["message"], recipientUser, user)
			recipientUser.conn.WriteMessage(websocket.TextMessage, p)
			user1.conn.WriteMessage(websocket.TextMessage, p)
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

func broadcast2Users(message string, user1 *User, user2 *User) {
	for _, user := range users {
		if user.username == user1.username || user.username == user2.username {
			err := user.conn.WriteMessage(websocket.TextMessage, []byte(message))
			if err != nil {
				fmt.Println(err)
				return
			}
		}

	}
}


func GetOnlineUsers(username string) []string {
	fmt.Println("user for info : " , username)
	Messages, err := models.MessageRepo.GetMessagesByUser(username)
	if err != nil {
		fmt.Println("error getting messsage")
		return nil
	}
	var onlineUsers []string
	for username := range users {
		onlineUsers = append(onlineUsers, username)
	}
	var OnlineUsersByProfile []string
		for i := len(Messages) - 1 ; i >= 0; i-- {
			if isPresent(onlineUsers, Messages[i].Receiver) && Messages[i].Author == username  {
				if !isPresent(OnlineUsersByProfile, Messages[i].Receiver) {
					//OnlineUsersByProfile = append([]string{Messages[i].Receiver}, OnlineUsersByProfile...)
					OnlineUsersByProfile = append(OnlineUsersByProfile, Messages[i].Receiver)
					fmt.Println("OnlineUsersByProfileeeeeee : ", OnlineUsersByProfile)
				}
		}
	}
	
	fmt.Println("etape 1 : ", OnlineUsersByProfile)
	
	for _, v := range onlineUsers {
		if !isPresent(OnlineUsersByProfile, v) {
			OnlineUsersByProfile = append(OnlineUsersByProfile, v)
		}
	}

	fmt.Println("etape 2 : ", OnlineUsersByProfile)
	
	if len(Messages) == 0 {
		sort.Strings(OnlineUsersByProfile)
	}
	return OnlineUsersByProfile
}

func cleanTab(tab []string, toClean string) []string {
	var toReturn []string

	fmt.Println("CleanTO", toClean)
	fmt.Println("Clean tab", tab)

	for _, v := range tab {
		if v != toClean {
			toReturn = append(toReturn, v)
		}
		
	}

	fmt.Println("toReturn : ", toReturn)
	return toReturn
}

func isPresent(tab []string, toFind string) bool {
	for _, v := range tab {
		if v == toFind {
			return true
		}
	}

	return false
}
