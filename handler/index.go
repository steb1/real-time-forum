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
	"strings"
	"text/template"
	"time"
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
	AllPosts      []models.PostItems
	AllNotifs     []*models.Notification
}

func Index(res http.ResponseWriter, req *http.Request) {
	if lib.ValidateRequest(req, res, "/", http.MethodGet) {
		basePath := "base"
		pagePath := "index"

		isSessionOpen := models.ValidSession(req)
		// isSessionOpen := true
		user := models.GetUserFromSession(req)
		// queryParams := req.URL.Query()
		// limit := 5
		// numberOfPosts := models.PostRepo.GetNumberOfPosts()

		// if len(queryParams["limit"]) != 0 {
		// 	_limit, err := strconv.Atoi(queryParams.Get("limit"))
		// 	if limit <= 0 || err != nil {
		// 		res.WriteHeader(http.StatusBadRequest)
		// 		log.Println("❌ Can't convert index to int")
		// 		return
		// 	} else {
		// 		if _limit == numberOfPosts {
		// 			limit = -1
		// 		} else {
		// 			limit = _limit
		// 		}
		// 	}
		// }
		// randomUsers, err := models.UserRepo.SelectRandomUsers(17)
		// if err != nil {
		// 	res.WriteHeader(http.StatusInternalServerError)
		// 	log.Println("❌ Can't get 17 random users in the database")
		// 	return
		// }

		// posts, _ := models.PostRepo.GetAllPostsItems(limit)

		// TopUsers, err := models.UserRepo.TopUsers()
		// if err != nil {
		// 	res.WriteHeader(http.StatusInternalServerError)
		// 	log.Println("❌ Can't get top users")
		// 	return
		// }

		// if limit != -1 {
		// 	if limit+5 > numberOfPosts {
		// 		limit = numberOfPosts
		// 	} else {
		// 		limit += 5
		// 	}
		// }
		// if posts != nil {
		// 	for j := 0; j < len(posts); j++ {
		// 		posts[j].Title = template.HTMLEscapeString(posts[j].Title)
		// 	}
		// }
		// cat, err := models.CategoryRepo.GetAllCategory()
		// if err != nil {
		// 	return
		// }
		allPost, err := models.PostRepo.GetAllPost()
		if err != nil {
			return
		}
		// notifications, err := models.NotifRepo.GetAllNotifs()
		// if err != nil {
		// 	return
		// }
		homePageData := HomePageData{
			IsLoggedIn:  isSessionOpen,
			CurrentUser: *user,
			//RandomUsers:   randomUsers,
			// Post:          posts,
			// NumberOfPosts: numberOfPosts,
			// TopUsers:      TopUsers,
			// Limit:         limit,
			// Categories:    cat,
			AllPosts: allPost,
			// AllNotifs:     notifications,
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

		isSessionOpen := models.ValidSession(req)
		user := models.GetUserFromSession(req)
		// queryParams := req.URL.Query()
		// limit := 5
		// numberOfPosts := models.PostRepo.GetNumberOfPosts()

		// if len(queryParams["limit"]) != 0 {
		// 	_limit, err := strconv.Atoi(queryParams.Get("limit"))
		// 	if limit <= 0 || err != nil {
		// 		res.WriteHeader(http.StatusBadRequest)
		// 		log.Println("❌ Can't convert index to int")
		// 		return
		// 	} else {
		// 		if _limit == numberOfPosts {
		// 			limit = -1
		// 		} else {
		// 			limit = _limit
		// 		}
		// 	}
		// }

		// posts, _ := models.PostRepo.GetAllPosts("1000")

		// TopUsers, err := models.UserRepo.TopUsers()
		// if err != nil {
		// 	res.WriteHeader(http.StatusInternalServerError)
		// 	log.Println("❌ Can't get top users")
		// 	return
		// }

		// if limit != -1 {
		// 	if limit+5 > numberOfPosts {
		// 		limit = numberOfPosts
		// 	} else {
		// 		limit += 5
		// 	}
		// }
		// if posts != nil {
		// 	for j := 0; j < len(posts); j++ {
		// 		posts[j].Title = template.HTMLEscapeString(posts[j].Title)
		// 	}
		// }
		// cat, err := models.CategoryRepo.GetAllCategory()
		// if err != nil {
		// 	return
		// }
		allPost, err := models.PostRepo.GetAllPost()
		if err != nil {
			return
		}
		// notifications, err := models.NotifRepo.GetAllNotifs()
		// if err != nil {
		// 	return
		// }

		homePageData := HomePageData{
			IsLoggedIn:  isSessionOpen,
			CurrentUser: *user,
			AllPosts:    allPost,
		}
		response := make(map[string]interface{})
		response["CurrentUser"] = homePageData.CurrentUser
		response["AllPosts"] = homePageData.AllPosts
		//fmt.Println(response)
		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(response)

		// log.Println("✅ Account created with success")

		// jsonData, err := json.Marshal(homePageData)
		// if err != nil {
		// 	fmt.Println("Erreur lors de la conversion en JSON:", err)
		// 	return
		// }

		// lib.RenderPage(basePath, pagePath, string(jsonData), res)
		log.Println("✅ Home page get with success")
	}
}

func HandleSettings(res http.ResponseWriter, req *http.Request) {
	if lib.ValidateRequest(req, res, "/settings", http.MethodGet) {
		basePath := "base"
		pagePath := "index"

		isSessionOpen := models.ValidSession(req)
		// isSessionOpen := true
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
		allPost, err := models.PostRepo.GetAllPost()
		if err != nil {
			return
		}
		notifications, err := models.NotifRepo.GetAllNotifs()
		if err != nil {
			return
		}
		homePageData := HomePageData{
			IsLoggedIn:  isSessionOpen,
			CurrentUser: *user,
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
		if ok := models.DeleteSession(req); ok {
			http.Redirect(res, req, "/", http.StatusSeeOther)
			log.Println("✅ Logout done with success")
		} else {
			log.Println("❌ Logout failure")
		}
	} else {
		res.WriteHeader(http.StatusNotFound)
		lib.RenderPage("base", "404", nil, res)
		log.Println("404 ❌ - Page not found ", req.URL)
		return
	}
}
func CheckAuthentication(res http.ResponseWriter, req *http.Request) {
	isSessionOpen := models.ValidSession(req)
	fmt.Println(isSessionOpen)
	if isSessionOpen {
		response := map[string]bool{"authenticated": true}
		writeJSONResponse(res, response)
		return
	}
	response := map[string]bool{"authenticated": false}
	writeJSONResponse(res, response)
	// res.WriteHeader(400)
	// fmt.Fprintf(res, "ok")
}
func writeJSONResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Encode and write the JSON response
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
		return
	}
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

		fmt.Println(user.ID)
		fmt.Println(userData.Nickname)
		models.NewSessionToken(res, user.ID, userData.Nickname)

		res.WriteHeader(200)
		// Send a JSON response (replace this with your actual response)
		response := map[string]bool{"register": true}
		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(response)

		log.Println("✅ Account created with success")
	} else {
		res.WriteHeader(200)
		// Send a JSON response (replace this with your actual response)
		response := map[string]bool{"register": false}
		res.Header().Set("Content-Type", "application/json")
		json.NewEncoder(res).Encode(response)
	}

}
func Login(res http.ResponseWriter, req *http.Request) {
	if lib.ValidateRequest(req, res, "/login", http.MethodPost) {
		type UserData1 struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}

		// Parse JSON data from the request body
		var userData1 UserData1
		responseData, err := io.ReadAll(req.Body)
		json.Unmarshal(responseData, &userData1)
		if err != nil {
			fmt.Println("ici")
			http.Error(res, "Invalid request payload", http.StatusBadRequest)
			return
		}
		fmt.Printf("Received user data: %+v\n", userData1)

		user := models.User{}

		if _user, exist := models.UserRepo.IsExistedSignIn(userData1.Username); exist {
			fmt.Println("Match :", lib.IsPasswordsMatch(_user.Password, userData1.Password))
			if userData1.Password != _user.Password {
				// res.WriteHeader(http.StatusNotFound)

				// models.NewSessionToken(res, user.ID, user.Email)
				response := map[string]bool{"login": false}
				writeJSONResponse(res, response)
				log.Println("❌ User with the given email don't exist")
				return
			} else {
				_user, err := models.UserRepo.GetUserByEmail(_user.Email)
				if err != nil {
					log.Println("❌", err)
				}
				user = *_user

				models.NewSessionToken(res, user.ID, user.Email)
				response := map[string]bool{"login": true}
				fmt.Println(response)
				writeJSONResponse(res, response)

				log.Println("✅ Sign in with success")
			}
		} else {
			response := map[string]bool{"login": false}
			// fmt.Println(response)
			writeJSONResponse(res, response)
		}
		// else {
		// 	res.WriteHeader(http.StatusNotFound)
		// 	randomUsers, err := models.UserRepo.SelectRandomUsers(15)
		// 	if err != nil {
		// 		log.Println("❌ Can't get 15 random users in the database")
		// 	}
		// 	signPageData := SignPageData{
		// 		IsLoggedIn:  false,
		// 		RandomUsers: randomUsers,
		// 		Err:         "Email or password Invalid",
		// 	}
		// 	lib.RenderPage("base", "sign-in", signPageData, res)
		// 	log.Println("❌ User with the given email don't exist")
		// 	return
		// }
	}
}

func CreatePost(res http.ResponseWriter, req *http.Request) {
	if lib.ValidateRequest(req, res, "/post", http.MethodPost) {
		isSessionOpen := models.ValidSession(req)
		if isSessionOpen {
			// Parse form data
			err := req.ParseMultipartForm(32 << 20) // 32 MB limit
			if err != nil {
				log.Println("❌ Failed to parse form data", err.Error())
				return
			}
			creationDate := time.Now().Format("2006-01-02 15:04:05")
			modificationDate := time.Now().Format("2006-01-02 15:04:05")
			title := req.FormValue("title")
			posts, err := models.PostRepo.GetAllPosts("")
			if err != nil {
				return
			}
			if posts != nil {
				for j := 0; j < len(posts); j++ {
					if strings.EqualFold(posts[j].Title, title) {
						lib.RedirectToPreviousURL(res, req)
						return
					}
				}
			}
			slug := lib.Slugify(title)
			description := req.FormValue("content")
			_categories := req.FormValue("categories")
			cates := strings.TrimSpace(_categories)
			if len(cates) == 0 {
				_categories = "No Cactegory"
			}

			imageUrl := lib.UploadImage(req)
			authorID := models.GetUserFromSession(req).ID
			categories := strings.Split(_categories, "#")
			init := 1
			if len(categories) == 1 {
				init = 0
				mot := ""
				lll := strings.Fields(categories[0])
				for _, word := range lll {
					mot = mot + word
				}
				categories[0] = mot
			}

			post := models.Post{
				Title:        title,
				Slug:         slug,
				Description:  description,
				ImageURL:     imageUrl,
				AuthorID:     authorID,
				IsEdited:     false,
				CreateDate:   creationDate,
				ModifiedDate: modificationDate,
				Validate:     true,
			}

			err = models.PostRepo.CreatePost(&post)
			if err != nil {
				res.WriteHeader(http.StatusInternalServerError)
				log.Println("❌ Can't create post")
				return
			}

			for i := init; i < len(categories); i++ {
				name := strings.TrimSpace(categories[i])
				if len(name) == 0 {
					name = "NoCactegory"
				}
				category, _ := models.CategoryRepo.GetCategoryByName(name)
				if category == nil {
					category = &models.Category{
						Name:         name,
						CreateDate:   creationDate,
						ModifiedDate: modificationDate,
					}
					models.CategoryRepo.CreateCategory(category)
				}
				models.PostCategoryRepo.CreatePostCategory(category.ID, post.ID)
			}

			log.Println("✅ Post created with success")
			//http.Redirect(res, req, "/", http.StatusSeeOther)
			//http.Redirect(res, req, "/", http.StatusPermanentRedirect)
			lib.RedirectToPreviousURL(res, req)
		}
	}
}

func GetAllPosts(res http.ResponseWriter, req *http.Request) {
	if lib.ValidateRequest(req, res, "/post", http.MethodPost) {
		basePath := "base"
		pagePath := "index"
		user := models.GetUserFromSession(req)
		isSessionOpen := models.ValidSession(req)
		if isSessionOpen {
			allPost, err := models.PostRepo.GetAllPost()
			if err != nil {
				log.Println("No Posts")
			}

			homePageData := HomePageData{
				IsLoggedIn:  isSessionOpen,
				CurrentUser: *user,
				//RandomUsers:   randomUsers,
				// Post:          posts,
				// NumberOfPosts: numberOfPosts,
				// TopUsers:      TopUsers,
				// Limit:         limit,
				// Categories:    cat,
				AllPosts: allPost,
				// AllNotifs:     notifications,
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
}
