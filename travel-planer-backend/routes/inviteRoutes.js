// routes/inviteRoutes.js
import express from "express";
import { sendInvite, acceptInvite } from "../controllers/inviteController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:tripId", authenticate, sendInvite);
router.get("/accept/:token", acceptInvite);

export default router;
