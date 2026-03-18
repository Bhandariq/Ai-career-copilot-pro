import axios from "axios";

// ✅ LIVE BACKEND URL (Render)
const API = "https://ai-career-copilot-pro.onrender.com";

// Create axios instance
const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================== AUTH ==================

// SIGNUP
export const signup = async (data) => {
  try {
    const res = await api.post("/signup", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "Signup failed" };
  }
};

// LOGIN
export const login = async (data) => {
  try {
    const res = await api.post("/login", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "Login failed" };
  }
};

// ================== CHAT ==================

// CHAT MESSAGE
export const chat = async (message, token) => {
  try {
    const res = await api.post(
      "/chat",
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
      }
    );
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "Chat failed" };
  }
};

// ================== HISTORY ==================

export const getHistory = async (token) => {
  try {
    const res = await api.get("/history", {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ FIXED
      },
    });
    return res.data;
  } catch (err) {
    return err.response?.data || { error: "History fetch failed" };
  }
};
