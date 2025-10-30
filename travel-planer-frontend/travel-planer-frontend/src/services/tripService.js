import api from "./api";

// Отримати всі подорожі
export const getTrips = async () => {
  const res = await api.get("/trips");
  return res.data;
};

// Створити нову подорож
export const createTrip = async ({ title, description }) => {
  const res = await api.post("/trips", { title, description });
  return res.data;
};

// Видалити подорож
export const deleteTrip = async (id) => {
  const res = await api.delete(`/trips/${id}`);
  return res.data;
};
