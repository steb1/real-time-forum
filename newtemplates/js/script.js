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


document.addEventListener('DOMContentLoaded', function () {
  checkAuthentication()
})




console.log("session = ", all.IsLoggedIn);
let rightBarContent = ["photo", "dashboard", "settings", "disconnect"]
let container = document.getElementById("container-flex")
const preventReloadLinks = container.querySelectorAll('.leftnav-link');
const AllRoutes = ["", "photo", "dashboard", "settings", "disconnect"]
var isLogged = false


function generateAuthPage() {
  const authPage = document.createElement('div');
  var body = document.body;
  body.style.backgroundColor = "#080710"
  authPage.innerHTML = `
        <div class="background">
    <div class="shape"></div>
    <div class="shape"></div>
    </div>
    <form id="form" method="POST" action="/sign-in">
        <h3>Login Here</h3>

        <label for="username">Username</label>
        <input type="text" placeholder="Email or Nickname" id="username">

        <label for="password">Password</label>
        <input type="password" placeholder="Password" id="password">

        <button onClick="login()" >Log In</button>
        <button onClick="registerForm()">Sign up</button>
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
    
        <button type="button" onclick="registerUser()">Register</button>
        <button type="button" onclick="generateAuthPage()">Return</button>
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
      console.log('Registration successful:', data);
      if (checkAuthentication()) {
        displayAccueil()
        console.log('i');
      } else {
        generateAuthPage()
      }

      // console.log('Cookies:', document.cookie);
      // Redirect to a new page or perform other actions
    })
    .catch(error => {
      console.error('Registration error:', error);
    });
}

// const login = (e) => {
//     let username = document.getElementById("username")
//     let password = document.getElementById("password")

//     var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
//     console.log("username : ", username.value);

//     var isValid = passwordRegex.test(password.value);

//     if (isValid) {
//         var serverURL = `http://localhost:8080/sign-in?username=${username.value}&password=${password.value}`;

//         // Send a GET request to the Go server
//         fetch(serverURL)
//           .then(response => {
//             if (!response.ok) {
//               throw new Error('Network response was not ok');
//             }
//             return response.text();
//           })
//           .then(data => {
//             // Process the response data
//             console.log('Server Response:', data);
//           })
//           .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//           });
//     }
// }

// Perform login
function login() {
  let username = document.getElementById("username").value
  let password = document.getElementById("password").value

  // var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
  console.log("username : ", username.value);

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
      // return response.json();
    })
    .then(data => {
      // Registration successful, handle the response data
      console.log('Login successful:', data);
      if (checkAuthentication()) {
        displayAccueil()
      } else {
        generateAuthPage()
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
        //console.log(e.target.href)
        handleRoutes(e)
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
  console.log('ok')
  document.body.appendChild(container)

}
const displayAllContent = (element) => {
  let onlineDiv = document.createElement("div")
  onlineDiv.textContent = '3 people are online'
  onlineDiv.id = "onlineDiv"
  onlineDiv.style.backgroundColor = "blue"
  element.appendChild(onlineDiv)
  let tabBar = document.createElement("div")
  tabBar.id = "tabBar"

  tabBar.style.backgroundColor = "yellow"
  let messageButton = document.createElement("button")
  messageButton.textContent = "Message"
  messageButton.id = "messageButton"
  messageButton.addEventListener("click", (e) => {
    let elem = document.getElementById('posts')
    elem.textContent = "All Message Here"
  })
  let PostButton = document.createElement("button")
  PostButton.textContent = "Posts"
  PostButton.id = "PostButton"
  PostButton.addEventListener("click", (e) => {
    let elem = document.getElementById('posts')
    elem.textContent = "All Posts Here"
  })
  tabBar.appendChild(PostButton)
  tabBar.appendChild(messageButton)
  element.appendChild(tabBar)
  let bodyContent = document.createElement("div")
  bodyContent.style.backgroundColor = 'red'
  bodyContent.id = "bodyContent"
  let posts = document.createElement("div")
  posts.id = "posts"
  posts.style.backgroundColor = 'red'
  posts.textContent = "All Posts"
  let onlineStatus = document.createElement("div")
  onlineStatus.id = "onlineStatus"
  onlineStatus.style.backgroundColor = 'grey'
  onlineStatus.textContent = 'We are online'
  bodyContent.appendChild(posts)
  bodyContent.appendChild(onlineStatus)
  element.appendChild(bodyContent)
}

// function checkAuthentication() {
//   fetch('http://localhost:8080/CheckAuthentication', {
//     method: 'GET',
//     credentials: 'include',  // Include cookies in the request
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Authentication failed');
//       }
//       return response.ok;
//     })
//     .then(data => {
//       // The user is authenticated, handle the response data
//       console.log('Authenticated:', data);
//     })
//     .catch(error => {
//       // Redirect to the login page or handle the error accordingly
//       console.error('Authentication error:', error);
//       return false
//     });
// }


// const handleRoutes = (route) => {
//   if (all != "404" || AllRoutes.includes(window.location.href.split("/")[3])) {
//     if (checkAuthentication()) {
//       console.log(checkAuthentication());
//       displayAccueil();
//     } else {
//       console.log("false")
//       generateAuthPage();
//     }
//   } else {
//     console.log("ok");
//     generate404()
//   }
// }

// handleRoutes()



