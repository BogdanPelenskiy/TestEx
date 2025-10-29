import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === ROUTES ===
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/invites", inviteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
