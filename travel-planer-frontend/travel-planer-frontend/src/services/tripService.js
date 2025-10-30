import api from "./api";

// Отримати всі подорожі
export const getTrips = async () => {
  const res = await api.get("/trips");
  return res.data;
};

// Створити подорож
export const createTrip = async (tripData) => {
  const res = await api.post("/trips", tripData);
  return res.data;
};

// 🗑️ Видалити подорож
export const deleteTrip = async (tripId) => {
  const res = await api.delete(`/trips/${tripId}`);
  return res.data;
};
