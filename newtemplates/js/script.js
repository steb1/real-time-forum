function checkAuthentication() {
  fetch('/CheckAuthentication')
    .then(response => response.json())
    .then(data => {
      if (data.authenticated) {
        console.log('User is authenticated');
        displayAccueil();
        connectWebSocket()
        return true

      } else {
        console.log('User is not authenticated');
        generateAuthPage();
        return false

      }
    })
    .catch(error => {
      console.error('Error checking authentication:', error);
      return false
    });
}

async function IsAuthenticated() {
  try {
    const response = await fetch('/CheckAuthentication');
    const data = await response.json();

    if (data.authenticated) {
      console.log("trueeeee");
      return true;
    } else {
      console.log("falseeeeee");
      return false;
    }
  } catch (error) {
    console.error('Error during authentication check:', error);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  closeModal()
})
//var bigData = {};
function getData() {
  fetch('/dashboard')
    .then(response => response.json())
    .then(data => {
      return data
    })
    .catch(error => {
      console.error('Error checking authentication:', error);
      return
    });
}

document.addEventListener('DOMContentLoaded', function (e) {
  console.log("href : ", window.location.href)
  e.preventDefault()

  if (!AllRoutes.includes(window.location.href.split("/")[3])) {
    document.body.innerHTML = `<!DOCTYPE html>
    <html lang="en">
    
    
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Bootstrap 5 404 Error Page</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
    
    
        <body>
            <div class="d-flex align-items-center justify-content-center vh-100">
                <div class="text-center">
                    <h1 class="display-1 fw-bold">404</h1>
                    <p class="fs-3"> <span class="text-danger">Opps!</span> Page not found.</p>
                    <p class="lead">
                        The page you’re looking for doesn’t exist.
                      </p>
                    <a href="http://localhost:8080/" class="btn btn-primary">Go Home</a>
                </div>
            </div>
        </body>
    
    
    </html>`
      ;
    return
  }

  checkAuthentication();
})


console.log("session = ", all.IsLoggedIn);
let rightBarContent = ["photo", "Home", "disconnect"]
let container = document.getElementById("container-flex")
const preventReloadLinks = container.querySelectorAll('.leftnav-link');
const AllRoutes = ["", "photo", "/", "disconnect"]


function generateAuthPage() {
  const authPage = document.createElement('div');
  var body = document.body;
  body.style.backgroundColor = "#080710"
  authPage.innerHTML = `
        <div class="background">
    <div class="shape"></div>
    <div class="shape"></div>
    </div>
    <form class="formLogin" id="form" method="POST" action="/sign-in">

        <h3>Login Here</h3>
        <p id="loginError" style="display: none; color: red;" >BAD credentials</p>
        <label for="username">Username</label>
        <input type="text" placeholder="Email or Nickname" id="username">

        <label for="password">Password</label>
        <input type="password" placeholder="Password" id="password">

        <button class="registerForm" onClick="login()" >Log In</button>
        <button class="registerForm" onClick="registerForm()">Sign up</button>
        </div>
    </form>
    `;

  container.innerHTML = '';
  container.appendChild(authPage);
  document.getElementById("form").addEventListener("click", (e) => {
    e.preventDefault();
    window.history.pushState({}, '', e.target.href)
  })
}

const registerForm = (message) => {
  IsAuthenticated().then(isAuthenticated => {
    if (!isAuthenticated) {
        const authPage = document.createElement('div');
        var body = document.body;
        body.style.backgroundColor = "#080710"
        authPage.innerHTML = `
        <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
        </div>
        <form id="form" class="formLogin" method="POST" action="/sign-in">
        <h3>Register Here</h3>
        <p id="loginError" color: red;">${message
          ? message
          : ''}</p>
        <label for="nickname">Nickname:</label>
        <input type="text" id="nickname" name="nickname" required>
    
        <label for="age">Age:</label>
        <input type="number" id="age" name="age" required>
    
        <label for="gender">Gender:</label>
        <select id="gender" name="gender" required>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        </select>
    
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName" required>
    
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" required>
    
        <label for="email">E-mail:</label>
        <input type="email" id="email" name="email" required>
    
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
    
        <button class="registerForm" type="button" onclick="registerUser()">Register</button>
        <button class="registerForm" type="button" onclick="generateAuthPage()">Return</button>
    </form>
    `;

  container.innerHTML = '';
  container.appendChild(authPage);
  let form = document.getElementById("form")
  form.style.height = "fit-content"
  form.style.marginTop = '200px'

  document.getElementById("form").addEventListener("click", (e) => {
    e.preventDefault();
    window.history.pushState({}, '', e.target.href)
  })
}
})
}

function registerUser() {
  // Get user input
  var nickname = document.getElementById('nickname').value;
  var age = document.getElementById('age').value;
  var gender = document.getElementById('gender').value;
  var firstName = document.getElementById('firstName').value;
  var lastName = document.getElementById('lastName').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // Validate the input (you can add more validation as needed)

  // Create an object with user data
  var userData = {
    nickname: nickname,
    age: age,
    gender: gender,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  };

  console.log(userData);

  // Send the user data to the server (you need to implement this part)
  // For example, using the fetch API
  fetch('http://localhost:8080/register', {
    method: 'POST',
    credentials: 'include',  // Include cookies in the request
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    })
    .then(data => {
      // Registration successful, handle the response data
      console.log('Registration successful:', data.register);
      if (data.register == true) {
        displayAccueil()
        connectWebSocket()
      } else {
        registerForm("Bad Credentials")
      }

    })
    .catch(error => {
      console.error('Registration error:', error);
    });
}

function login() {
  let username = document.getElementById("username").value
  let password = document.getElementById("password").value

  // var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
  console.log("username : ", username);
  console.log("username : ", password);

  // var isValid = passwordRegex.test(password.value);

  var userData1 = {
    username: username,
    password: password
  }
  console.log(userData1);

  // if (isValid) {
  fetch('http://localhost:8080/login', {
    method: 'POST',
    credentials: 'include',  // Include cookies in the request
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData1),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(data => {
      // Registration successful, handle the response data
      console.log('Login successful:', data);
      if (data.login == true) {
        displayAccueil()
        connectWebSocket()
      } else {
        generateAuthPage()
        let elem = document.getElementById("loginError")
        elem.style.display = "block";
      }

      // console.log('Cookies:', document.cookie);
      // Redirect to a new page or perform other actions
    })
    .catch(error => {
      console.error('Registration error:', error);
    });
  // }

}

const generate404 = () => {
  // Create and append the 404 page content
  var body = document.body;
  body.innerHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 Not Found</title>
      </head>
      <body>
        <h1>404 Not Found</h1>
        <p>Sorry, the page you are looking for might be in another castle.</p>
      </body>
      </html>
    `;
}
const displayAccueil = () => {
  IsAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
      document.body.style.backgroundColor = "white";
    
      let rightBar = document.createElement("div")
      rightBar.id = "rightBar"
    
      rightBarContent.forEach((element, i) => {
        if (element == "photo") {
          let li = document.createElement("li")
          let img = document.createElement("img")
          img.src = "../../uploads/profile.png"
          img.id = `${element}${i}`
          li.appendChild(img)
          rightBar.appendChild(li)
        } else {
          let a = document.createElement("a")
          a.className = "leftnav-link"
          if (element != "Accueil") {
            a.href = "/" + element
          } else {
            a.href = "/" 
          }
          a.textContent = element
          a.id = `${element}${i}`
          a.addEventListener('click', function (e) {
            e.preventDefault()
            window.history.pushState({}, '', e.target.href)
            if (element != "Accueil") {
              window.location.href = `http://localhost:8080/${element}` 
            } else {
              window.location.href = `http://localhost:8080/` 
            }
    
          });
          rightBar.appendChild(a)
        }
      })
    
    
      let content = document.createElement("div")
      content.id = "allContent"
    
      displayAllContent(content)
      container.innerHTML = ""
      container.style.backgroundColor = "white"
      container.appendChild(rightBar)
      container.appendChild(content)
      document.body.appendChild(container)
    }
  })
}

getData()

let addPost = (posts) => {
  IsAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
      let elem = posts
      elem.innerHTML = ""

      let createPost = document.createElement("div")
      createPost.id = "createPost"
      createPost.className = "createPost"


      let sort = document.createElement("div")
      let createPostButton = document.createElement("div")

      sort.id = "sortButton"
      sort.innerHTML = "<img id='MessageIcon' src='../../uploads/Sort.png'><p> Sort by </p>"

      createPostButton.id = "createPostButton"
      createPostButton.innerHTML = '<img src="../../uploads/add.png" alt="">'
      createPostButton.style.marginRight = "10px"
      createPostButton.style.cursor = "pointer"


      createPost.appendChild(sort)
      createPost.appendChild(createPostButton)
      elem.appendChild(createPost)
      createPostButton.addEventListener("click", createNewPost)



      //createPostButton.addEventListener("click", createNewPost)
      fetch('/dashboard')
        .then(response => response.json())
        .then(data => {
          console.log(data);
          data.AllPosts.forEach((element, i) => {
            let post = document.createElement("div")
            let c = `<div class="pBody"><div class="post-container5">
            <div class="post5" onClick="seePost('${element.Slug}')">
                <div class="post-header5">
                    <img class="post-owner-image5" src="../../uploads/icon.webp" alt="Owner Image">
                    <div class="post-owner-info5">
                        <span class="post-owner-name5">${element.AuthorName}</span>
                        <span class="post-time5">${element.LastEditionDate}</span>
                    </div>
                </div>

                <h2 class="post-title">${element.Title}</h2>
        
                <div class="post-content5">
                ${element.Description}
                </div>
                ${(element.ImageURL) ? `<img class="post-image5" src="../..${element.ImageURL}" alt="Post Image"></img>` : '<p></p>'} 
                
        
                <div class="post-stats5">
                    <span onClick="like(event, '${element.Slug}')">
                          <img class="heart-icon5" src="../../uploads/like.png" alt="Heart Icon"> <span id="likeCount-${element.Slug}">${element.NumberOfLikes}</span>
                      </span>
                      <span onClick="dislike(event, '${element.Slug}')">
                          <img class="heart-icon5" src="../../uploads/unlike.png" alt="Broken Heart Icon"> <span id="dislikeCount-${element.Slug}">${element.NumberOfDislikes}</span>
                      </span>
                    <span>
                        <img class="heart-icon5" src="../../uploads/comment.png" alt="Comment Icon"> ${element.NumberOfComments}
                    </span>
                </div>
        
                <div class="post-hashtags5">
                    ${(element.Categories && element.Categories.length > 0)
                ? element.Categories.map(category => `#${category.Name}`).join('<br>')
                : 'Aucune catégorie'}
                </div>
            </div>
        
            
        </div></div>`


            post.innerHTML = c
            elem.appendChild(post)
          })
        })
        .catch(error => {
          console.error('Error checking authentication:', error);
          return
        });
      }
    })

  }
//}

let like = (event, slug) => {
 
    event.stopPropagation()
    fetch('http://localhost:8080/like/' + slug, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // console.log(event.target.parentNode);
        document.getElementById(`likeCount-${slug}`).textContent = data.NbrLike
        document.getElementById(`dislikeCount-${slug}`).textContent = data.NbrDislike
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }


let dislike = (event, slug) => {
 
  event.stopPropagation()
  fetch('http://localhost:8080/dislike/' + slug, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // console.log(event.target.parentNode);
      document.getElementById(`likeCount-${slug}`).textContent = data.NbrLike
      document.getElementById(`dislikeCount-${slug}`).textContent = data.NbrDislike
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

const createNewPost = () => {
  IsAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
    openModal();
    }
  })
}

function openModal() {
  IsAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
  document.getElementById("myModal").style.display = "block";
    }
  })
}

// Fonction pour fermer le modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

const getAllPosts = () => {
  IsAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {

    fetch('http://localhost:8080/getAllPosts', {
      method: 'POST',
      credentials: 'include',  // Include cookies in the request
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        //  successful


        // console.log('Cookies:', document.cookie);
        // Redirect to a new page or perform other actions
      })
      .catch(error => {
        console.error('Registration error:', error);
      });
  }
})
}


const displayAllContent = (element) => {
  IsAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
  let onlineDiv = document.createElement("div")
  onlineDiv.innerHTML = `<span id="numberOfUser"> <span>`
  onlineDiv.id = "onlineDiv"
  //onlineDiv.style.backgroundColor = "blue"
  element.appendChild(onlineDiv)
  let tabBar = document.createElement("div")
  tabBar.id = "tabBar"

  let messageButton = document.createElement("button")
  messageButton.innerHTML = "<img id='MessageIcon' src='../../uploads/Message.png'> Messages"
  messageButton.id = "messageButton"
  messageButton.className = "accueilButton"

  messageButton.addEventListener("click", (e) => {
    let elem = document.getElementById('posts')
    elem.innerHTML = ""
    messageButton.style.borderBottom = "2px solid #76D7C4";
    NotificationButton.style.borderBottom = "";
    PostButton.style.borderBottom = "none";
    fetch('/getAllMessages', {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        let divMessages = document.createElement("div")
        divMessages.id = "divMessages"
        data.Messages.forEach(element => {
          let elemm = document.createElement("div")
          elemm.id = "mess"

          elemm.innerHTML = `
          <div class="full" onClick="seeMessages('${element.Receiver}')">
            <div class="MessName">${element.Receiver}</div>
            <div class="MessContent">${element.Content}</div>
            <div class="Time">${element.Time}</div>
          </div>`


          divMessages.appendChild(elemm)
        })

        elem.appendChild(divMessages)

      })
      .catch(error => {
        console.error('Error checking authentication:', error);
        return
      })
    //;onclick="sendMessage(event, '${friend}')"

    // 

  })
  let PostButton = document.createElement("button")
  PostButton.innerHTML = "<img id='MessageIcon' src='../../uploads/Dossier.png'> Posts"
  PostButton.id = "PostButton"
  PostButton.className = "accueilButton"
  PostButton.style.borderBottom = "2px solid #76D7C4";

  let NotificationButton = document.createElement("button")
  NotificationButton.innerHTML = "<img id='MessageIcon' src='../../uploads/Notif.png'> Notifications"
  NotificationButton.id = "NotificationButton"
  NotificationButton.className = "NotificationButton"

  NotificationButton.addEventListener("click", () => {
    let elem = document.getElementById('posts')
    posts.innerHTML = ""
    PostButton.style.borderBottom = "";
    messageButton.style.borderBottom = "";
    NotificationButton.style.borderBottom = "2px solid #76D7C4";
  })


  tabBar.appendChild(PostButton)
  tabBar.appendChild(messageButton)
  //tabBar.appendChild(NotificationButton)
  element.appendChild(tabBar)

  let bodyContent = document.createElement("div")
  //bodyContent.style.backgroundColor = 'rgb(188, 174, 247)'
  bodyContent.id = "bodyContent"

  let posts = document.createElement("div")
  posts.id = "posts"
  posts.className = "Allposts"
  posts.textContent = "All Posts"

  let onlineStatus = document.createElement("div")
  onlineStatus.id = "onlineStatus"
  // onlineStatus.style.backgroundColor = 'grey'

  // onlineStatus.textContent = 'We are online'

  addPost(posts)

  PostButton.addEventListener("click", (e) => {
    PostButton.style.borderBottom = "2px solid #76D7C4";
    NotificationButton.style.borderBottom = "";
    messageButton.style.borderBottom = "none";
    let elem = document.getElementById('posts')
    posts.innerHTML = ""

    let createPost = document.createElement("div")
    createPost.id = "createPost"
    createPost.className = "createPost"

    let sort = document.createElement("div")
    let createPostButton = document.createElement("div")

    sort.id = "sortButton"
    sort.innerHTML = "<img id='MessageIcon' src='../../uploads/Sort.png'><p> Sort by </p>"

    createPostButton.id = "createPostButton"
    createPostButton.innerHTML = '<img src="../../uploads/add.png" alt="">'
    createPostButton.style.marginRight = "10px"
    createPostButton.style.cursor = "pointer"

    createPost.appendChild(sort)
    createPost.appendChild(createPostButton)

    elem.appendChild(createPost)
    createPostButton.addEventListener("click", createNewPost)

    fetch('/dashboard')
      .then(response => response.json())
      .then(data => {
        console.log("");
        let post = document.createElement("div")
        data.AllPosts.forEach((element, i) => {
          console.log(element.ID);
          let c = `<div class="pBody"><div class="post-container5">
          <div class="post5" onClick="seePost('${element.Slug}')">
              <div class="post-header5">
                  <img class="post-owner-image5" src="../../uploads/icon.webp" alt="Owner Image">
                  <div class="post-owner-info5">
                      <span class="post-owner-name5">${element.AuthorName}</span>
                      <span class="post-time5">${element.LastEditionDate}</span>
                  </div>
              </div>

              <h2 class="post-title">${element.Title}</h2>
      
              <div class="post-content5">
              ${element.Description}
              </div>
      
              <img class="post-image5" src="../..${element.ImageURL}" alt="Post Image">
      
              <div class="post-stats5">
                  <span onClick="like(event, '${element.Slug}')">
                      <img class="heart-icon5" src="../../uploads/like.png" alt="Heart Icon"> <span id="likeCount-${element.Slug}">${element.NumberOfLikes}</span>
                  </span>
                  <span onClick="dislike(event, '${element.Slug}')">
                      <img class="heart-icon5" src="../../uploads/unlike.png" alt="Broken Heart Icon"> <span id="dislikeCount-${element.Slug}">${element.NumberOfDislikes}</span>
                  </span>
                  <span>
                      <img class="heart-icon5" src="../../uploads/comment.png" alt="Comment Icon"> ${element.NumberOfComments}
                  </span>
              </div>
      
              <div class="post-hashtags5">
                  ${(element.Categories && element.Categories.length > 0)
              ? element.Categories.map(category => `#${category.Name}`).join('<br>')
              : 'Aucune catégorie'}
              </div>
          </div>
      
          
      </div></div>`

          post.innerHTML += c
        })
        elem.appendChild(post)
      })
      .catch(error => {
        console.error('Error checking authentication:', error);
        return
      });


  })

  bodyContent.appendChild(posts)
  bodyContent.appendChild(onlineStatus)
  element.appendChild(bodyContent)
  }
})
}

const seePost = (slug) => {
  IsAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
  // alert('CLick on post')
  // window.history.replaceState({},'', '/post')
  let centralDiv = document.getElementById('posts')
  centralDiv.innerHTML = ''
  fetch('/post/' + slug)
    .then(response => response.json())
    .then(data => {
      console.log(data.UserPoster.Nickname);
      centralDiv.innerHTML = `
        <div id="cBody" class="cBody">
        <img class="back-button" src="../../uploads/back.png" alt="Back" onclick="goBack()">
          <div id="post-container" class="post-container">
            <div class="post-header">
              <img class="post-owner-image" src="../../uploads/gif.gif" alt="Owner Image">
              <div class="post-owner-info">
                  <span class="post-owner-name">${data.UserPoster.Nickname}</span>
                  <span class="post-time">${data.Post.ModifiedDate}</span>
              </div>
            </div>
            <div class="post-content">
              <p>${data.Post.Description}</p>
              <img class="post-image" src="../..${data.Post.ImageURL}" alt="Post Image">
            </div>
          <div class="comments-container">
          ${data.Comments && data.Comments.length > 0
          ? data.Comments.map(comment => `
          <div class="comment">
              <div class="comment-header">
                  <img class="comment-owner-image" src="../../uploads/icon.webp" alt="Commenter Image">
                  <div class="comment-owner-info">
                      <span class="comment-owner-name">${comment.AuthorName}</span>
                      <span class="comment-time">${comment.LastModifiedDate}</span>
                  </div>
              </div>
              <p>${comment.Text}</p>
          </div>
      `).join('')
          : 'No comments available.'}
          
      <form class="comment-form" id="cf">
      <input type="text" class="comment-input" id="ci" placeholder="Write a comment...">
      <button type="submit" class="comment-button" id="cb">Comment</button>
    </form></div></div>`

      let coordonnates = centralDiv.getBoundingClientRect()

      centralDiv.scrollTo({
        top: coordonnates.bottom + 1000,
        behavior: 'smooth' // Pour un défilement fluide, si pris en charge par le navigateur
      });

      const commentForm = document.getElementById('cf');
      const commentInput = document.getElementById('ci');

      commentForm.addEventListener('submit', (event) => {
        event.preventDefault();


        const commentText = commentInput.value;
        console.log(commentText);

        fetch('/comment/' + data.Post.ID, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: commentText }),
        })
          .then(response => response.json())
          .then(newComment => {
            if (newComment.commented == true) {
              seePost(slug)
              console.log('New comment added:', newComment);
            }
          })
          .catch(error => {
            console.error('Error adding comment:', error);
          });
      });


    })
    .catch(error => {
      console.error('Error checking authentication:', error);
      return
    });
    }
  })
}

var messageContainer = document.getElementById('posts');
console.log('messageContainer', messageContainer);
// messageContainer.addEventListener("scroll", () => {
//   console.log("scrolling");
// })


const goBack = () => {
  window.location.href = '/'
}


let socket;

function connectWebSocket() {
  IsAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
  socket = new WebSocket("ws://localhost:8080/ws");

  socket.addEventListener("open", (event) => {
    console.log("Connected to WebSocket");
    fetch('/dashboard')
      .then(response => response.json())
      .then(data => {
        console.log('data.CurrentUser.Nickname : ', data.CurrentUser.Nickname);

        // Check if the WebSocket connection is still open before sending data
        if (socket.readyState === WebSocket.OPEN) {
          const initialData = {
            username: data.CurrentUser.Nickname,
            // Other initial data if necessary
          };
          socket.send(JSON.stringify(initialData));
          // document.getElementById("onlineStatus").textContent = data.tabOnline
        } else {
          console.error('WebSocket is not in OPEN state.');
        }
      })
      .catch(error => {
        console.error('Error checking authentication:', error);
        return;
      });
  })

  socket.addEventListener("message", (event) => {
    const [command, payload] = event.data.split('|');
    if (command === 'updateUsers') {
      let last = payload[payload.length - 1]

      console.log("Payload : ", payload);

      let newString = payload.slice(0, -2);
      newString += last
      console.log("Payload : ", newString);
      console.log("online users : ", JSON.parse(newString));
      const onlineUsers = JSON.parse(newString)

      fetch('/dashboard')
        .then(response => response.json())
        .then(data => {
          console.log("Online Users : ", onlineUsers);
          let onlines = []
          onlineUsers.map((element, i) => {
            if (element.nom == data.CurrentUser.Nickname) {

              const onlineUsersDiv = document.getElementById('onlineStatus');
              // onlineUsersDiv.innerHTML = onlineUsers.join('<br>');

              onlineStatus.innerHTML = `<div class="obody"><div class="user-list-container">
              <h2>Online</h2>
              <ul id="user-list">
              </ul>
              </div></div>
              `

              const userList = document.getElementById("user-list")
              if (element.onlineUsers) {
                element.onlineUsers.forEach(element => {
                  onlines.push(element)
                  userList.innerHTML += `<li class="user-item" onClick="seeMessages('${element}')">
                  <span class="user-name">${element}</span>
                  <span class="user-status">🟢</span>
                  </li>`
                })

                userList.innerHTML += "<h2>Offline</h2>"
              }
              data.AllUsers.sort()

              data.AllUsers.forEach(ele => {

                if (ele.Nickname.length != 0 && !onlines.includes(ele.Nickname) && ele.Nickname != data.CurrentUser.Nickname) 
                userList.innerHTML += `<li class="user-item">
                <span class="user-name">${ele.Nickname}</span>
                <span class="user-status"></span>
                </li>`
              })
              let elem = document.getElementById('numberOfUser')
              elem.textContent = "Hello, " + data.CurrentUser.Nickname + " 🙂"
            }
          })
        })
        .catch(error => {
          console.error('Error checking authentication:', error);
          return;
        });
    } else {
      fetch('/dashboard')
        .then(response => response.json())
        .then(data => {
          console.log("Event data : ", event.data);
          let json = JSON.parse(event.data)
          //console.log('Nickname ===== : ', data.CurrentUser.Nickname);
          const chatDiv = document.getElementById("discuss");
          console.log("json : ", json);
          if (data.CurrentUser.Nickname == json.sender) {
            chatDiv.innerHTML += `<div class="message user1">
            <span class="message-Author">${json.sender}</span>
          <p class="message-bodySend">${json.message}</p>
          <span class="message-time">${getFormattedDate()}</span>
          </div>`
          } else {
            showPopup(json.sender);
            chatDiv.innerHTML += `<div class="message user2">
            <span class="message-Author">${json.sender}</span>
          <p class="message-bodyReceive">${json.message}</p>
          <span class="message-time">${getFormattedDate()}</span>
          </div>`
          }
          const messages = document.querySelectorAll('.message');
          const lastMessage = messages[messages.length - 1];
          if (lastMessage) {
            lastMessage.scrollIntoView();
          }
        })
        .catch(error => {
          console.error('Error checking authentication:', error);
          return
        });

      // chatDiv.innerHTML += `<p> ${event.data}</p>`;
    }

  });

  socket.addEventListener("close", (event) => {
    console.log("Connection closed");
  });
  }
})
}
//}


function sendMessage(event, receiver) {
  // IsAuthenticated().then(isAuthenticated => {
  //   if (isAuthenticated) {
  event.preventDefault();
  const messageInput = document.getElementById("ci");

  const message = messageInput.value;
  if (message.length == 0) {
    return
  }
  let recipient = receiver;

  fetch('/dashboard')
    .then(response => response.json())
    .then(data => {
      //console.log('data.CurrentUser.Nickname : ', data.CurrentUser.Nickname);
      const datam = {
        message: message,
        recipient: recipient,
        sender: data.CurrentUser.Nickname,
      };

      socket.send(JSON.stringify(datam));

    })
    .catch(error => {
      console.error('Error checking authentication:', error);
      return
    });

  // Clear input fields
  messageInput.value = "";
  let centralDiv = document.getElementById("discuss")

  let coordonnates = centralDiv.getBoundingClientRect()

  centralDiv.scrollTo({
    top: coordonnates.bottom + 50000,
    behavior: 'smooth' // Pour un défilement fluide, si pris en charge par le navigateur
  });
  // recipientInput.value = "";
    }
// })
// }

function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = new Date().getTime();

    if (!lastExecTime || currentTime - lastExecTime >= delay) {
      // Exécutez la fonction si le délai s'est écoulé
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      // Sinon, planifiez l'exécution de la fonction après le délai restant
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = new Date().getTime();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

let loader = 10

function seeMessages(friend, limit = 10) {
  IsAuthenticated().then(isAuthenticated => {
    if (isAuthenticated) {
  console.log('LIMIT ++++===== ', limit);

  let elem = document.getElementById('posts')
  elem.innerHTML = ''
  elem.innerHTML = `<div id="mbody" class="mbody"><div id="chat-container" class="chat-container">
  <div class="chat-header">
    <img class="post-owner-image5" src="../../uploads/icon.webp" alt="User 2">
    <h2>${friend}</h2>
  </div>
  <div class="messages" id="discuss">
      
  </div>
  <form class="comment-form" id="cf">
      <input type="text" class="comment-input" id="ci" placeholder="Write your message...">
      <button class="comment-button" id="cb" onclick="sendMessage(event, '${friend}')"><img id="SendMessageIcon" src="../../uploads/Sent.png"></button>
    </form>
</div></div>`

  let toScroll = document.getElementById("discuss")
  // let c = toScroll.getBoundingClientRect();
  // toScroll.scrollTo = 580;
  // let coordonnates = centralDiv.getBoundingClientRect()

  // toScroll.scrollTop
  toScroll.addEventListener("scroll", function () {
    console.log(toScroll.scrollTop);
    if (toScroll.scrollTop === 0) {
      console.log('ON TOPPPPPPPPPP', loader);
      loader = loader + 10
      throttle(seeMessages(friend, loader), 1000)
    }
  })


  let fff = document.getElementById('discuss')
  fetch(`http://localhost:8080/discussion/${friend}?limit=${limit}`)
    .then(response => response.json())
    .then(data => {
      data.Messages.forEach(message => {
        if (message.Receiver != friend) {
          fff.innerHTML += `<div class="message user2">
          <span class="message-Author">${message.Author}</span>
          <p class="message-bodyReceive">${message.Message}</p>
          <span class="message-time">${message.Time}</span>
      </div>`
        } else {
          fff.innerHTML += `<div class="message user1">
          <span class="message-Author">${message.Author}</span>
          <p class="message-bodySend">${message.Message}</p>
          <span class="message-time">${message.Time}</span>
      </div>`
        }
        console.log("nnnnn = ", message.Receiver);
      })
      console.log("mess = ", data);
      if (loader === 10) {
        const messages = document.querySelectorAll('.message');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
          lastMessage.scrollIntoView();
        }
      }

    })
    .catch(error => {
      console.error('Error checking authentication:', error);
      return
    });
  }
  })
}

function send(receiver) {
  // IsAuthenticated().then(isAuthenticated => {
  //   if (isAuthenticated) {
  let mess = document.getElementById('ci').value
  console.log(mess);
  const recipient = receiver;

  const datam = {
    message: mess,
    recipient: recipient,
    sender: 'Gondia',
  };

  if (message.trim() !== "") {
    socket.send(JSON.stringify(datam));
  }
}
// })
// }

function getFormattedDate() {
  var date = new Date();

  var annee = date.getFullYear();
  var mois = (date.getMonth() + 1).toString().padStart(2, '0');
  var jour = date.getDate().toString().padStart(2, '0');
  var heures = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  var secondes = date.getSeconds().toString().padStart(2, '0');

  return `${annee}-${mois}-${jour} ${heures}:${minutes}:${secondes}`;
}
// Fonction pour afficher le pop-up
function showPopup(username) {
  document.getElementById('message-popup').style.display = 'block';
  document.getElementById('user').textContent = '@' + username

  // Afficher le bouton après 5 secondes (ajustable selon vos besoins)
  setTimeout(function () {
    document.getElementById('countdown').style.display = 'none';
    document.querySelector('button').style.display = 'inline-block';
  }, 5000);

  // Disparition du pop-up après 8 secondes (ajustable selon vos besoins)
  setTimeout(closePopup, 4000);
}

// Fonction pour fermer le pop-up
function closePopup() {
  document.getElementById('message-popup').style.display = 'none';
}

// // Appel à la fonction showPopup au chargement de la page
// document.addEventListener('DOMContentLoaded', function () {
//   showPopup();
// });