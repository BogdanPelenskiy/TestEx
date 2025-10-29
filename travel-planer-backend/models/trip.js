import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Отримати всі подорожі користувача
export const getTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } },
        ],
      },
      include: { collaborators: true, places: true },
    });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error });
  }
};

// Створити нову подорож
export const createTrip = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ message: "startDate cannot be after endDate" });
  }

  try {
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
    res.status(500).json({ message: "Error creating trip", error });
  }
};
