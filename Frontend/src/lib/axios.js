import axios from "axios";

// in production, there's no localhost so we have to make this dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8001" : "/";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export default api;