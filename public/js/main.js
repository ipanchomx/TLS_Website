let navbar = document.getElementById('navBar');

let cerrarSesion = function () {
    sessionStorage.login = false;
    window.location.href = "../index.html";

}

if (sessionStorage.login == 'true') {
    navBar.innerHTML = `<a href="./index.html">
    TLS project
    </a>
    <a href="./views/home.html">
        Home
    </a>
    <a href="./views/upload.html">
        Upload
    </a>
    <a href="">
        Contact
    </a>
    <a class="login" id="idLogin" onclick="cerrarSesion()">
        ${sessionStorage.email}
    </a>`
} else {
    navBar.innerHTML = `<a href="./index.html">
    TLS project
    </a>
    <a href="./views/home.html">
        Home
    </a>
    <a href="./views/upload.html">
        Upload
    </a>
    <a href="">
        Contact
    </a>
    <a class="login" href="./views/login.html" id="idLogin">
        Logged in as Username
    </a>`
}

