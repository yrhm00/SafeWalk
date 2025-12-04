import axios from "axios";
import { authStore } from "../store/authStore";

const api = axios.create({
  baseURL: "http://192.168.1.20:3000/api", // ← change vers ton IP locale
});

api.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
