let email = document.getElementById('Email');
let password = document.getElementById('password');
let confirmPassword = document.getElementById('confirm_password');
let spanList = document.querySelectorAll('form span');
let submit = document.getElementById('submit');
let formSign = document.getElementById('formSignUp');
let campos;
submit.disabled = true;

spanList.forEach(item => {
    item.style.display = 'none';
});

let isPasswordValid = function () {
    return (password.value.length > 8);
}

let arePasswordMatching = function () {
    return (password.value === confirmPassword.value);
}

let canSubmit = function () {
    return (isPasswordValid() && arePasswordMatching());
}

let passwordEvent = function () {
    //Find out if password is valid  
    if (isPasswordValid()) {
        //Hide hint if valid
        spanList[0].style.display = 'none';
    } else {
        //else show int
        spanList[0].style.display = '';
    }
}

let confirmPasswordEvent = function () {
    //Find out if password is valid  
    if (arePasswordMatching()) {
        //Hide hint if valid
        spanList[1].style.display = 'none';
    } else {
        //else show int
        spanList[1].style.display = '';
    }
}

formSign.addEventListener("change", function (E) {
    campos = document.querySelectorAll("#formSignUp input:invalid");
    passwordEvent();
    confirmPasswordEvent();

    if (campos.length == 0 && canSubmit()) {
        submit.disabled = false;
    }
});


let sendData = function() {
    console.log('Si entré wey');

    let data = {
        email : email.value,
        password : password.value
    };

    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: POST actualizar archivo
    xhr.open('POST','https://localhost:8080/api/signup');
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // 4. Enviar solicitud al servidor
    xhr.send(JSON.stringify(data));

    console.log(JSON.stringify(data));
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 201) { // analizar el estatus de la respuesta HTTP
            // Ocurrió un error
            //alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            alert(xhr.status + ': ' + xhr.statusText);
        
        } else {
            //console.log(xhr.responseText); // Significa que fue exitoso
            alert(xhr.responseText);
            window.location.href = "../index.html";
        }
    };

    return false;
}