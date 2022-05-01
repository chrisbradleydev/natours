/* eslint-disable */
import 'dotenv/config';
import axios from 'axios';
import { showAlert } from './alerts';

const url = process.env.APP_URL;

// type is either data or password
export const updateSettings = async (data, type) => {
    try {
        const res = await axios({
            method: 'patch',
            url: `${url}/api/v1/users/${type === 'password' ? 'updateMyPassword' : 'updateMe'}`,
            data,
        });
        if (res.data.status === 'success') {
            showAlert('success', `Your ${type} has been updated.`);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
