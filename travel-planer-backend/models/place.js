import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPlaces = async (req, res) => {
  const { tripId } = req.params;
  try {
    const places = await prisma.place.findMany({
      where: { tripId: parseInt(tripId) },
      orderBy: { dayNumber: "asc" },
    });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Error fetching places" });
  }
};
