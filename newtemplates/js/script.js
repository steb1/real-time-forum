function checkAuthentication() {
  fetch('/CheckAuthentication')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.authenticated) {
        console.log('User is authenticated');
        displayAccueil();
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
document.addEventListener('DOMContentLoaded', () => {
  closeModal()
})
// var bigData = {};
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


document.addEventListener('DOMContentLoaded', function () {
  checkAuthentication();
})


console.log("session = ", all.IsLoggedIn);
let rightBarContent = ["photo", "dashboard", "settings", "disconnect"]
let container = document.getElementById("container-flex")
const preventReloadLinks = container.querySelectorAll('.leftnav-link');
const AllRoutes = ["", "photo", "dashboard", "settings", "disconnect"]


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

const registerForm = (e) => {

  const authPage = document.createElement('div');
  var body = document.body;
  body.style.backgroundColor = "#080710"
  authPage.innerHTML = `
        <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
        </div>
    <form id="form" method="POST" action="/sign-in">
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
  form.style.height = "900px"
  form.style.marginTop = '200px'

  document.getElementById("form").addEventListener("click", (e) => {
    e.preventDefault();
    window.history.pushState({}, '', e.target.href)
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
      } else {
        generateAuthPage()
      }

    })
    .catch(error => {
      console.error('Registration error:', error);
    });
}

// Perform login
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

  let rightBar = document.createElement("div")
  rightBar.id = "rightBar"

  rightBarContent.forEach((element, i) => {
    if (element == "photo") {
      let li = document.createElement("li")
      let img = document.createElement("img")
      img.src = "../../uploads/gif.gif"
      img.id = `${element}${i}`
      li.appendChild(img)
      rightBar.appendChild(li)
    } else {
      let a = document.createElement("a")
      a.className = "leftnav-link"
      a.href = "/" + element
      a.textContent = element
      a.id = `${element}${i}`
      a.addEventListener('click', function (e) {
        e.preventDefault()
        window.history.pushState({}, '', e.target.href)
        if (element == "disconnect") {
          window.location.href = "http://localhost:8080/disconnect"
        }

      });
      rightBar.appendChild(a)
    }
  })


  let content = document.createElement("div")
  content.id = "allContent"

  displayAllContent(content)
  container.innerHTML = ""
  container.appendChild(rightBar)
  container.appendChild(content)
  document.body.appendChild(container)

}
getData()



let addPost = (posts) => {
  let elem = posts
  elem.innerHTML = ""

  let createPost = document.createElement("div")
  createPost.id = "createPost"
  createPost.className = "createPost"


  let sort = document.createElement("div")
  let createPostButton = document.createElement("div")

  sort.id = "sortButton"
  sort.innerHTML = '<p> Sort by </p>'

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

        let content = `
            <div id=${element.ID} class="Post">
              
                <div class="PostContent">
                    <div class="imagePost"><img class="image" src="../../uploads/icon.webp" alt=""></div>
                    <div class="PostInfo">
                        <div class="PostOwner">${element.AuthorName}</div>
                        <div class="PostTime">${element.LastEditionDate}</div>
                    </div>
                    
                </div>
    
                <div class="PostBody" onClick="seePost('${element.ID}')">
                <img class="imagePost1" src="../..${element.ImageURL}" alt="">
                    <p class="text"> ${element.Description} </p>
                    <div class="categorie">
                        <p>${(element.Categories && element.Categories.length > 0)
            ? element.Categories.map(category => category.Name).join('<br>')
            : 'Aucune catégorie'}</p>
                  
                    </div>
                </div>
    
                <div class="PostFooter">
                    <div class="element">
    
                    </div>
                </div>
                <div class="impressions">
                    <div class="likeDislike">
                        <div><span>${element.NumberOfLikes}</span><img id=${element.ID} onclick="like()" class="like" src="../../uploads/like.png" alt=""></div>
                        <div><span>${element.NumberOfDislikes}</span> <img id=${element.ID} onclick="dislike()" class="like" src="../../uploads/unlike.png" alt=""></div>
                        <div><span>${element.NumberOfComments}</span> <img id=${element.ID} onclick="comment()" class="like" img src="../../uploads/comment.png" alt=""></div>
                        <div id="comment${element.ID}" class="commentPart hidden">
                          <input class="inputComment" placeholder="add a comment" type="email" class="form__field" placeholder="Your E-Mail Address" />
                          <button class="commentButton" type="button" class="btn btn--primary btn--inside uppercase">Comment</button>
                        </div>
                        <div><div>
                    </div>
                </div>
            </div>
    
           `
        post.innerHTML = content
        elem.appendChild(post)
      })
    })
    .catch(error => {
      console.error('Error checking authentication:', error);
      return
    });
}

let comment = () => {

}

let like = (e) => {
  let id = e
  console.log(id);
}

const createNewPost = () => {
  if (checkAuthentication) {
    openModal();
  }

}

function openModal() {
  document.getElementById("myModal").style.display = "block";
}

// Fonction pour fermer le modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

const getAllPosts = () => {
  if (checkAuthentication) {

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
}


const displayAllContent = (element) => {
  let onlineDiv = document.createElement("div")
  onlineDiv.textContent = '3 people are online'
  onlineDiv.id = "onlineDiv"
  //onlineDiv.style.backgroundColor = "blue"
  element.appendChild(onlineDiv)
  let tabBar = document.createElement("div")
  tabBar.id = "tabBar"

  tabBar.style.backgroundColor = "yellow"
  let messageButton = document.createElement("button")
  messageButton.textContent = "Message"
  messageButton.id = "messageButton"
  messageButton.className = "accueilButton"

  messageButton.addEventListener("click", (e) => {
    let elem = document.getElementById('posts')
    elem.textContent = "All Message Here"
  })
  let PostButton = document.createElement("button")
  PostButton.textContent = "Posts"
  PostButton.id = "PostButton"
  PostButton.className = "accueilButton"

  tabBar.appendChild(PostButton)
  tabBar.appendChild(messageButton)
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
  onlineStatus.style.backgroundColor = 'grey'
  onlineStatus.textContent = 'We are online'

  addPost(posts)

  PostButton.addEventListener("click", (e) => {
    let elem = document.getElementById('posts')
    posts.innerHTML = ""

    let createPost = document.createElement("div")
    createPost.id = "createPost"
    createPost.className = "createPost"

    let sort = document.createElement("div")
    let createPostButton = document.createElement("div")

    sort.id = "sortButton"
    sort.innerHTML = '<p> Sort by </p>'

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
          let content = `
          <div id=${element.ID} class="Post">
            
              <div class="PostContent">
                  <div class="imagePost"><img class="image" src="../../uploads/icon.webp" alt=""></div>
                  <div class="PostInfo">
                      <div class="PostOwner">${element.AuthorName}</div>
                      <div class="PostTime">${element.LastEditionDate}</div>
                  </div>
                  
              </div>
  
              <div class="PostBody" onClick="seePost('${element.ID}')">
              <img class="imagePost1" src="../..${element.ImageURL}" alt="">
                  <p class="text"> ${element.Description} </p>
                  <div class="categorie">
                      ${(element.Categories && element.Categories.length > 0)
              ? element.Categories.map(category => category.Name).join('<br>')
              : 'Aucune catégorie'}
                
                  </div>
              </div>
  
              <div class="PostFooter">
                  <div class="element">
  
                  </div>
              </div>
              <div class="impressions">
                  <div class="likeDislike">
                      <div><span>${element.NumberOfLikes}</span><img id=${element.ID} onclick="like()" class="like" src="../../uploads/like.png" alt=""></div>
                      <div><span>${element.NumberOfDislikes}</span> <img id=${element.ID} onclick="dislike()" class="like" src="../../uploads/unlike.png" alt=""></div>
                      <div><span>${element.NumberOfComments}</span> <img id=${element.ID} onclick="comment()" class="like" img src="../../uploads/comment.png" alt=""></div>
                      <div id="comment${element.ID}" class="commentPart hidden">
                        <input class="inputComment" placeholder="add a comment" type="email" class="form__field" placeholder="Your E-Mail Address" />
                        <button class="commentButton" type="button" class="btn btn--primary btn--inside uppercase">Comment</button>
                      </div>
                      <div><div>
                  </div>
              </div>
          </div>
  
         `
          post.innerHTML += content
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

const seePost = (id) => {
  // alert('CLick on post')
  // window.history.replaceState({},'', '/post')
  let centralDiv = document.getElementById('posts')
  centralDiv.innerHTML = ''
  centralDiv.innerHTML = `
  <div class="papa">
  <div class="post-container">
  <div class="post-header">
        <img class="post-owner-image" src="../../uploads/gif.gif" alt="Owner Image">
        <div class="post-owner-info">
            <span class="post-owner-name">John Doe</span>
            <span class="post-time">2 hours ago</span>
        </div>
    </div>
    <div class="post-content">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis lorem ut libero malesuada dapibus.
            Quisque aliquam tincidunt nisi, nec lacinia nulla eleifend vel.</p>
        <img class="post-image" src="../../uploads/gif.gif" alt="Post Image">
    </div>

    <div class="comments-container">
        <div class="comment">
            <p><strong>User1:</strong> Nice post!</p>
        </div>
        <div class="comment">
            <p><strong>User2:</strong> Thanks, Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div class="comment">
            <p><strong>User3:</strong> Thanks, Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div class="comment">
            <p><strong>User4:</strong> Thanks, Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div class="comment">
            <p><strong>User5:</strong> Thanks, Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div class="comment">
            <p><strong>User6:</strong> Thanks, Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
    </div>
  </div>
    <form class="comment-form" id="cf">
      <input type="text" class="comment-input" id="ci" placeholder="Write a comment...">
      <button type="button" class="comment-button" id="cb" >Comment</button>
    </form>
</div>`

  console.log(id);
}

const newPost = () => {
  console.log('heeeeeeeeeeeeeereeeeeeeeeeeeeeeeeeee');
  // // Récupérer les données du formulaire
  // var formData = new FormData(document.getElementById('postForm'));

  // // Effectuer une requête AJAX avec fetch
  // fetch('/post', {
  //   method: 'POST',
  //   body: formData,
  // })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Erreur lors de la création du post');
  //     }
  //     return response.json(); // Supposons que le serveur renvoie une réponse JSON
  //   })
  //   .then(data => {
  //     // La requête a réussi
  //     console.log('Post créé avec succès!', data);
  //     // Ajoutez ici la logique pour mettre à jour l'interface utilisateur, par exemple, afficher un message de succès.
  //   })
  //   .catch(error => {
  //     // La requête a échoué
  //     console.error('Erreur lors de la création du post:', error.message);
  //     // Ajoutez ici la logique pour gérer les erreurs, par exemple, afficher un message d'erreur.
  //   });

}



