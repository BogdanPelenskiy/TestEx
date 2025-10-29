// src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// === твої функції ===
export async function fetchTrips() {
  const res = await api.get("/trips");
  return res.data;
}

export async function createTrip(data) {
  const res = await api.post("/trips", data);
  return res.data;
}

export default api; // 🔥 важливо додати цей експорт
