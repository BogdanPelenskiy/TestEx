// controllers/inviteController.js
import prisma from "../lib/prisma.js";
// import nodemailer from "nodemailer"; // ❌ тимчасово не потрібно

export const sendInvite = async (req, res) => {
  try {
    const { tripId, email } = req.body;

    if (!tripId || !email) {
      return res.status(400).json({ message: "tripId та email обов'язкові" });
    }

    // Знайти подорож
    const trip = await prisma.trip.findUnique({ where: { id: Number(tripId) } });
    if (!trip) return res.status(404).json({ message: "Подорож не знайдена" });

    // Створити інвайт у БД
    const invite = await prisma.invite.create({
      data: { tripId: Number(tripId), email },
    });

    // 🧩 Мок відправки (замість реального nodemailer)
    console.log(`📨 [MOCK] Запрошення надіслано на ${email} для подорожі "${trip.title}"`);

    // Імітація затримки відправки
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Повернути успіх
    res.json({ message: "Мок-запрошення успішно відправлено!", invite });
  } catch (error) {
    console.error("❌ sendInvite error:", error);
    res.status(500).json({ message: "Помилка при мок-відправленні запрошення", error: error.message });
  }
};
