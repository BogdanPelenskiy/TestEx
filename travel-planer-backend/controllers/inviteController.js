// controllers/inviteController.js
import { prisma } from "../lib/prisma.js";

import jwt from "jsonwebtoken";

/**
 * Надіслати інвайт користувачу за email
 */
export const sendInvite = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email } = req.body;

    // Отримуємо поточного користувача (Owner)
    const senderId = req.user.id;

    // Знаходимо подорож
    const trip = await prisma.trip.findUnique({
      where: { id: Number(tripId) },
    });

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Перевіряємо, чи це Owner
    if (trip.ownerId !== senderId)
      return res.status(403).json({ message: "Only the owner can send invites" });

    // Перевірка — не запрошувати себе
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.id === senderId)
      return res.status(400).json({ message: "You cannot invite yourself" });

    // Перевірка, чи є вже активний інвайт
    const existing = await prisma.invite.findFirst({
      where: {
        tripId: trip.id,
        email,
        status: "PENDING",
      },
    });

    if (existing)
      return res.status(400).json({ message: "Invite already sent to this email" });

    // Створюємо токен для інвайту (можна потім додати expiry)
    const token = jwt.sign(
      { tripId: trip.id, email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Зберігаємо інвайт
    const invite = await prisma.invite.create({
      data: {
        email,
        tripId: trip.id,
        token,
      },
    });

    // (Замість реальної відправки email просто лог)
    console.log(`📧 Invite link: http://localhost:5000/api/invites/accept/${token}`);

    res.json({ message: "Invite sent successfully", invite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Прийняти інвайт
 */
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { tripId, email } = decoded;

    const invite = await prisma.invite.findFirst({
      where: { tripId, email, token, status: "PENDING" },
    });

    if (!invite) return res.status(404).json({ message: "Invite not found or expired" });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "User not found. Register first!" });

    // Додаємо користувача як Collaborator
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        collaborators: {
          connect: { id: user.id },
        },
      },
    });

    // Оновлюємо статус інвайту
    await prisma.invite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" },
    });

    res.json({ message: "Invite accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
