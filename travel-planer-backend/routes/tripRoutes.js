import express from "express";
import { createTrip, getTrips, deleteTrip } from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// захистимо всі маршрути після цього рядка
router.use(protect);

router.post("/", createTrip);
router.get("/", getTrips);
router.delete("/:id", deleteTrip);


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const trip = await prisma.trip.findUnique({
    where: { id: Number(id) },
    include: { Invites: true },
  });

  if (!trip) return res.status(404).json({ message: "Trip not found" });
  res.json(trip);
});

export default router;
