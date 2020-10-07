let email = document.getElementById('email');
let password = document.getElementById('password');
let span = document.getElementById('spanID');
let submit = document.getElementById('submit');
let formLogin = document.getElementById('formLogin');
let modal = document.querySelector('#modal');
let btnCerrar = document.querySelector('#btnCerrar');
let imgQR = document.querySelector('#imgQR');
let idCode = document.querySelector('#idCode');
let campos;
let data;

span.style.display = 'none';
modal.style.display = 'none';

let cerrarModal = function () {
    modal.style.display = 'none';
    return;
}

let isEmailValid = function () {
    return (email.value.length > 0);
}

let isPasswordValid = function () {
    return (password.value.length > 0);
}

let canSubmit = function () {
    return (isPasswordValid() && isEmailValid());
}

let passwordEvent = function () {
    //Find out if password is valid  
    if (isPasswordValid()) {
        //Hide hint if valid
        span.style.display = 'none';
    } else {
        //else show int
        span.style.display = '';
    }
}

formLogin.addEventListener("change", function (E) {
    campos = document.querySelectorAll("#formLogin input:invalid");
    passwordEvent();

    console.log(campos);
    if (campos.length == 0 && canSubmit()) {
        submit.disabled = false;
    }
});

let sendData = function() {
    let data = {
        email : email.value,
        password : password.value
    };
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: POST actualizar archivo
    xhr.open('POST','https://localhost:8080/api/login');
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // 4. Enviar solicitud al servidor
    xhr.send(JSON.stringify(data));

    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP
            // Ocurrió un error
            //alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            //alert(xhr.status + ': ' + xhr.statusText);
            alert('Las credenciales no son correctas!');
        
        } else {
            data = JSON.parse(xhr.response);
            modal.style.display = '';
            imgQR.src = data.url;
        }
    };

    return false;
}

let confirmar = function () {

    let data = {
        email : email.value,
        password : password.value,
        codigo : idCode.value
    };

    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: POST actualizar archivo
    xhr.open('POST','https://localhost:8080/api/verifyToken');
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // 4. Enviar solicitud al servidor
    xhr.send(JSON.stringify(data));

    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP
            // Ocurrió un error
            //alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            alert(xhr.status + ': ' + xhr.statusText);
        
        } else {
            //console.log(xhr.responseText); // Significa que fue exitoso
            data = JSON.parse(xhr.response);
            modal.style.display = 'none';
            sessionStorage.login = true;
            sessionStorage.email = data.email;
            alert(xhr.responseText);
            window.location.href = "../index.html";
        }
    };  
}