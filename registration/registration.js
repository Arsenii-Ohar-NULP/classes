import { apiUrl } from '../shared/api.js';

const getInputValue = (key) => document.getElementById(key).value;
const validate = (e) => {
    const form = document.getElementById('form');
    if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        form.classList.add('was-validated');

        return false;
    }

    form.classList.add('was-validated');
    return true;
};

const redirectLogin = () => {
    window.location.href = '../index.html';
};
const signUp = async (e) => {
    // validation
    if (!validate(e)) {
        return;
    }

    const username = getInputValue('username');
    const firstName = getInputValue('firstName');
    const lastName = getInputValue('lastName');
    const password = getInputValue('password');
    const email = getInputValue('email');
    const phone = getInputValue('phone');

    const user = {
        username,
        firstName,
        lastName,
        email,
        password,
        phone,
    };

    const signUpUrl = `${apiUrl}/api/v1/user`;
    await fetch(
        signUpUrl,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        },
    ).then((response) => {
        if (response.ok) {
            redirectLogin();
        }
        e.preventDefault();
        e.stopPropagation();
        return response.json();
    }).then((error) => {
        alert(error.msg);
    });
};

const button = document.getElementById('signUpButton');
button.addEventListener('click', signUp);
