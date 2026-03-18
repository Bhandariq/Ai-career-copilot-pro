import axios from "axios";

const API = "https://ai-career-copilot-pro.onrender.com";

const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = async (data) => {
  try {
    const res = await api.post("/signup", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "Signup failed" };
  }
};

export const login = async (data) => {
  try {
    const res = await api.post("/login", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "Login failed" };
  }
};

export const chat = async (message, token) => {
  try {
    const res = await api.post(
      "/chat",
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "Chat failed" };
  }
};