const uploadForm = document.querySelector('.upload');

uploadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sessionStorage.login != "true") {
        alert('No puedes subir contenido sin haber iniciado sesión antes.');
        window.location.href = "../index.html";

    } else {
        //console.log('Si entró al evento');
        let file = e.target.sampleFile.files[0];
        //console.log(file);
        let formData = new FormData();

        formData.append('file', file);

        /*for (var key of formData.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }
        */
        fetch('https://localhost:8080/upload', {
                method: 'POST',
                body: formData
            })
            .then(resp => {
                resp.json();
                alert('Archivo almacenado!');
            })
            .then(data => {
                if (data.errors) {
                    alert(data.errors);
                } else {
                    console.log(data);
                }
            });
    }

});


let navbar = document.getElementById('navBar');

let cerrarSesion = function () {
    sessionStorage.login = false;
    window.location.href = "../index.html";

}

if (sessionStorage.login == 'true') {
    navBar.innerHTML = `<a href="../index.html">
    TLS project
    </a>
    <a href="./home.html">
        Home
    </a>
    <a href="./upload.html">
        Upload
    </a>
    <a href="">
        Contact
    </a>
    <a class="login" id="idLogin" onclick="cerrarSesion()">
        ${sessionStorage.email}
    </a>`
} else {
    navBar.innerHTML = `<a href="../index.html">
    TLS project
    </a>
    <a href="./home.html">
        Home
    </a>
    <a href="./upload.html">
        Upload
    </a>
    <a href="">
        Contact
    </a>`
}