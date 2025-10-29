import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../controllers/tripController.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getTrips);
router.post("/", createTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;
