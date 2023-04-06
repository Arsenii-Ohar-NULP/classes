import { apiUrl, accessTokenKey, accessTokenServerKey } from '../shared/api.js';

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

function login(e) {
    if (!validate(e)) {
        return;
    }

    const username = document.forms.form.username.value;
    const password = document.forms.form.password.value;
    const loginUrl = `${apiUrl}/api/v1/user/login`;
    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            e.preventDefault();
            e.stopPropagation();
            throw new Error(response.status.toString());
        })
        .then((data) => {
            sessionStorage.setItem(accessTokenKey, data[accessTokenServerKey]);
            window.location.href = './classes/classes.html';
        }).catch((err) => {
            console.log(err);
        });
}

const button = document.getElementById('loginButton');
button.addEventListener('click', login);

if (sessionStorage.getItem(accessTokenKey) !== undefined
    && sessionStorage.getItem(accessTokenKey) != null) {
    // TODO: Redirect to classes
    // This is dumb but still works for these purposes
    window.location.href = './classes/classes.html';
}
