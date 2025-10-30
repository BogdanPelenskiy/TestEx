import prisma from "../lib/prisma.js";

export const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { collaborators: { some: { id: req.user.id } } },
        ],
      },
      include: {
        owner: true,
        collaborators: true,
        places: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(trips);
  } catch (error) {
    console.error("❌ getTrips error:", error);
    res.status(500).json({ message: "Помилка отримання подорожей" });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        owner: true,
        collaborators: true,
        places: true,
      },
    });

    if (!trip) return res.status(404).json({ message: "Подорож не знайдена" });
    res.json(trip);
  } catch (error) {
    console.error("❌ getTripById error:", error);
    res.status(500).json({ message: "Помилка отримання подорожі" });
  }
};

export const createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    if (!title)
      return res.status(400).json({ message: "Назва подорожі обов'язкова" });

    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        ownerId: req.user.id,
      },
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error("❌ createTrip error:", error);
    res.status(500).json({ message: "Помилка створення подорожі", error: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return res.status(404).json({ message: "Подорож не знайдена" });
    if (trip.ownerId !== req.user.id)
      return res.status(403).json({ message: "Немає прав для видалення" });

    await prisma.trip.delete({ where: { id } });
    res.json({ message: "Подорож видалена" });
  } catch (error) {
    console.error("❌ deleteTrip error:", error);
    res.status(500).json({ message: "Помилка видалення подорожі" });
  }
};
