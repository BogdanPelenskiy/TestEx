import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  getPlaces,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placeController.js";

const router = express.Router();

router.use(authenticate);

router.get("/:tripId", getPlaces);
router.post("/:tripId", createPlace);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);

export default router;
