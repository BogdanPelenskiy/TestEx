import express from "express";
import { sendInvite } from "../controllers/inviteController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, sendInvite);

export default router;
