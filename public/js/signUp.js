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
