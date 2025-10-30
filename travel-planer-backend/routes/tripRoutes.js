import express from "express";
import { createTrip, getTrips, deleteTrip } from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// захистимо всі маршрути після цього рядка
router.use(protect);

router.post("/", createTrip);
router.get("/", getTrips);
router.delete("/:id", deleteTrip);

export default router;
