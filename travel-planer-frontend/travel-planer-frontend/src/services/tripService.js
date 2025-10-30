import axios from "axios";

const API_URL = "http://localhost:5050/api/trips";

export const getTrips = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Токен відсутній");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ критично
    },
  });

  return response.data;
};

export const createTrip = async (tripData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, tripData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
