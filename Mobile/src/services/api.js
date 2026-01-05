import axios from "axios";

const API_URL = "http://192.168.2.52:3001"; // <-- change avec "ton ipv4 local" + :3001 

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
