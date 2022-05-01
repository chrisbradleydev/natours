/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

// dom elements
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');
const mapbox = document.getElementById('map');
const popupCloseButtons = document.getElementsByClassName('mapboxgl-popup-close-button');

if (mapbox) {
    const locations = JSON.parse(mapbox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        login(email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (popupCloseButtons) {
    // blur popup close button
    Array.from(popupCloseButtons).forEach(closeButton => {
        closeButton.blur();
    });
}
