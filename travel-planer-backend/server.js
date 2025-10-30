import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tripRoutes from "./routes/tripRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import prisma from "./lib/prisma.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ CORS налаштування
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// ✅ Парсинг JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Тестовий ендпоінт
app.get("/", (req, res) => {
  res.json({ message: "✅ API працює!" });
});

// ✅ Основні маршрути
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/invites", inviteRoutes);

// ✅ Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порті ${PORT}`);
});
