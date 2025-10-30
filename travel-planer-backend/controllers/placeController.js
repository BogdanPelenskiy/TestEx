import prisma from "../lib/prisma.js";


export const getPlacesByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const places = await prisma.place.findMany({
      where: { tripId },
      orderBy: { dayNumber: "asc" },
    });

    res.json(places);
  } catch (error) {
    console.error("❌ getPlacesByTrip error:", error);
    res.status(500).json({ message: "Помилка отримання місць" });
  }
};


export const createPlace = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { locationName, notes, dayNumber } = req.body;

    if (!locationName) {
      return res.status(400).json({ message: "Назва місця обов’язкова" });
    }

    // Перевіримо, що подорож існує
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return res.status(404).json({ message: "Подорож не знайдена" });
    }

    const place = await prisma.place.create({
      data: {
        locationName,
        notes,
        dayNumber: dayNumber ? Number(dayNumber) : 1,
        tripId,
      },
    });

    res.status(201).json(place);
  } catch (error) {
    console.error("❌ createPlace error:", error);
    res.status(500).json({ message: "Помилка створення місця" });
  }
};


export const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return res.status(404).json({ message: "Місце не знайдене" });
    }

    await prisma.place.delete({ where: { id } });
    res.json({ message: "Місце видалено" });
  } catch (error) {
    console.error("❌ deletePlace error:", error);
    res.status(500).json({ message: "Помилка видалення місця" });
  }
};
