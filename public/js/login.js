
let email = document.getElementById('email');
let password = document.getElementById('password');
let span = document.getElementById('spanID');
let submit = document.getElementById('submit');
let formLogin = document.getElementById('formLogin');
let campos;

span.style.display = 'none';

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

