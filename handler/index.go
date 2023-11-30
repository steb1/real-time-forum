package handler

import (
	"encoding/json"
	"fmt"
	"forum/data/models"
	"forum/lib"
	"io"
	"log"
	"net/http"
	"strconv"
	"text/template"
)

type HomePageData struct {
	IsLoggedIn    bool
	RandomUsers   []models.User
	CurrentUser   models.User
	Post          []models.PostItem
	NumberOfPosts int
	Limit         int
	TopUsers      []models.TopUser
	Categories    []*models.Category
	AllPosts      []*models.Post
	AllNotifs     []*models.Notification
}

func Index(res http.ResponseWriter, req *http.Request) {
	if lib.ValidateRequest(req, res, "/", http.MethodGet) {
		basePath := "base"
		pagePath := "index"

		// isSessionOpen := models.ValidSession(req)
		isSessionOpen := false
		user := models.GetUserFromSession(req)
		queryParams := req.URL.Query()
		limit := 5
		numberOfPosts := models.PostRepo.GetNumberOfPosts()

		if len(queryParams["limit"]) != 0 {
			_limit, err := strconv.Atoi(queryParams.Get("limit"))
			if limit <= 0 || err != nil {
				res.WriteHeader(http.StatusBadRequest)
				log.Println("❌ Can't convert index to int")
				return
			} else {
				if _limit == numberOfPosts {
					limit = -1
				} else {
					limit = _limit
				}
			}
		}
		// randomUsers, err := models.UserRepo.SelectRandomUsers(17)
		// if err != nil {
		// 	res.WriteHeader(http.StatusInternalServerError)
		// 	log.Println("❌ Can't get 17 random users in the database")
		// 	return
		// }

		posts, _ := models.PostRepo.GetAllPostsItems(limit)

		TopUsers, err := models.UserRepo.TopUsers()
		if err != nil {
			res.WriteHeader(http.StatusInternalServerError)
			log.Println("❌ Can't get top users")
			return
		}

		if limit != -1 {
			if limit+5 > numberOfPosts {
				limit = numberOfPosts
			} else {
				limit += 5
			}
		}
		if posts != nil {
			for j := 0; j < len(posts); j++ {
				posts[j].Title = template.HTMLEscapeString(posts[j].Title)
			}
		}
		cat, err := models.CategoryRepo.GetAllCategory()
		if err != nil {
			return
		}
		allPost, err := models.PostRepo.GetAllPosts("")
		if err != nil {
			return
		}
		notifications, err := models.NotifRepo.GetAllNotifs()
		if err != nil {
			return
		}
		homePageData := HomePageData{
			IsLoggedIn:    isSessionOpen,
			CurrentUser:   *user,
			//RandomUsers:   randomUsers,
			Post:          posts,
			NumberOfPosts: numberOfPosts,
			TopUsers:      TopUsers,
			Limit:         limit,
			Categories:    cat,
			AllPosts:      allPost,
			AllNotifs:     notifications,
		}

		jsonData, err := json.Marshal(homePageData)
		if err != nil {
			fmt.Println("Erreur lors de la conversion en JSON:", err)
			return
		}

		lib.RenderPage(basePath, pagePath, string(jsonData), res)
		log.Println("✅ Home page get with success")
	}
}
func HandleDashboard(res http.ResponseWriter, req *http.Request) {
	if lib.ValidateRequest(req, res, "/dashboard", http.MethodGet) {
		basePath := "base"
		pagePath := "index"

		// isSessionOpen := models.ValidSession(req)
		isSessionOpen := false
		user := models.GetUserFromSession(req)
		queryParams := req.URL.Query()
		limit := 5
		numberOfPosts := models.PostRepo.GetNumberOfPosts()

		if len(queryParams["limit"]) != 0 {
			_limit, err := strconv.Atoi(queryParams.Get("limit"))
			if limit <= 0 || err != nil {
				res.WriteHeader(http.StatusBadRequest)
				log.Println("❌ Can't convert index to int")
				return
			} else {
				if _limit == numberOfPosts {
					limit = -1
				} else {
					limit = _limit
				}
			}
		}
		// randomUsers, err := models.UserRepo.SelectRandomUsers(17)
		// if err != nil {
		// 	res.WriteHeader(http.StatusInternalServerError)
		// 	log.Println("❌ Can't get 17 random users in the database")
		// 	return
		// }

		posts, _ := models.PostRepo.GetAllPostsItems(limit)

		TopUsers, err := models.UserRepo.TopUsers()
		if err != nil {
			res.WriteHeader(http.StatusInternalServerError)
			log.Println("❌ Can't get top users")
			return
		}

		if limit != -1 {
			if limit+5 > numberOfPosts {
				limit = numberOfPosts
			} else {
				limit += 5
			}
		}
		if posts != nil {
			for j := 0; j < len(posts); j++ {
				posts[j].Title = template.HTMLEscapeString(posts[j].Title)
			}
		}
		cat, err := models.CategoryRepo.GetAllCategory()
		if err != nil {
			return
		}
		allPost, err := models.PostRepo.GetAllPosts("")
		if err != nil {
			return
		}
		notifications, err := models.NotifRepo.GetAllNotifs()
		if err != nil {
			return
		}
		homePageData := HomePageData{
			IsLoggedIn:    isSessionOpen,
			CurrentUser:   *user,
			//RandomUsers:   randomUsers,
			Post:          posts,
			NumberOfPosts: numberOfPosts,
			TopUsers:      TopUsers,
			Limit:         limit,
			Categories:    cat,
			AllPosts:      allPost,
			AllNotifs:     notifications,
		}

		jsonData, err := json.Marshal(homePageData)
		if err != nil {
			fmt.Println("Erreur lors de la conversion en JSON:", err)
			return
		}

		lib.RenderPage(basePath, pagePath, string(jsonData), res)
		log.Println("✅ Home page get with success")
	}
}

func HandleSettings(res http.ResponseWriter, req *http.Request) {
	if lib.ValidateRequest(req, res, "/settings", http.MethodGet) {
		basePath := "base"
		pagePath := "index"

		// isSessionOpen := models.ValidSession(req)
		isSessionOpen := false
		user := models.GetUserFromSession(req)
		queryParams := req.URL.Query()
		limit := 5
		numberOfPosts := models.PostRepo.GetNumberOfPosts()

		if len(queryParams["limit"]) != 0 {
			_limit, err := strconv.Atoi(queryParams.Get("limit"))
			if limit <= 0 || err != nil {
				res.WriteHeader(http.StatusBadRequest)
				log.Println("❌ Can't convert index to int")
				return
			} else {
				if _limit == numberOfPosts {
					limit = -1
				} else {
					limit = _limit
				}
			}
		}
		// randomUsers, err := models.UserRepo.SelectRandomUsers(17)
		// if err != nil {
		// 	res.WriteHeader(http.StatusInternalServerError)
		// 	log.Println("❌ Can't get 17 random users in the database")
		// 	return
		// }

		posts, _ := models.PostRepo.GetAllPostsItems(limit)

		TopUsers, err := models.UserRepo.TopUsers()
		if err != nil {
			res.WriteHeader(http.StatusInternalServerError)
			log.Println("❌ Can't get top users")
			return
		}

		if limit != -1 {
			if limit+5 > numberOfPosts {
				limit = numberOfPosts
			} else {
				limit += 5
			}
		}
		if posts != nil {
			for j := 0; j < len(posts); j++ {
				posts[j].Title = template.HTMLEscapeString(posts[j].Title)
			}
		}
		cat, err := models.CategoryRepo.GetAllCategory()
		if err != nil {
			return
		}
		allPost, err := models.PostRepo.GetAllPosts("")
		if err != nil {
			return
		}
		notifications, err := models.NotifRepo.GetAllNotifs()
		if err != nil {
			return
		}
		homePageData := HomePageData{
			IsLoggedIn:    isSessionOpen,
			CurrentUser:   *user,
			//RandomUsers:   randomUsers,
			Post:          posts,
			NumberOfPosts: numberOfPosts,
			TopUsers:      TopUsers,
			Limit:         limit,
			Categories:    cat,
			AllPosts:      allPost,
			AllNotifs:     notifications,
		}

		jsonData, err := json.Marshal(homePageData)
		if err != nil {
			fmt.Println("Erreur lors de la conversion en JSON:", err)
			return
		}

		lib.RenderPage(basePath, pagePath, string(jsonData), res)
		log.Println("✅ Home page get with success")
	}
}

func HandleDisconnect(res http.ResponseWriter, req *http.Request) {
	if lib.ValidateRequest(req, res, "/disconnect", http.MethodGet) {
		basePath := "base"
		pagePath := "index"

		// isSessionOpen := models.ValidSession(req)
		isSessionOpen := false
		user := models.GetUserFromSession(req)
		queryParams := req.URL.Query()
		limit := 5
		numberOfPosts := models.PostRepo.GetNumberOfPosts()

		if len(queryParams["limit"]) != 0 {
			_limit, err := strconv.Atoi(queryParams.Get("limit"))
			if limit <= 0 || err != nil {
				res.WriteHeader(http.StatusBadRequest)
				log.Println("❌ Can't convert index to int")
				return
			} else {
				if _limit == numberOfPosts {
					limit = -1
				} else {
					limit = _limit
				}
			}
		}
		// randomUsers, err := models.UserRepo.SelectRandomUsers(17)
		// if err != nil {
		// 	res.WriteHeader(http.StatusInternalServerError)
		// 	log.Println("❌ Can't get 17 random users in the database")
		// 	return
		// }

		posts, _ := models.PostRepo.GetAllPostsItems(limit)

		TopUsers, err := models.UserRepo.TopUsers()
		if err != nil {
			res.WriteHeader(http.StatusInternalServerError)
			log.Println("❌ Can't get top users")
			return
		}

		if limit != -1 {
			if limit+5 > numberOfPosts {
				limit = numberOfPosts
			} else {
				limit += 5
			}
		}
		if posts != nil {
			for j := 0; j < len(posts); j++ {
				posts[j].Title = template.HTMLEscapeString(posts[j].Title)
			}
		}
		cat, err := models.CategoryRepo.GetAllCategory()
		if err != nil {
			return
		}
		allPost, err := models.PostRepo.GetAllPosts("")
		if err != nil {
			return
		}
		notifications, err := models.NotifRepo.GetAllNotifs()
		if err != nil {
			return
		}
		homePageData := HomePageData{
			IsLoggedIn:    isSessionOpen,
			CurrentUser:   *user,
			//RandomUsers:   randomUsers,
			Post:          posts,
			NumberOfPosts: numberOfPosts,
			TopUsers:      TopUsers,
			Limit:         limit,
			Categories:    cat,
			AllPosts:      allPost,
			AllNotifs:     notifications,
		}

		jsonData, err := json.Marshal(homePageData)
		if err != nil {
			fmt.Println("Erreur lors de la conversion en JSON:", err)
			return
		}

		lib.RenderPage(basePath, pagePath, string(jsonData), res)
		log.Println("✅ Home page get with success")
	}
}
func CheckAuthentication(res http.ResponseWriter, req *http.Request) {
	isSessionOpen := models.ValidSession(req)

	fmt.Println(isSessionOpen)
	res.WriteHeader(400)
	fmt.Fprintf(res, "ok")
}
func Registration(res http.ResponseWriter, req *http.Request) {
	type UserData struct {
		Nickname  string `json:"nickname"`
		Age       int    `json:"age"`
		Gender    string `json:"gender"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}

	// Parse JSON data from the request body
	var userData UserData
	responseData, err := io.ReadAll(req.Body)
	json.Unmarshal(responseData, &userData)
	if err != nil {
		fmt.Println("ici")
		http.Error(res, "Invalid request payload", http.StatusBadRequest)
		return
	}
	fmt.Printf("Received user data: %+v\n", userData)

	user := models.User{}

	//ID, err := uuid.NewV4()
	if err != nil {
		fmt.Println("Failed to generate uuid")
		return
	}
	//user.ID = ID.String()
	user.Nickname = userData.Nickname
	user.Password = userData.Password
	user.FirstName = userData.FirstName
	user.Gender = userData.Gender
	user.LastName = userData.LastName
	user.Age = strconv.Itoa((userData.Age))
	user.Email = userData.Email

	if _, exist := models.UserRepo.IsExisted(userData.Email, userData.Nickname); !exist {
		err := models.UserRepo.CreateUser(&user)
		if err != nil {
			log.Fatalf("❌ Failed to created account %v", err)
		}

		models.NewSessionToken(res, user.ID, userData.Nickname)

		log.Println("✅ Account created with success")
	}
	http.SetCookie(res, &http.Cookie{
		Name:  "user",
		Value: "JohnDoe",
		Path:  "/",
	})

	// Process the user data (you can save it to a database, perform validation, etc.)
	res.WriteHeader(200)
	// Send a JSON response (replace this with your actual response)
	response := map[string]string{"message": "Registration successful"}
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(response)
}
