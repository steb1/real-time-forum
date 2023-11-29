let isLoggedIn = true
let rightBarContent = ["photo", "dashboard", "settings", "disconnect"]
let container = document.getElementById("container-flex")
const preventReloadLinks = container.querySelectorAll('.leftnav-link');
const AllRoutes =  ["", "photo", "dashboard", "settings", "disconnect"]


function generateAuthPage() {
    const authPage = document.createElement('div');
    authPage.innerHTML = `
        <h2>Login</h2>
        <form id="loginForm">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="button" onclick="login()">Login</button>
        </form>
    `;

    container.innerHTML = '';
    container.appendChild(authPage);
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
let accueil = true

const handleRoutes = (route) => {
    if (all != "404" || AllRoutes.includes(window.location.href.split("/")[3])) {
        console.log("ok");
        if (all.IsLoggedIn) {
                displayAccueil();
        } else {
            generateAuthPage();
        }
    } else {
        console.log("ok");
        generate404()
    }
}
handleRoutes()


