const prisma = require("../config/prisma");

const createShare = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: req.params.tripId, userId: req.user.id } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const publicId = `${trip.slug}-${Math.random().toString(36).slice(2, 8)}`;
    const sharedTrip = await prisma.sharedTrip.create({
      data: { tripId: trip.id, userId: req.user.id, publicId, canCopy: req.body.canCopy !== false }
    });
    await prisma.trip.update({ where: { id: trip.id }, data: { isPublic: true } });
    res.status(201).json({ sharedTrip });
  } catch (error) {
    next(error);
  }
};

const getPublicTrip = async (req, res, next) => {
  try {
    const sharedTrip = await prisma.sharedTrip.update({
      where: { publicId: req.params.publicId },
      data: { views: { increment: 1 } },
      include: {
        trip: {
          include: {
            user: { select: { firstName: true, lastName: true, avatarUrl: true } },
            stops: { include: { activities: true }, orderBy: { order: "asc" } },
            budget: true,
            activities: true,
            notes: true,
            packingItems: true
          }
        }
      }
    });
    res.json({ sharedTrip });
  } catch (error) {
    res.status(404);
    next(new Error("Shared trip not found"));
  }
};

const copyPublicTrip = async (req, res, next) => {
  try {
    const sharedTrip = await prisma.sharedTrip.findUnique({
      where: { publicId: req.params.publicId },
      include: { trip: { include: { stops: true, activities: true, budget: true } } }
    });
    if (!sharedTrip || !sharedTrip.canCopy) return res.status(403).json({ message: "Trip cannot be copied" });

    const source = sharedTrip.trip;
    const copy = await prisma.trip.create({
      data: {
        userId: req.user.id,
        title: `${source.title} Copy`,
        slug: `${source.slug}-copy-${Date.now()}`,
        description: source.description,
        coverImage: source.coverImage,
        startDate: source.startDate,
        endDate: source.endDate,
        status: "SAVED",
        budget: source.budget ? { create: {
          total: source.budget.total,
          hotels: source.budget.hotels,
          transport: source.budget.transport,
          food: source.budget.food,
          activities: source.budget.activities,
          currency: source.budget.currency
        } } : undefined,
        stops: {
          create: source.stops.map((stop) => ({
            city: stop.city,
            country: stop.country,
            arrivalDate: stop.arrivalDate,
            departDate: stop.departDate,
            order: stop.order,
            notes: stop.notes
          }))
        },
        activities: {
          create: source.activities.map((activity) => ({
            title: activity.title,
            category: activity.category,
            description: activity.description,
            dayNumber: activity.dayNumber,
            startTime: activity.startTime,
            duration: activity.duration,
            cost: activity.cost,
            location: activity.location
          }))
        }
      }
    });
    res.status(201).json({ trip: copy });
  } catch (error) {
    next(error);
  }
};

module.exports = { createShare, getPublicTrip, copyPublicTrip };
