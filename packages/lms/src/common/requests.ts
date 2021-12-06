import axios from 'axios';
import { API_ENDPOINT } from './constants';

export const getCookie = (name: string) => {
  const result = document.cookie.match('\\b' + name + '=([^;]*)\\b');
  return result ? result[1] : undefined;
};

export const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'X-CSRFToken': getCookie('_xsrf'),
  },
});
