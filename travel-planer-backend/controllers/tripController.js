import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Отримати всі подорожі користувача
export const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { ownerId: req.user.id },
      orderBy: { startDate: "asc" },
    });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching trips" });
  }
};

// Створити нову подорож
export const createTrip = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  try {
    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ownerId: req.user.id,
      },
    });
    console.log(trip)
    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

// Оновити подорож
export const updateTrip = async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;
  try {
    const trip = await prisma.trip.update({
      where: { id: parseInt(id) },
      data: { title, description, startDate, endDate },
    });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Error updating trip" });
  }
};

// Видалити подорож
export const deleteTrip = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.trip.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trip" });
  }
};
