import api from "./api";

// Отримати всі подорожі (для зручності, якщо використовується на сторінці)
export const getTrips = async () => {
  const res = await api.get("/trips");
  return res.data;
};

// Створити нову подорож (якщо тут теж використовується)
export const createTrip = async (title, description) => {
  const res = await api.post("/trips", { title, description });
  return res.data;
};

// Видалити подорож
export const deleteTrip = async (id) => {
  const res = await api.delete(`/trips/${id}`);
  return res.data;
};

// ✅ Надіслати запрошення другові
export const sendInvite = async (tripId, email) => {
  const res = await api.post(`/invites`, { tripId, email });
  return res.data;
};
