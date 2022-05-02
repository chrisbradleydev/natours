/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// dom elements
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const popupCloseButtons = document.getElementsByClassName('mapboxgl-popup-close-button');
const bookBtn = document.getElementById('book-tour');

if (mapbox) {
    const locations = JSON.parse(mapbox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (userDataForm) {
    userDataForm.addEventListener('submit', async event => {
        event.preventDefault();
        const saveBtnElem = document.querySelector('.btn--update-profile');
        const saveBtnText = saveBtnElem.textContent;
        saveBtnElem.textContent = 'Updating...';

        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        await updateSettings(form, 'profile');

        saveBtnElem.textContent = saveBtnText;
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async event => {
        event.preventDefault();
        const saveBtnElem = document.querySelector('.btn--update-password');
        const saveBtnText = saveBtnElem.textContent;
        saveBtnElem.textContent = 'Updating...';

        const passwordCurrentElem = document.getElementById('password-current');
        const passwordElem = document.getElementById('password');
        const passwordConfirmElem = document.getElementById('password-confirm');

        const passwordCurrent = passwordCurrentElem.value;
        const password = passwordElem.value;
        const passwordConfirm = passwordConfirmElem.value;
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

        saveBtnElem.textContent = saveBtnText;
        passwordCurrentElem.value = '';
        passwordElem.value = '';
        passwordConfirmElem.value = '';
    });
}

if (popupCloseButtons) {
    // blur popup close button
    Array.from(popupCloseButtons).forEach(closeButton => {
        closeButton.blur();
    });
}

if (bookBtn) {
    bookBtn.addEventListener('click', async event => {
        event.target.textContent = 'Processing...';
        const { tourId } = event.target.dataset;
        bookTour(tourId);
    });
}
