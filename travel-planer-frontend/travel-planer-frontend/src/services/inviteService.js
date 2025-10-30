import api from "./api";

// Мок-запит для надсилання запрошення (імітація email)
export const sendInvite = async ( tripId, email ) => {

  try {
    const res = await api.post("/invites", { tripId, email });
    return res.data;
  } catch (error) {
    console.error("❌ sendInvite error:", error.response?.data || error.message);
    throw error;
  }
};
