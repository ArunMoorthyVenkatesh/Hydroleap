import axios from "axios";

// ✅ Dynamically use .env variable or fallback to localhost
const API = axios.create({
baseURL: process.env.REACT_APP_API_BASE || "http://localhost:5001/api",
});

// ✅ Set JSON headers
API.defaults.headers.post["Content-Type"] = "application/json";

// ✅ Enable credentials if needed (cookies/sessions)
API.defaults.withCredentials = true;

// 🔐 Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const requestSignup = (data) => API.post("/auth/request-signup", data);

// 📝 Notes
export const createNote = (noteData, token) =>
  API.post("/notes", noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const fetchNotes = (token) =>
  API.get("/notes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default API;
