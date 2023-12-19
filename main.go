package main

import (
	"forum/data/models"
	"forum/handler"
	"forum/handler/auth"
	"forum/lib"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	PORT := ":" + os.Getenv("PORT")
	ADDRESS := os.Getenv("ADDRESS")

	rateLimiter := lib.NewRateLimiter(time.Minute)

	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("./newtemplates/css/"))))
	// http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("./assets/img/"))))
	// http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads/"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./newtemplates/js/"))))
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	http.Handle("/sign-up", rateLimiter.Wrap("auth", auth.SignUp))
	http.Handle("/sign-up-page", rateLimiter.Wrap("auth", auth.SignUpPage))
	//http.Handle("/sign-in", rateLimiter.Wrap("auth", auth.SignIn))
	http.Handle("/sign-in-page", rateLimiter.Wrap("auth", auth.SignInPage))
	http.Handle("/logout", rateLimiter.Wrap("auth", auth.Logout))

	// API endpoint rate limiting
	http.Handle("/", rateLimiter.Wrap("api", handler.Index))
	http.Handle("/dashboard", rateLimiter.Wrap("api", handler.HandleDashboard))
	http.Handle("/settings", rateLimiter.Wrap("api", handler.HandleSettings))
	http.Handle("/accueil", rateLimiter.Wrap("api", handler.HandleSettings))
	http.Handle("/disconnect", rateLimiter.Wrap("api", handler.HandleDisconnect))
	http.Handle("/CheckAuthentication", rateLimiter.Wrap("api", handler.CheckAuthentication))
	http.Handle("/register", rateLimiter.Wrap("api", handler.Registration))
	http.Handle("/login", rateLimiter.Wrap("api", handler.Login))
	http.Handle("/post", rateLimiter.Wrap("api", handler.CreatePost))
	http.Handle("/getAllPosts", rateLimiter.Wrap("api", handler.GetAllPosts))
	http.Handle("/post/", rateLimiter.Wrap("api", handler.GetPostDetail))
	http.Handle("/comment/", rateLimiter.Wrap("api", handler.Comment))
	http.Handle("/like/", rateLimiter.Wrap("api", handler.LikePost))
	http.Handle("/dislike/", rateLimiter.Wrap("api", handler.DislikePost))
	http.Handle("/discussion/", rateLimiter.Wrap("api", handler.Discussion))
	http.Handle("/getAllMessages", rateLimiter.Wrap("api", handler.GetMessages))
	///
	http.HandleFunc("/ws", handler.Message)

	/* httpsServer := http.Server{
		Addr: PORT,
		TLSConfig: &tls.Config{
			MinVersion:               tls.VersionTLS12, // Minimum TLS version supported
			PreferServerCipherSuites: true,             // Prefer the server's cipher suite order
			CipherSuites: []uint16{
				tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
				tls.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
				// Add more cipher suites as needed
			},
		},
	} */

	go models.DeleteExpiredSessions()

	log.Print("Server started and running on ")
	log.Println(ADDRESS + PORT)
	if err := http.ListenAndServe(PORT, nil); err != nil {
		log.Fatal(err)
	}
}
