import axios from "axios";

const API_URL = "http://localhost:5050/api/trips";

// ✅ Отримати всі подорожі
export const getTrips = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Створити подорож
export const createTrip = async (tripData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, tripData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Видалити подорож
export const deleteTrip = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
