import prisma from "../lib/prisma.js";
import crypto from "crypto";

export const sendInvite = async (req, res) => {
  try {
    const { tripId, email } = req.body;

    if (!tripId || !email) {
      return res.status(400).json({ message: "Необхідно вказати tripId та email" });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return res.status(404).json({ message: "Подорож не знайдена" });
    }

    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = await prisma.invite.create({
      data: {
        tripId,
        email,
        token,
        expiresAt,
      },
    });

    console.log(`📨 Mock: запрошення на ${email} → подорож "${trip.title}"`);

    res.json({ message: "✅ Запрошення створено (mock)", invite });
  } catch (error) {
    console.error("❌ sendInvite error:", error);
    res.status(500).json({ message: "Помилка при створенні запрошення" });
  }
};
