import axios from "axios";

const API = "http://127.0.0.1:8000";

export const signup = (data) => axios.post(`${API}/signup`, data);
export const login = (data) => axios.post(`${API}/login`, data);

export const chat = (msg, token) =>
  axios.post(`${API}/chat`,
    { message: msg },
    { headers: { Authorization: token } }
  );

export const getHistory = (token) =>
  axios.get(`${API}/history`, {
    headers: { Authorization: token }
  });