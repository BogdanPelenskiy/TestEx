import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api", // або твоя адреса бекенду
});

// 🔐 додаємо токен авторизації до кожного запиту
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
