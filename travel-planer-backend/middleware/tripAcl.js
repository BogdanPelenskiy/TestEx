import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// allowedRoles: array, наприклад ['Owner','Collaborator'] або ['Owner']
export const requireTripRole = (allowedRoles = ['Owner','Collaborator']) => {
  return async (req, res, next) => {
    const tripId = req.params.id || req.params.tripId;
    if (!tripId) return res.status(400).json({ message: "trip id is required" });

    const trip = await prisma.trip.findUnique({ where: { id: tripId }});
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Owner?
    if (trip.ownerId === req.user.id) {
      req.trip = trip;
      req.tripRole = 'Owner';
      if (allowedRoles.includes('Owner')) return next();
      // Owner but not allowed -> continue to check if allowedRoles excludes Owner (rare)
    }

    // Collaborator?
    const collab = await prisma.collaboration.findUnique({
      where: { tripId_userId: { tripId, userId: req.user.id } }
    });

    if (collab) {
      req.trip = trip;
      req.tripRole = 'Collaborator';
      if (allowedRoles.includes('Collaborator')) return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  };
};
