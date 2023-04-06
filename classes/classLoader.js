/* eslint-disable no-restricted-syntax */
import { accessTokenKey, apiUrl } from '../shared/api.js';

// let isSpinning = true;

const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

    return JSON.parse(jsonPayload);
};
const redirectToLogin = () => {
    sessionStorage.clear();
    window.location.href = '../index.html';
};
if (sessionStorage.getItem(accessTokenKey) == null
    || sessionStorage.getItem(accessTokenKey) === undefined) {
    redirectToLogin();
}
const token = parseJwt(sessionStorage.getItem(accessTokenKey));
console.log(token);
const userId = token.id;

const getImg = async (classId) => {
    const endpointUrl = `${apiUrl}/api/v1/class/img/${classId}`;
    const result = await fetch(
        endpointUrl,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    ).then((response) => {
        if (response.ok) {
            return response.json();
        }

        if (response.status === 401) {
            redirectToLogin();
        }

        throw new Error(response.status);
    });
    return result;
};

const getAllClasses = async () => {
    const endpointUrl = `${apiUrl}/api/v1/class`;
    return fetch(
        endpointUrl,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    ).then((response) => {
        if (response.ok) {
            return response;
        }

        throw new Error("Coudln't fetch classes");
    });
};

const addToTopClasses = (classDiv) => {
    const classes = document.getElementById('coursesForYou');
    classes.appendChild(classDiv);
};

const addToAssignedClasses = (classDiv) => {
    const classes = document.getElementById('currentClasses');
    classes.appendChild(classDiv);
};
const imgElement = (image) => {
    const img = document.createElement('img');
    img.setAttribute('src', `data:image/png; base64, ${image}`);
    img.setAttribute('width', '215');
    img.setAttribute('height', '112');
    img.setAttribute('class', 'rounded');

    return img;
};

const infoElement = (cls) => {
    const infoDiv = document.createElement('div');
    infoDiv.setAttribute('class', 'vstack align-middle');
    const titleParagraph = document.createElement('p');
    titleParagraph.setAttribute('class', 'fs-5 m-0 p-1 py-1 text-wrap');
    titleParagraph.appendChild(document.createTextNode(cls.title));
    const authorParagraph = document.createElement('p');
    authorParagraph.setAttribute('class', 'fs-6 px-1 m-0');
    authorParagraph.appendChild(document.createTextNode(`${cls.teacher_first_name} ${cls.teacher_last_name}`));
    infoDiv.appendChild(titleParagraph);
    infoDiv.appendChild(authorParagraph);

    return infoDiv;
};

const createClass = (cls, numberOfClass) => {
    const columns = {
        1: 'col-sm',
        2: 'col-sm',
        3: 'col-md',
        4: 'col-lg',
        5: 'col-lg',
    };
    const a = document.createElement('a');
    a.setAttribute('href', 'class.html');
    a.setAttribute('class', 'text-center');
    const div = document.createElement('div');
    a.setAttribute('class', `${columns[numberOfClass]} text-center`);

    const img = imgElement(cls.image);
    const infoDiv = infoElement(cls);
    a.appendChild(img);
    a.appendChild(infoDiv);
    div.appendChild(a);
    div.setAttribute('class', 'col-sm justify-content-center');

    return div;
};

const getAssignedClasses = async () => {
    const assignedApiEndpoint = `${apiUrl}/api/v1/classes/${userId}`;
    const accessToken = sessionStorage.getItem(accessTokenKey);

    return fetch(
        assignedApiEndpoint,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        },
    ).then((response) => {
        if (response.ok) {
            return response;
        }

        if (response.status === 401) {
            redirectToLogin();
        }

        throw new Error(response.status);
    });
};

const noAssignedClassesHandler = () => {
    const noClasses = document.getElementById('noClassesAssignedDiv');
    noClasses.setAttribute('class', 'm-2');
};

const showAssignedClasses = async (classes) => {
    console.log(classes);
    let i = 1;
    for (const clas of classes) {
        cls.image = (await getImg(cls.id)).thumbnail;
        if (i <= 5) {
            const classDiv = createClass(clas, i);
            addToAssignedClasses(classDiv);
            i += 1;
            continue;
        }
        break;
    }
};

const listAssigned = async (limit) => {
    const assignedResponse = await getAssignedClasses();

    if (assignedResponse.status !== 200) {
        console.log('Something went wrong');
        console.log(assignedResponse);
        return;
    }
    const assignedClasses = await assignedResponse.json();

    if (assignedClasses.length === 0) {
        noAssignedClassesHandler();
    }

    showAssignedClasses(assignedClasses, limit);
};

const listClasses = async (limit) => {
    const response = await getAllClasses();

    if (response.ok) {
        console.log('Getting classes: ');
        const classes = await response.json();

        let i = 1;
        for (const cls of classes) {
            if (i > limit) { return; }
            console.log(cls);
            cls.image = (await getImg(cls.id)).thumbnail;
            addToTopClasses(createClass(cls, i));
            i += 1;
        }
    }

    if (response.status === 401) {
        redirectToLogin();
    }
};

const changeProfilePic = async (username) => {
    const avatar = `https://api.dicebear.com/6.x/lorelei/svg/seed=${username}`;
    const profilePic = document.getElementById('profilePic');
    profilePic.setAttribute('src', avatar);
};

const assignLogoutButton = () => {
    const button = document.getElementById('logoutButton');
    button.addEventListener('click', (e) => {
        sessionStorage.clear();
        redirectToLogin();
    });
};

Promise.all([listClasses(5), listAssigned(5)]).then(() => {
    const classesDivId = 'classesForYouDiv';
    const spinnerId = 'spinner';
    const userClassesId = 'currentClassesDiv';

    const userClassesDiv = document.getElementById(userClassesId);
    const classesDiv = document.getElementById(classesDivId);
    const spinner = document.getElementById(spinnerId);

    classesDiv.setAttribute('class', classesDiv.getAttribute('class').replace(' visually-hidden', ''));
    spinner.setAttribute('class', `${spinner.getAttribute('class')} visually-hidden`);
    // isSpinning = false;

    userClassesDiv.setAttribute('class', userClassesDiv.getAttribute('class').replace(' visually-hidden', ''));
})
    .catch((err) => {
        console.log('Something went wrong');
        console.log(err);
    });

const username = parseJwt(sessionStorage.getItem(accessTokenKey)).sub;
changeProfilePic(username);
assignLogoutButton();
