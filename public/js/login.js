/* eslint-disable */
import 'dotenv/config';
import axios from 'axios';
import { showAlert } from './alerts';

const url = process.env.APP_URL;

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'post',
            url: `${url}/api/v1/users/login`,
            data: {
                email,
                password,
            },
        });
        if (res.data.status === 'success') {
            showAlert('success', 'You are logged in.');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'get',
            url: `${url}/api/v1/users/logout`,
        });
        if (res.data.status === 'success') {
            showAlert('success', 'You are logged out.');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
