import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5001/api/auth' });

export const loginApi = (formData) => API.post('/login', formData);
export const registerApi = (formData) => API.post('/register', formData);