// controllers/inviteController.js
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

/**
 * Надіслати інвайт користувачу за email
 */
export const sendInvite = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email } = req.body;

    const senderId = req.user.id;

    // Знаходимо подорож
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Перевіряємо власника
    if (trip.ownerId !== senderId)
      return res.status(403).json({ message: "Only the owner can send invites" });

    // Перевірка — не запрошувати себе
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.id === senderId)
      return res.status(400).json({ message: "You cannot invite yourself" });

    // Перевіряємо, чи є вже активний інвайт
    const existing = await prisma.invite.findFirst({
      where: {
        tripId: trip.id,
        email,
        status: "PENDING",
      },
    });

    if (existing)
      return res.status(400).json({ message: "Invite already sent to this email" });

    // Створюємо токен
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

    // === Налаштовуємо Nodemailer ===
    const transporter = nodemailer.createTransport({
      service: "gmail", // або інший поштовий сервіс
      auth: {
        user: process.env.EMAIL_USER, // твій email
        pass: process.env.EMAIL_PASS, // пароль або app password
      },
    });

    const inviteLink = `http://localhost:5050/api/invites/accept/${token}`;

    const mailOptions = {
      from: `"Travel Planner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invitation to join trip: ${trip.title}`,
      html: `
        <h3>You've been invited to join the trip "${trip.title}"</h3>
        <p>Click the link below to accept the invite (valid for 24 hours):</p>
        <a href="${inviteLink}">${inviteLink}</a>
        <p>Best regards,<br/>Travel Planner Team</p>
      `,
    };

    // Відправка листа
    await transporter.sendMail(mailOptions);

    res.json({ message: "Invite email sent successfully", invite });
  } catch (error) {
    console.error("❌ Error sending invite:", error);
    res.status(500).json({ message: error.message });
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

    if (!invite)
      return res.status(404).json({ message: "Invite not found or expired" });

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
