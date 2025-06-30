import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const loginUser = (data) => API.post("/auth/login", data);
export const requestSignup = (data) => API.post("/auth/request-signup", data); // 🔥 updated

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