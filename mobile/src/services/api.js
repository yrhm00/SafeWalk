import axios from "axios";

const API_URL = "https://meningeal-overemotionally-remedios.ngrok-free.dev/"; // <-- change avec "ton ipv4 local" + :3001 

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
