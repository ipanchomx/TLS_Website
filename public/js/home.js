let data;
let files = [];
let grid_container = document.querySelector('#grid-container');


// 1. Crear XMLHttpRequest object
let xhr = new XMLHttpRequest();
// 2. Configurar: POST actualizar archivo
xhr.open('GET', 'https://localhost:8080/getFiles');
// 3. indicar tipo de datos JSON
xhr.setRequestHeader('Content-Type', 'application/json');

// 4. Enviar solicitud al servidor
xhr.send();

// 5. Una vez recibida la respuesta del servidor
xhr.onload = function () {
    if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP
        // Ocurrió un error
        //alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
        alert(xhr.status + ': ' + xhr.statusText);
        console.log(xhr.response.files);

    } else {
        //console.log(xhr.responseText); // Significa que fue exitoso
        //alert(xhr.responseText);
        data = JSON.parse(xhr.response);
        //console.log("data: ", data);
        files = data.files;
        cargarDocs();
        /*
        console.log("data files: ", files);
        console.log("data 0: ", files[0]);
        console.log("data 1: ", files[1]);
        */
    }
};

let enviarDatos = function(id) {
    let str = 'idHeader' + id;
    let docName = document.getElementById(str);
    docName = docName.innerText;

    let data = {
        id : id,
        name : docName
    }
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: POST actualizar archivo
    xhr.open('POST', 'https://localhost:8080/verify');
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');

    // 4. Enviar solicitud al servidor
    xhr.send(JSON.stringify(data));

    console.log(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP
            // Ocurrió un error
            //alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            alert('Cuidado! El archivo no corresponde con la firma.');
        } else {
            //console.log(xhr.responseText); // Significa que fue exitoso
            //alert(xhr.responseText);
            alert('La verificación de tu archivo ha sido exitosa!');
        }

    } 
}

let decrypt = function(id) {
    let str = 'idHeader' + id;
    let docName = document.getElementById(str);
    docName = docName.innerText;

    let data = {
        id : id,
        name : docName
    }
    //console.log(data);
    
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: POST actualizar archivo
    xhr.open('POST', 'https://localhost:8080/decrypt');
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');

    // 4. Enviar solicitud al servidor
    xhr.send(JSON.stringify(data));

    //console.log(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP
            // Ocurrió un error
            //alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            alert('Cuidado! El archivo no corresponde con la firma.');
        } else {
            //console.log(xhr.responseText); // Significa que fue exitoso
            //alert(xhr.responseText);
            alert('El archivo ha sido desencriptado!');
        }
    }    
}

let sendToQR = function(id) {
    let str = 'idHeader' + id;
    let docName = document.getElementById(str);
    docName = docName.innerText;
    let arr = docName.split('.');
    console.log(arr);
    window.location.href = `../qrCodes/qr${arr[0]}.html`;

}

let cargarDocs = function() {
    let count = 0;
    files.forEach(item => {
        grid_container.innerHTML += `<div class="xs-100 md-50 lg-33 xl-25">
        <h2 id="idHeader${count}">${item}</h2>
        <img src="../img/document-icon.jpg" alt="Document" >
        <div id="divButton">
        <button onclick="enviarDatos(${count})">Verify</button>
        <button onclick="sendToQR(${count})">QR</button>
        <button onclick="decrypt(${count})">Decrypt</button>
        </div>
        </div>`;
        count += 1;
    });
}

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
    <a href="../views/edit.html">
    Edit
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