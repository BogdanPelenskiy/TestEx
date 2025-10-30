import axios from "axios";

const API_URL = "http://localhost:5050/api/auth";

export const register = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const login = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  localStorage.setItem("token", response.data.token);
  return response.data;
};
