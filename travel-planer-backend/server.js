import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());

// Auth маршрути
app.use("/api/auth", authRoutes);

// Trips маршрути
app.use("/api/trips", tripRoutes);
app.use("/api/places", placeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
