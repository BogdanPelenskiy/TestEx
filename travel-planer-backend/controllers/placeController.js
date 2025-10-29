import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPlaces = async (req, res) => {
  const { tripId } = req.params;

  try {
    const places = await prisma.place.findMany({
      where: { tripId },
      orderBy: { dayNumber: "asc" },
    });
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching places" });
  }
};

export const createPlace = async (req, res) => {
  const { tripId } = req.params;
  const { locationName, notes, dayNumber } = req.body;

  if (dayNumber < 1) {
    return res.status(400).json({ message: "dayNumber must be ≥ 1" });
  }

  try {
    const place = await prisma.place.create({
      data: { tripId, locationName, notes, dayNumber },
    });
    res.status(201).json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating place" });
  }
};

export const updatePlace = async (req, res) => {
  const { id } = req.params;
  const { locationName, notes, dayNumber } = req.body;

  try {
    const place = await prisma.place.update({
      where: { id },
      data: { locationName, notes, dayNumber },
    });
    res.json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating place" });
  }
};

export const deletePlace = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.place.delete({ where: { id } });
    res.json({ message: "Place deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting place" });
  }
};
